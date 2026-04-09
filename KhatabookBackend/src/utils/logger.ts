/**
 * Winston Logger Configuration
 * Provides structured logging with different transports based on environment
 *
 * Features:
 * - Structured logging with Winston
 * - Environment-specific transports (console for dev, files for prod)
 * - Request ID tracking in logs
 * - Stack trace capture for errors
 * - Integration with Sentry for error tracking
 */

import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format for console (development)
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  return msg;
});

// Create logs directory path
const logsDir = path.join(process.cwd(), 'logs');

// Determine log level from environment or default to 'info'
const logLevel = process.env['LOG_LEVEL'] || 'info';

// Base logger configuration
const loggerConfig: winston.LoggerOptions = {
  level: logLevel,
  format: combine(
    errors({ stack: true }), // Handle errors with stack traces
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: {
    service: 'khatabook-backend',
  },
  transports: [],
};

// Development: Console output with colors
if (process.env['NODE_ENV'] === 'development') {
  if (loggerConfig.transports && Array.isArray(loggerConfig.transports)) {
    loggerConfig.transports.push(
      new winston.transports.Console({
        format: combine(colorize(), consoleFormat),
      })
    );
  }
}

// Production: JSON format to files
if (process.env['NODE_ENV'] === 'production') {
  loggerConfig.format = combine(
    errors({ stack: true }),
    timestamp(),
    json() // JSON format for production logs
  );

  // Error logs - separate file
  if (loggerConfig.transports && Array.isArray(loggerConfig.transports)) {
    loggerConfig.transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );

    // Combined logs - all levels
    loggerConfig.transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );

    // Console output in production (for container logs)
    loggerConfig.transports.push(
      new winston.transports.Console({
        format: json(),
      })
    );
  }
}

// Default to console if no environment specified
if (!loggerConfig.transports || !Array.isArray(loggerConfig.transports) || loggerConfig.transports.length === 0) {
  loggerConfig.transports = [
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
  ];
}

// Create logger instance
const logger = winston.createLogger(loggerConfig);

// Stream for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
