import path from 'path';
import PathDetector from './pathDetector.js';

/**
 * Security utilities for VA MCP Server
 * Provides path validation, sandboxing, and input sanitization
 */
class Security {
  /**
   * Validate and sanitize a file path
   * Prevents path traversal attacks by ensuring paths stay within allowed directories
   * @param {string} filePath - Path to validate
   * @param {string} baseDir - Base directory to restrict access to
   * @returns {Object} - { valid: boolean, sanitized: string, error?: string }
   */
  static validatePath(filePath, baseDir = null) {
    if (!filePath || typeof filePath !== 'string') {
      return {
        valid: false,
        error: 'Invalid path: must be a non-empty string',
      };
    }

    // Get the vets-website root as default base directory
    const allowedBase = baseDir || PathDetector.getVetsWebsiteRoot();

    // Resolve to absolute path
    const resolvedPath = path.resolve(allowedBase, filePath);
    const normalizedBase = path.resolve(allowedBase);

    // Check if resolved path is within allowed directory
    if (!resolvedPath.startsWith(normalizedBase)) {
      return {
        valid: false,
        error: 'Path must be within the vets-website directory',
      };
    }

    // Additional checks for dangerous patterns
    const dangerousPatterns = [
      /\.\.[\/\\]/, // Parent directory references
      /\0/, // Null bytes
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(filePath)) {
        return {
          valid: false,
          error: 'Path contains invalid characters',
        };
      }
    }

    // For read operations, allow any path within vets-website
    // Write operations will have additional restrictions

    return {
      valid: true,
      sanitized: resolvedPath,
    };
  }

  /**
   * Validate search parameters
   * @param {string} searchTerm - Search term to validate
   * @param {string} searchField - Field to search in
   * @returns {Object} - { valid: boolean, error?: string }
   */
  static validateSearchParams(searchTerm, searchField) {
    // Check search term
    if (!searchTerm || typeof searchTerm !== 'string') {
      return {
        valid: false,
        error: 'Search term must be a non-empty string',
      };
    }

    // Limit search term length to prevent DoS
    if (searchTerm.length > 100) {
      return {
        valid: false,
        error: 'Search term too long (max 100 characters)',
      };
    }

    // Check for SQL injection patterns (even though we're not using SQL)
    const dangerousPatterns = [
      /[';]/, // SQL injection attempts
      /<script/i, // XSS attempts
      /javascript:/i, // XSS attempts
      /\0/, // Null bytes
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(searchTerm)) {
        return {
          valid: false,
          error: 'Search term contains invalid characters',
        };
      }
    }

    return { valid: true };
  }

  /**
   * Sanitize output to prevent XSS in responses
   * @param {any} data - Data to sanitize
   * @returns {any} - Sanitized data
   */
  static sanitizeOutput(data) {
    if (typeof data === 'string') {
      // Basic HTML entity encoding
      return data
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeOutput(item));
    }

    if (data && typeof data === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeOutput(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Check if a file operation is allowed
   * @param {string} operation - Operation type (read, write, scan)
   * @param {string} filePath - Path to check
   * @returns {Object} - { allowed: boolean, error?: string }
   */
  static checkFileOperation(operation, filePath) {
    // First validate the path
    const pathValidation = this.validatePath(filePath);
    if (!pathValidation.valid) {
      return {
        allowed: false,
        error: pathValidation.error,
      };
    }

    // Check operation-specific rules
    switch (operation) {
      case 'write':
        // Only allow writing to catalog files
        const allowedWritePaths = [
          'manifest-catalog.json',
          'web-component-patterns-catalog.json',
        ];
        const isAllowedWrite = allowedWritePaths.some(allowed =>
          pathValidation.sanitized.endsWith(allowed),
        );
        if (!isAllowedWrite) {
          return {
            allowed: false,
            error: 'Can only write to catalog.json files',
          };
        }
        break;

      case 'scan':
        // Only allow scanning specific directories
        const allowedScanDirs = [
          'src/applications',
          'src/platform/forms-system/src/js/web-component-patterns',
        ];
        const isAllowedScan = allowedScanDirs.some(allowed =>
          pathValidation.sanitized.includes(allowed),
        );
        if (!isAllowedScan) {
          return {
            allowed: false,
            error: 'Can only scan applications or patterns directories',
          };
        }
        break;
    }

    return {
      allowed: true,
      sanitizedPath: pathValidation.sanitized,
    };
  }
}

export default Security;
