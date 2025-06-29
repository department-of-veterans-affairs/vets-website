import fs from 'fs';

let _McpError;
let _ErrorCode;

/**
 * Validation utilities for manifest files and other vets-website components
 */
class Validators {
  static initialize(sdk) {
    _McpError = sdk.McpError;
    _ErrorCode = sdk.ErrorCode;
  }

  /**
   * Validate a manifest.json file structure and content
   * @param {string} manifestPath - Path to the manifest file
   * @returns {Promise<Object>} - Validation results
   */
  static async validateManifest(manifestPath) {
    if (!manifestPath) {
      throw new _McpError(_ErrorCode.InvalidParams, 'manifestPath is required');
    }

    try {
      const content = await fs.promises.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(content);

      const validation = {
        valid: true,
        warnings: [],
        errors: [],
        manifest,
      };

      // Required fields check
      this.validateRequiredManifestFields(manifest, validation);

      // Type checks
      this.validateManifestFieldTypes(manifest, validation);

      // Format checks
      this.validateManifestFormats(manifest, validation);

      return validation;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          valid: false,
          warnings: [],
          errors: [`Invalid JSON syntax: ${error.message}`],
          manifest: null,
        };
      }
      throw new _McpError(
        _ErrorCode.InternalError,
        `Failed to validate manifest: ${error.message}`,
      );
    }
  }

  /**
   * Validate required fields are present in manifest
   * @param {Object} manifest - Parsed manifest object
   * @param {Object} validation - Validation results object to update
   */
  static validateRequiredManifestFields(manifest, validation) {
    const requiredFields = ['appName', 'entryName', 'rootUrl'];

    for (const field of requiredFields) {
      if (!manifest[field]) {
        validation.errors.push(`Missing required field: ${field}`);
        validation.valid = false;
      }
    }
  }

  /**
   * Validate field types in manifest
   * @param {Object} manifest - Parsed manifest object
   * @param {Object} validation - Validation results object to update
   */
  static validateManifestFieldTypes(manifest, validation) {
    const fieldTypes = {
      appName: 'string',
      entryName: 'string',
      rootUrl: 'string',
    };

    Object.entries(fieldTypes).forEach(([field, expectedType]) => {
      if (manifest[field] && typeof manifest[field] !== expectedType) {
        validation.errors.push(`${field} must be a ${expectedType}`);
        validation.valid = false;
      }
    });
  }

  /**
   * Validate field formats in manifest
   * @param {Object} manifest - Parsed manifest object
   * @param {Object} validation - Validation results object to update
   */
  static validateManifestFormats(manifest, validation) {
    // URL format check
    if (manifest.rootUrl) {
      if (!manifest.rootUrl.startsWith('/')) {
        validation.warnings.push('rootUrl should typically start with "/"');
      }

      // Check for common URL issues
      if (manifest.rootUrl.includes(' ')) {
        validation.errors.push('rootUrl should not contain spaces');
        validation.valid = false;
      }

      if (manifest.rootUrl.endsWith('/') && manifest.rootUrl.length > 1) {
        validation.warnings.push(
          'rootUrl should not end with "/" unless it is the root path',
        );
      }
    }

    // Entry name format check
    if (manifest.entryName) {
      if (manifest.entryName.includes(' ')) {
        validation.warnings.push(
          'entryName should not contain spaces (use kebab-case)',
        );
      }

      if (manifest.entryName !== manifest.entryName.toLowerCase()) {
        validation.warnings.push('entryName should be lowercase');
      }
    }

    // App name check
    if (manifest.appName) {
      if (manifest.appName.length < 3) {
        validation.warnings.push('appName seems very short');
      }

      if (manifest.appName.length > 100) {
        validation.warnings.push('appName seems very long');
      }
    }
  }

  /**
   * Validate catalog file structure
   * @param {Object} catalog - Parsed catalog object
   * @param {string} catalogType - Type of catalog ('manifest' or 'patterns')
   * @returns {Object} - Validation results
   */
  static validateCatalog(catalog, catalogType) {
    const validation = {
      valid: true,
      warnings: [],
      errors: [],
    };

    if (!catalog.title) {
      validation.errors.push('Catalog missing title');
      validation.valid = false;
    }

    if (!catalog.description) {
      validation.warnings.push('Catalog missing description');
    }

    if (catalogType === 'manifest') {
      if (!Array.isArray(catalog.applications)) {
        validation.errors.push('Manifest catalog missing applications array');
        validation.valid = false;
      } else {
        catalog.applications.forEach((app, index) => {
          this.validateCatalogApplication(app, index, validation);
        });
      }
    } else if (catalogType === 'patterns') {
      if (!Array.isArray(catalog.patterns)) {
        validation.errors.push('Patterns catalog missing patterns array');
        validation.valid = false;
      } else {
        catalog.patterns.forEach((pattern, index) => {
          this.validateCatalogPattern(pattern, index, validation);
        });
      }
    }

    return validation;
  }

  /**
   * Validate a single application entry in catalog
   * @param {Object} app - Application object
   * @param {number} index - Index in array
   * @param {Object} validation - Validation results object to update
   */
  static validateCatalogApplication(app, index, validation) {
    const requiredFields = ['directoryPath', 'appName', 'entryName', 'rootUrl'];

    requiredFields.forEach(field => {
      if (!app[field]) {
        validation.errors.push(`Application ${index}: missing ${field}`);
        validation.valid = false;
      }
    });
  }

  /**
   * Validate a single pattern entry in catalog
   * @param {Object} pattern - Pattern object
   * @param {number} index - Index in array
   * @param {Object} validation - Validation results object to update
   */
  static validateCatalogPattern(pattern, index, validation) {
    const requiredFields = ['filePath', 'name', 'componentType'];

    requiredFields.forEach(field => {
      if (!pattern[field]) {
        validation.errors.push(`Pattern ${index}: missing ${field}`);
        validation.valid = false;
      }
    });
  }

  /**
   * Validate search parameters
   * @param {string} searchTerm - Search term
   * @param {string} searchField - Field to search in
   * @param {Array} validFields - Valid field names
   * @returns {Object} - Validation results
   */
  static validateSearchParams(searchTerm, searchField, validFields) {
    const validation = {
      valid: true,
      errors: [],
    };

    if (!searchTerm || typeof searchTerm !== 'string') {
      validation.errors.push('searchTerm is required and must be a string');
      validation.valid = false;
    }

    if (searchField && !validFields.includes(searchField)) {
      validation.errors.push(
        `searchField must be one of: ${validFields.join(', ')}`,
      );
      validation.valid = false;
    }

    return validation;
  }
}

export default Validators;
