import path from 'path';
import BaseTool from './baseTool.js';
import PathDetector from '../utils/pathDetector.js';
import FileScanner from '../utils/fileScanner.js';
import Validators from '../utils/validators.js';
import PathConfig from '../config/paths.js';

/**
 * Tools for working with application manifests in vets-website
 */
class ManifestTools extends BaseTool {
  /**
   * Get tool definitions for manifest-related operations
   * @returns {Array} - Array of tool definitions
   */
  static getToolDefinitions() {
    return [
      {
        name: 'scan_manifests',
        description:
          'Scan a directory for manifest.json files and extract metadata',
        inputSchema: {
          type: 'object',
          properties: {
            directory: {
              type: 'string',
              description: 'Directory path to scan for manifest.json files',
              default: PathConfig.manifests.sourceDirectory,
            },
          },
          required: ['directory'],
        },
      },
      {
        name: 'generate_manifest_catalog',
        description: 'Generate a complete manifest catalog JSON file',
        inputSchema: {
          type: 'object',
          properties: {
            sourceDirectory: {
              type: 'string',
              description: 'Source directory to scan',
              default: PathConfig.manifests.sourceDirectory,
            },
            outputFile: {
              type: 'string',
              description: 'Output catalog file path',
              default: PathConfig.manifests.catalogFile,
            },
          },
          required: ['sourceDirectory', 'outputFile'],
        },
      },
      {
        name: 'read_manifest_catalog',
        description: 'Read and return the current manifest catalog',
        inputSchema: {
          type: 'object',
          properties: {
            catalogFile: {
              type: 'string',
              description: 'Path to the manifest catalog file',
              default: PathConfig.manifests.catalogFile,
            },
          },
          required: ['catalogFile'],
        },
      },
      {
        name: 'search_applications',
        description: 'Search for applications in the manifest catalog',
        inputSchema: {
          type: 'object',
          properties: {
            searchTerm: {
              type: 'string',
              description: 'Term to search for',
            },
            searchField: {
              type: 'string',
              description:
                'Field to search in: all, appName, entryName, rootUrl, directoryPath',
              default: 'all',
            },
          },
          required: ['searchTerm'],
        },
      },
      {
        name: 'validate_manifest',
        description: 'Validate a manifest.json file structure',
        inputSchema: {
          type: 'object',
          properties: {
            manifestPath: {
              type: 'string',
              description: 'Path to the manifest.json file to validate',
            },
          },
          required: ['manifestPath'],
        },
      },
      {
        name: 'get_application_info',
        description: 'Get detailed information about a specific application',
        inputSchema: {
          type: 'object',
          properties: {
            appIdentifier: {
              type: 'string',
              description:
                'Application identifier (appName, entryName, or directoryPath)',
            },
            catalogFile: {
              type: 'string',
              description: 'Path to the manifest catalog file',
              default: PathConfig.manifests.catalogFile,
            },
          },
          required: ['appIdentifier'],
        },
      },
    ];
  }

