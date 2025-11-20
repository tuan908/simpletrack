// lib/server-actions/logger.ts

export interface Logger {
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, error?: Error, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}

/**
 * Production Logger - integrate with your observability stack
 * (DataDog, New Relic, Sentry, CloudWatch, etc.)
 */
export class ProductionLogger implements Logger {
  private context: Record<string, any>;

  constructor(context: Record<string, any> = {}) {
    this.context = context;
  }

  info(message: string, meta?: Record<string, any>): void {
    console.log(JSON.stringify({
      level: 'info',
      message,
      ...this.context,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
    // TODO: Send to your logging service
  }

  error(message: string, error?: Error, meta?: Record<string, any>): void {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
      ...this.context,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
    // TODO: Send to Sentry/error tracking service
  }

  warn(message: string, meta?: Record<string, any>): void {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      ...this.context,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify({
        level: 'debug',
        message,
        ...this.context,
        ...meta,
        timestamp: new Date().toISOString(),
      }));
    }
  }
}