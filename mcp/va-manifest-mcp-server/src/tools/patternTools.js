import path from 'path';
import BaseTool from './baseTool.js';
import PathDetector from '../utils/pathDetector.js';
import FileScanner from '../utils/fileScanner.js';
import Validators from '../utils/validators.js';
import PathConfig from '../config/paths.js';

/**
 * Tools for working with web component patterns in vets-website
 */
class PatternTools extends BaseTool {
  /**
   * Get tool definitions for pattern-related operations
   * @returns {Array} - Array of tool definitions
   */
  static getToolDefinitions() {
    return [
      {
        name: 'scan_web_component_patterns',
        description: 'Scan for web component pattern files',
        inputSchema: {
          type: 'object',
          properties: {
            directory: {
              type: 'string',
              description: 'Directory to scan for pattern files',
              default: PathConfig.patterns.sourceDirectory,
            },
          },
          required: [],
        },
      },
      {
        name: 'generate_web_component_patterns_catalog',
        description: 'Generate a catalog of web component patterns',
        inputSchema: {
          type: 'object',
          properties: {
            sourceDirectory: {
              type: 'string',
              description: 'Source directory to scan',
              default: PathConfig.patterns.sourceDirectory,
            },
            outputFile: {
              type: 'string',
              description: 'Output catalog file path',
              default: PathConfig.patterns.catalogFile,
            },
          },
          required: [],
        },
      },
      {
        name: 'read_web_component_patterns_catalog',
        description: 'Read the web component patterns catalog',
        inputSchema: {
          type: 'object',
          properties: {
            catalogFile: {
              type: 'string',
              description: 'Path to the patterns catalog file',
              default: PathConfig.patterns.catalogFile,
            },
          },
          required: [],
        },
      },
      {
        name: 'search_web_component_patterns',
        description: 'Search for web component patterns',
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
                'Field to search in: all, name, description, filePath, componentType',
              default: 'all',
            },
          },
          required: ['searchTerm'],
        },
      },
      {
        name: 'get_pattern_info',
        description: 'Get detailed information about a specific pattern',
        inputSchema: {
          type: 'object',
          properties: {
            patternIdentifier: {
              type: 'string',
              description: 'Pattern identifier (name or file path)',
            },
          },
          required: ['patternIdentifier'],
        },
      },
    ];
  }

  /**
   * Scan for web component pattern files
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async scanWebComponentPatterns(args) {
    const { directory = PathConfig.patterns.sourceDirectory } = args || {};

    try {
      const patterns = await FileScanner.findWebComponentPatterns(directory);

      // Calculate statistics
      const stats = {
        totalPatterns: patterns.length,
        byType: {},
        directories: new Set(),
        fileTypes: {},
      };

      patterns.forEach(pattern => {
        // Count by component type
        if (pattern.componentType) {
          stats.byType[pattern.componentType] =
            (stats.byType[pattern.componentType] || 0) + 1;
        }

        // Track unique directories
        stats.directories.add(path.dirname(pattern.filePath));

        // Count file extensions
        const ext = path.extname(pattern.filePath);
        stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
      });

      const summary = {
        totalPatterns: stats.totalPatterns,
        uniqueDirectories: stats.directories.size,
        byComponentType: stats.byType,
        byFileType: stats.fileTypes,
      };

      return this.formatResponse({
        summary,
        patterns,
      });
    } catch (error) {
      this.handleError(error, 'scan web component patterns');
    }
  }

  /**
   * Generate a web component patterns catalog
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async generateWebComponentPatternsCatalog(args) {
    const {
      sourceDirectory = PathConfig.patterns.sourceDirectory,
      outputFile = PathConfig.patterns.catalogFile,
    } = args || {};

    try {
      // Find all patterns
      const patterns = await FileScanner.findWebComponentPatterns(
        sourceDirectory,
      );

      // Create catalog structure
      const catalog = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        totalPatterns: patterns.length,
        patterns: patterns.map(pattern => ({
          name: pattern.name,
          description: pattern.description,
          componentType: pattern.componentType,
          filePath: pattern.filePath,
          exports: pattern.exports,
          imports: pattern.imports,
          sourcePreview: pattern.sourcePreview,
        })),
      };

      // Write catalog file
      const absolutePath = await this.writeJsonFile(
        outputFile,
        catalog,
        'generate patterns catalog',
      );

      // Create summary
      const summary = this.createSummary(
        patterns,
        p => p.componentType || 'unknown',
      );

      return this.formatResponse({
        message: `Web component patterns catalog generated successfully`,
        catalogPath: absolutePath,
        summary,
      });
    } catch (error) {
      this.handleError(error, 'generate patterns catalog');
    }
  }

  /**
   * Read the web component patterns catalog
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async readWebComponentPatternsCatalog(args) {
    const { catalogFile = PathConfig.patterns.catalogFile } = args || {};

    try {
      const catalog = await this.readJsonFile(
        catalogFile,
        'read patterns catalog',
      );
      return this.formatResponse(catalog);
    } catch (error) {
      this.handleError(error, 'read patterns catalog');
    }
  }

  /**
   * Search for web component patterns
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async searchWebComponentPatterns(args) {
    const { searchTerm, searchField = 'all' } = args || {};

    // Validate search parameters
    const validFields = [
      'all',
      'name',
      'description',
      'filePath',
      'componentType',
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
      // Scan patterns directly
      const { sourceDirectory } = PathConfig.patterns;
      const patterns = await FileScanner.findWebComponentPatterns(
        sourceDirectory,
      );

      // Define field mapping for search
      const fieldMapping = {
        name: p => p.name,
        description: p => p.description,
        filePath: p => p.filePath,
        componentType: p => p.componentType,
      };

      // Use base class search method
      const matchingPatterns = this.searchItems(
        patterns,
        searchTerm,
        searchField,
        fieldMapping,
      );

      return this.formatResponse({
        searchTerm,
        searchField,
        totalResults: matchingPatterns.length,
        results: matchingPatterns.map(pattern => ({
          name: pattern.name,
          description: pattern.description,
          componentType: pattern.componentType,
          filePath: pattern.filePath,
        })),
      });
    } catch (error) {
      this.handleError(error, 'search patterns');
    }
  }

  /**
   * Get detailed information about a specific pattern
   * @param {Object} args - Tool arguments
   * @returns {Promise<Object>} - MCP tool response
   */
  static async getPatternInfo(args) {
    const { patternIdentifier } = args || {};

    this.validateRequiredParams(args, {
      patternIdentifier: 'patternIdentifier is required',
    });

    try {
      // Find patterns
      const { sourceDirectory } = PathConfig.patterns;
      const patterns = await FileScanner.findWebComponentPatterns(
        sourceDirectory,
      );

      // Search for the pattern
      const searchLower = patternIdentifier.toLowerCase();
      const pattern = patterns.find(
        p =>
          p.name?.toLowerCase() === searchLower ||
          p.filePath?.toLowerCase().includes(searchLower),
      );

      if (!pattern) {
        return this.formatResponse({
          found: false,
          message: `No pattern found matching identifier: ${patternIdentifier}`,
        });
      }

      // Get additional details
      const details = {
        found: true,
        pattern: {
          ...pattern,
          // Add computed properties
          fileExtension: path.extname(pattern.filePath),
          relativePath: path.relative(
            PathDetector.getVetsWebsiteRoot(),
            pattern.filePath,
          ),
          hasExports: pattern.exports && pattern.exports.length > 0,
          importCount: pattern.imports ? pattern.imports.length : 0,
        },
      };

      return this.formatResponse(details);
    } catch (error) {
      this.handleError(error, 'get pattern info');
    }
  }
}

export default PatternTools;
