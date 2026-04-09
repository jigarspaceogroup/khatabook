/**
 * Sentry Error Tracking Configuration
 * Initializes Sentry SDK for error tracking, performance monitoring, and profiling
 *
 * Features:
 * - Exception tracking and reporting
 * - Performance monitoring with transaction tracking
 * - CPU profiling (optional)
 * - Environment-specific configuration
 * - Automatic error enrichment with request context
 *
 * Usage:
 * - Call initializeSentry() once at application startup (BEFORE other code)
 * - Sentry middleware is added in app.ts
 * - Errors are automatically captured by Sentry handlers
 * - Request ID and user context are automatically attached to errors
 */

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { config } from '../config';
import logger from './logger';

/**
 * Initialize Sentry error tracking and monitoring
 * Must be called early in application startup
 */
export function initializeSentry(): void {
  // Skip initialization if DSN is not configured
  if (!config.sentry.dsn) {
    logger.warn('Sentry is not configured (SENTRY_DSN not set). Error tracking is disabled.');
    return;
  }

  try {
    Sentry.init({
      // Basic configuration
      dsn: config.sentry.dsn,
      environment: config.app.env,

      // Performance monitoring (send 100% of transactions for debugging, reduce in production)
      tracesSampleRate: config.app.isProduction ? 0.1 : 1.0,

      // Profiling (CPU profiling - only in production for performance)
      profilesSampleRate: config.app.isProduction ? 0.1 : 0.0,

      // Integrations
      integrations: [
        // CPU profiling integration (optional, can be expensive)
        ...(config.app.isProduction ? [nodeProfilingIntegration()] : []),
      ],

      // Ignore specific errors (reduce noise)
      ignoreErrors: [
        // Browser extensions
        'chrome-extension://',
        'moz-extension://',

        // Random plugins/extensions
        'top.GLOBALS',

        // See http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',

        // https://github.com/getsentry/sentry-javascript/issues/289
        'evt.target.gdprApplies',
        'evt.target.eventID',
        'evt.target.eventIndex',
        'evt.target.isReady',

        // Network errors
        'NetworkError',
        'Network request failed',
      ],

      // Before sending to Sentry - additional filtering
      beforeSend: (event) => {
        // Filter out sensitive data
        if (event.request) {
          // Redact authorization headers
          if (event.request.headers) {
            event.request.headers['Authorization'] = '[REDACTED]';
          }
        }

        // Log locally for development
        if (config.app.isDevelopment) {
          logger.debug('Sentry event captured', {
            eventId: event.event_id,
            level: event.level,
            message: event.message,
          });
        }

        return event;
      },

      // Capture breadcrumbs (debug trail of events)
      maxBreadcrumbs: 50,

      // Client options
      enabled: true,
      serverName: `khatabook-api-${config.app.env}`,
      release: process.env['npm_package_version'] || 'unknown',
      maxValueLength: 1024,
      denyUrls: [
        // Ignore errors from browser extensions
        /chrome-extension:\/\//,
        /moz-extension:\/\//,
      ],
    });

    logger.info('Sentry initialized successfully', {
      environment: config.app.env,
      dsn: config.sentry.dsn.substring(0, 50) + '...', // Log truncated DSN
    });
  } catch (error) {
    logger.error('Failed to initialize Sentry', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Flush Sentry events (call before process exit)
 * Ensures pending events are sent to Sentry
 *
 * @param timeout - Timeout in milliseconds for flushing (default 2000ms)
 * @returns Promise that resolves when events are flushed or timeout is reached
 */
export async function flushSentry(timeout: number = 2000): Promise<boolean> {
  if (!config.sentry.dsn) {
    return true; // Already skipped, no need to flush
  }

  try {
    const result = await Sentry.close(timeout);
    logger.info('Sentry events flushed successfully');
    return result;
  } catch (error) {
    logger.error('Failed to flush Sentry events', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Capture exception manually (for non-automatic error scenarios)
 *
 * @param error - The error to capture
 * @param context - Additional context to attach to the error
 */
export function captureException(
  error: Error | string,
  context?: Record<string, any>
): string | null {
  if (!config.sentry.dsn) {
    logger.debug('Sentry is disabled, error not sent', { error });
    return null;
  }

  try {
    if (context) {
      Sentry.captureException(error, { extra: context });
    } else {
      Sentry.captureException(error);
    }

    logger.debug('Exception captured by Sentry', {
      error: error instanceof Error ? error.message : String(error),
    });

    const eventId = Sentry.lastEventId();
    return eventId || null;
  } catch (sentryError) {
    logger.error('Failed to capture exception in Sentry', {
      error: sentryError instanceof Error ? sentryError.message : String(sentryError),
    });
    return null;
  }
}

/**
 * Capture a message manually
 *
 * @param message - Message to capture
 * @param level - Log level (debug, info, warning, error, fatal)
 * @param context - Additional context
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): string | null {
  if (!config.sentry.dsn) {
    logger.debug('Sentry is disabled, message not sent', { message });
    return null;
  }

  try {
    Sentry.captureMessage(message, level);

    if (context) {
      Sentry.withScope((scope) => {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      });
    }

    logger.debug('Message captured by Sentry', { message, level });
    const eventId = Sentry.lastEventId();
    return eventId || null;
  } catch (error) {
    logger.error('Failed to capture message in Sentry', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Set user context for Sentry
 * Attaches user information to all subsequent events
 *
 * @param userId - Unique user identifier
 * @param userData - Additional user data (email, username, etc.)
 */
export function setUserContext(userId: string, userData?: Record<string, any>): void {
  if (!config.sentry.dsn) {
    return;
  }

  try {
    Sentry.setUser({
      id: userId,
      ...userData,
    });
  } catch (error) {
    logger.error('Failed to set Sentry user context', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Clear user context
 * Call this on logout
 */
export function clearUserContext(): void {
  if (!config.sentry.dsn) {
    return;
  }

  try {
    Sentry.setUser(null);
  } catch (error) {
    logger.error('Failed to clear Sentry user context', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Create a Sentry scope with custom context
 * Useful for attaching context to specific error captures
 *
 * @param fn - Function to execute within the scope
 */
export function withSentryScope<T>(
  fn: (scope: Sentry.Scope) => T,
  contextData?: Record<string, any>
): T {
  return Sentry.withScope((scope) => {
    if (contextData) {
      Object.entries(contextData).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    return fn(scope);
  });
}

/**
 * Add a breadcrumb to the Sentry trail
 * Breadcrumbs help debug what happened leading up to an error
 *
 * @param message - Breadcrumb message
 * @param level - Severity level (default: info)
 * @param category - Breadcrumb category (e.g., 'database', 'payment', 'auth')
 * @param data - Additional data
 */
export function addBreadcrumb(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  category: string = 'custom',
  data?: Record<string, any>
): void {
  if (!config.sentry.dsn) {
    return;
  }

  try {
    Sentry.addBreadcrumb({
      message,
      level,
      category,
      data,
      timestamp: Date.now() / 1000,
    });
  } catch (error) {
    logger.error('Failed to add Sentry breadcrumb', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export default {
  initializeSentry,
  flushSentry,
  captureException,
  captureMessage,
  setUserContext,
  clearUserContext,
  withSentryScope,
  addBreadcrumb,
};