  /**
   * Scan a directory for manifest.json files
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async scanManifests(args) {
    const { directory = PathConfig.manifests.sourceDirectory } = args || {};

    try {
      const manifests = await FileScanner.findManifests(directory);

      // Calculate statistics
      const stats = {
        totalManifests: manifests.length,
        byAppName: {},
        byRootUrl: {},
        directories: new Set(),
      };

      manifests.forEach(manifest => {
        // Count by appName
        if (manifest.appName) {
          stats.byAppName[manifest.appName] =
            (stats.byAppName[manifest.appName] || 0) + 1;
        }

        // Count by rootUrl prefix
        if (manifest.rootUrl) {
          const urlPrefix = manifest.rootUrl.split('/')[1] || 'root';
          stats.byRootUrl[urlPrefix] = (stats.byRootUrl[urlPrefix] || 0) + 1;
        }

        // Track unique directories
        stats.directories.add(path.dirname(manifest.filePath));
      });

      const summary = {
        totalManifests: stats.totalManifests,
        uniqueAppNames: Object.keys(stats.byAppName).length,
        uniqueDirectories: stats.directories.size,
        byAppName: stats.byAppName,
        byRootUrlPrefix: stats.byRootUrl,
      };

      return this.formatResponse({
        summary,
        manifests,
      });
    } catch (error) {
      this.handleError(error, 'scan manifests');
    }
  }

  /**
   * Generate a manifest catalog file
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async generateManifestCatalog(args) {
    const {
      sourceDirectory = PathConfig.manifests.sourceDirectory,
      outputFile = PathConfig.manifests.catalogFile,
    } = args || {};

    try {
      // Find all manifests
      const manifests = await FileScanner.findManifests(sourceDirectory);

      // Create catalog structure
      const catalog = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalApplications: manifests.length,
        applications: manifests.map(manifest => ({
          appName: manifest.appName,
          entryName: manifest.entryName,
          rootUrl: manifest.rootUrl,
          directoryPath: manifest.directoryPath,
          filePath: manifest.filePath,
          manifestData: manifest.manifestData,
        })),
      };

      // Write catalog file
      const absolutePath = await this.writeJsonFile(
        outputFile,
        catalog,
        'generate catalog',
      );

      // Create summary
      const summary = this.createSummary(
        manifests,
        m => m.rootUrl?.split('/')[1] || 'root',
      );

      return this.formatResponse({
        message: `Manifest catalog generated successfully`,
        catalogPath: absolutePath,
        summary,
      });
    } catch (error) {
      this.handleError(error, 'generate catalog');
    }
  }

  /**
   * Read the manifest catalog
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async readManifestCatalog(args) {
    const { catalogFile = PathConfig.manifests.catalogFile } = args || {};

    try {
      const catalog = await this.readJsonFile(catalogFile, 'read catalog');
      return this.formatResponse(catalog);
    } catch (error) {
      this.handleError(error, 'read catalog');
    }
  }

  /**
   * Search for applications in the catalog
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async searchApplications(args) {
    const { searchTerm, searchField = 'all' } = args || {};

    // Validate search parameters
    const validFields = [
      'all',
      'appName',
      'entryName',
      'rootUrl',
      'directoryPath',
    ];
    const validation = Validators.validateSearchParams(
      searchTerm,
      searchField,
      validFields,
    );

    if (!validation.valid) {
      throw new this._McpError(
        this._ErrorCode.InvalidParams,
        validation.errors.join(', '),
      );
    }

    try {
      // Scan manifests directly instead of reading from catalog file
      const { sourceDirectory } = PathConfig.manifests;
      const manifests = await FileScanner.findManifests(sourceDirectory);

      // Define field mapping for search
      const fieldMapping = {
        appName: m => m.appName,
        entryName: m => m.entryName,
        rootUrl: m => m.rootUrl,
        directoryPath: m => m.directoryPath,
      };

      // Use base class search method
      const matchingApps = this.searchItems(
        manifests,
        searchTerm,
        searchField,
        fieldMapping,
      );

      return this.formatResponse({
        searchTerm,
        searchField,
        totalResults: matchingApps.length,
        results: matchingApps.map(app => ({
          appName: app.appName,
          entryName: app.entryName,
          rootUrl: app.rootUrl,
          directoryPath: app.directoryPath,
          filePath: app.filePath,
        })),
      });
    } catch (error) {
      this.handleError(error, 'search applications');
    }
  }

  /**
   * Validate a manifest file
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async validateManifest(args) {
    const { manifestPath } = args || {};

    this.validateRequiredParams(args, {
      manifestPath: 'manifestPath is required',
    });

    try {
      const manifest = await this.readJsonFile(
        manifestPath,
        'read manifest for validation',
      );
      const validation = Validators.validateManifest(manifest);

      return this.formatResponse({
        path: manifestPath,
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        manifest: validation.valid ? manifest : null,
      });
    } catch (error) {
      // If we can't even read the file, it's definitely invalid
      return this.formatResponse({
        path: manifestPath,
        valid: false,
        errors: [`Failed to read manifest: ${error.message}`],
        warnings: [],
      });
    }
  }

  /**
   * Get detailed information about a specific application
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async getApplicationInfo(args) {
    const { appIdentifier, catalogFile = PathConfig.manifests.catalogFile } =
      args || {};

    this.validateRequiredParams(args, {
      appIdentifier: 'appIdentifier is required',
    });

    try {
      // Try to find the application by scanning directories
      const { sourceDirectory } = PathConfig.manifests;
      const manifests = await FileScanner.findManifests(sourceDirectory);

      // Search for the application
      const searchLower = appIdentifier.toLowerCase();
      const app = manifests.find(
        m =>
          m.appName?.toLowerCase() === searchLower ||
          m.entryName?.toLowerCase() === searchLower ||
          m.directoryPath?.toLowerCase().includes(searchLower),
      );

      if (!app) {
        return this.formatResponse({
          found: false,
          message: `No application found matching identifier: ${appIdentifier}`,
        });
      }

      // Get additional details
      const details = {
        found: true,
        application: {
          ...app,
          // Add computed properties
          urlPattern: app.rootUrl ? `${app.rootUrl}/*` : 'N/A',
          isFormApp:
            app.manifestData?.additionalRoutes?.some(r => r.includes('form')) ||
            false,
          hasAuthentication: app.manifestData?.vaRequired || false,
          fileSize: app.manifestData
            ? JSON.stringify(app.manifestData).length
            : 0,
        },
      };

      return this.formatResponse(details);
    } catch (error) {
      this.handleError(error, 'get application info');
    }
  }
}

export default ManifestTools;
