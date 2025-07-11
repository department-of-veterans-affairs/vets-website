/**
 * VA-compliant logging utility
 */
class Logger {
  constructor(context = 'MCP-Server') {
    this.context = context;
    this.enabled = process.env.NODE_ENV !== 'production';
  }

  info(message, metadata = {}) {
    if (this.enabled) {
      console.error(`[${this.context}] INFO: ${message}`, metadata);
    }
  }

  error(message, error = {}) {
    if (this.enabled) {
      const errorInfo =
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error;
      console.error(`[${this.context}] ERROR: ${message}`, errorInfo);
    }
  }

  warn(message, metadata = {}) {
    if (this.enabled) {
      console.error(`[${this.context}] WARN: ${message}`, metadata);
    }
  }

  debug(message, metadata = {}) {
    if (this.enabled && process.env.DEBUG) {
      console.error(`[${this.context}] DEBUG: ${message}`, metadata);
    }
  }

  child(childContext) {
    return new Logger(`${this.context}:${childContext}`);
  }
}

export default new Logger();
