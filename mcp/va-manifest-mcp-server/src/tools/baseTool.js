import fs from 'fs';
import path from 'path';
import Security from '../utils/security.js';
import logger from '../utils/logger.js';

/**
 * Base class for MCP tools with common functionality
 * Provides shared methods for file operations, catalog management, and response formatting
 * SECURITY: All file operations now include path validation
 */
class BaseTool {
  static _McpError;

  static _ErrorCode;

  /**
   * Initialize the tool with SDK components
   * @param {Object} sdk - MCP SDK components
   */
  static initialize(sdk) {
    this._McpError = sdk.McpError;
    this._ErrorCode = sdk.ErrorCode;
  }

  /**
   * Format a standard MCP tool response
   * @param {any} data - Data to include in response
   * @param {string} textFormat - Optional format for text representation
   * @returns {Object} - MCP tool response object
   */
  static formatResponse(data, textFormat = null) {
    const text = textFormat || JSON.stringify(data, null, 2);
    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * Read and parse a JSON file with proper error handling and security
   * @param {string} filePath - Path to the file (absolute or relative to vets-website root)
   * @param {string} errorContext - Context for error messages
   * @returns {Promise<Object>} - Parsed JSON content
   */
  static async readJsonFile(filePath, errorContext) {
    try {
      // Validate the path first
      const validation = Security.validatePath(filePath);
      if (!validation.valid) {
        throw new this._McpError(
          this._ErrorCode.InvalidParams,
          validation.error,
        );
      }

      // Check file operation permissions
      const opCheck = Security.checkFileOperation('read', validation.sanitized);
      if (!opCheck.allowed) {
        throw new this._McpError(this._ErrorCode.InvalidParams, opCheck.error);
      }

      const content = await fs.promises.readFile(opCheck.sanitizedPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      logger.error(`Failed to ${errorContext}`, {
        file: filePath,
        error: error.message,
      });

      // Re-throw if it's already an MCP error
      if (error.constructor.name === 'McpError' || error.code) {
        throw error;
      }

      throw new this._McpError(
        this._ErrorCode.InternalError,
        `Failed to ${errorContext}: ${error.message}`,
      );
    }
  }

  /**
   * Write JSON data to a file with proper error handling and security
   * @param {string} filePath - Path to the file (absolute or relative to vets-website root)
   * @param {Object} data - Data to write
   * @param {string} errorContext - Context for error messages
   * @returns {Promise<string>} - Absolute path of written file
   */
  static async writeJsonFile(filePath, data, errorContext) {
    try {
      // Validate the path first
      const validation = Security.validatePath(filePath);
      if (!validation.valid) {
        throw new this._McpError(
          this._ErrorCode.InvalidParams,
          validation.error,
        );
      }

      // Check file operation permissions
      const opCheck = Security.checkFileOperation(
        'write',
        validation.sanitized,
      );
      if (!opCheck.allowed) {
        throw new this._McpError(this._ErrorCode.InvalidParams, opCheck.error);
      }

      const directory = path.dirname(opCheck.sanitizedPath);

      // Validate directory path as well
      const dirValidation = Security.validatePath(directory);
      if (!dirValidation.valid) {
        throw new this._McpError(
          this._ErrorCode.InvalidParams,
          `Invalid directory path: ${dirValidation.error}`,
        );
      }

      await fs.promises.mkdir(directory, { recursive: true });

      await fs.promises.writeFile(
        opCheck.sanitizedPath,
        JSON.stringify(data, null, 2),
        'utf8',
      );

      logger.info(`File written successfully`, {
        path: opCheck.sanitizedPath,
        operation: errorContext,
      });

      return opCheck.sanitizedPath;
    } catch (error) {
      logger.error(`Failed to ${errorContext}`, {
        file: filePath,
        error: error.message,
      });

      // Re-throw if it's already an MCP error
      if (error.constructor.name === 'McpError' || error.code) {
        throw error;
      }

      throw new this._McpError(
        this._ErrorCode.InternalError,
        `Failed to ${errorContext}: ${error.message}`,
      );
    }
  }

  /**
   * Validate tool arguments with a schema
   * @param {Object} args - Arguments to validate
   * @param {Object} requiredParams - Map of param names to error messages
   * @throws {McpError} - If validation fails
   */
  static validateRequiredParams(args, requiredParams) {
    const errors = [];

    for (const [param, errorMessage] of Object.entries(requiredParams)) {
      if (!args || !args[param]) {
        errors.push(errorMessage);
      }
    }

    if (errors.length > 0) {
      logger.warn('Missing required parameters', { errors });
      throw new this._McpError(
        this._ErrorCode.InvalidParams,
        errors.join(', '),
      );
    }
  }

  /**
   * Generic search implementation for catalogs with input validation
   * @param {Array} items - Items to search
   * @param {string} searchTerm - Term to search for
   * @param {string} searchField - Field to search in or 'all'
   * @param {Object} fieldMapping - Map of field names to item property accessors
   * @returns {Array} - Filtered items matching search criteria
   */
  static searchItems(items, searchTerm, searchField, fieldMapping) {
    // Validate search inputs
    const validation = Security.validateSearchParams(searchTerm, searchField);
    if (!validation.valid) {
      throw new this._McpError(this._ErrorCode.InvalidParams, validation.error);
    }

    const searchLower = searchTerm.toLowerCase();

    return items.filter(item => {
      if (searchField === 'all') {
        // Search across all mapped fields
        return Object.values(fieldMapping).some(accessor => {
          const value = accessor(item);
          return (
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(searchLower)
          );
        });
      }
      // Search specific field
      const accessor = fieldMapping[searchField];
      if (!accessor) return false;

      const value = accessor(item);
      return (
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(searchLower)
      );
    });
  }

  /**
   * Create a summary object with counts and statistics
   * @param {Array} items - Items to summarize
   * @param {Function} categoryExtractor - Function to extract category from item
   * @returns {Object} - Summary with total count and category breakdown
   */
  static createSummary(items, categoryExtractor = null) {
    const summary = {
      totalCount: items.length,
      generatedAt: new Date().toISOString(),
    };

    if (categoryExtractor) {
      const categories = {};
      items.forEach(item => {
        const category = categoryExtractor(item) || 'uncategorized';
        categories[category] = (categories[category] || 0) + 1;
      });
      summary.categories = categories;
    }

    return summary;
  }

  /**
   * Handle errors consistently across all tools
   * @param {Error} error - The error to handle
   * @param {string} operation - The operation that failed
   * @throws {McpError} - Always throws a properly formatted MCP error
   */
  static handleError(error, operation) {
    // Log the error
    logger.error(`Operation failed: ${operation}`, error);

    // If it's already an MCP error, re-throw it
    if (error.constructor.name === 'McpError' || error.code) {
      throw error;
    }

    // Otherwise, wrap it in an MCP error
    throw new this._McpError(
      this._ErrorCode.InternalError,
      `Failed to ${operation}: ${error.message}`,
    );
  }
}

export default BaseTool;
