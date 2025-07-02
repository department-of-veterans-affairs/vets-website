import fs from 'fs';
import path from 'path';
import PathDetector from './pathDetector.js';
import Security from './security.js';
import logger from './logger.js';

let _McpError;
let _ErrorCode;

/**
 * Utility class for scanning files in the vets-website repository
 * SECURITY: All directory operations now include path validation
 */
class FileScanner {
  static initialize(sdk) {
    _McpError = sdk.McpError;
    _ErrorCode = sdk.ErrorCode;
  }

  /**
   * Recursively find all manifest.json files in a directory
   * @param {string} dir - Directory to scan (relative or absolute)
   * @param {Array} manifestFiles - Array to collect found files
   * @param {number} depth - Current recursion depth (for limiting)
   * @returns {Promise<Array>} - Array of manifest file paths
   */
  static async findManifestFiles(dir, manifestFiles = [], depth = 0) {
    // Limit recursion depth to prevent DoS
    const MAX_DEPTH = 10;
    if (depth > MAX_DEPTH) {
      logger.warn('Maximum directory depth reached', { dir, depth });
      return manifestFiles;
    }

    try {
      // Validate the directory path
      const validation = Security.validatePath(dir);
      if (!validation.valid) {
        throw new _McpError(_ErrorCode.InvalidParams, validation.error);
      }

      // Check scan operation permissions
      const opCheck = Security.checkFileOperation('scan', validation.sanitized);
      if (!opCheck.allowed) {
        throw new _McpError(_ErrorCode.InvalidParams, opCheck.error);
      }

      const absoluteDir = opCheck.sanitizedPath;
      const files = await fs.promises.readdir(absoluteDir);

      for (const file of files) {
        const filePath = path.join(absoluteDir, file);

        // Validate each file path
        const fileValidation = Security.validatePath(filePath);
        if (!fileValidation.valid) {
          logger.warn('Skipping invalid path', { path: filePath });
          continue;
        }

        try {
          const stat = await fs.promises.stat(filePath);

          if (stat.isDirectory()) {
            // Skip directories we shouldn't scan
            const skipDirs = [
              'node_modules',
              '.git',
              'dist',
              'build',
              'coverage',
            ];
            if (skipDirs.includes(file)) {
              continue;
            }

            // Recurse into subdirectory
            await this.findManifestFiles(filePath, manifestFiles, depth + 1);
          } else if (file === 'manifest.json') {
            manifestFiles.push(filePath);
          }
        } catch (statError) {
          logger.debug('Failed to stat file', {
            path: filePath,
            error: statError.message,
          });
        }
      }

      return manifestFiles;
    } catch (error) {
      logger.error('Error scanning directory', {
        dir,
        error: error.message,
      });

      if (error.constructor.name === 'McpError' || error.code) {
        throw error;
      }

      throw new _McpError(
        _ErrorCode.InternalError,
        `Error scanning directory ${dir}: ${error.message}`,
      );
    }
  }

  /**
   * Find all manifests in a directory and extract their data
   * @param {string} directory - Directory to scan
   * @returns {Promise<Array>} - Array of manifest data objects
   */
  static async findManifests(directory) {
    const manifestPaths = await this.findManifestFiles(directory);
    const manifests = [];
    const root = PathDetector.getVetsWebsiteRoot();

    for (const manifestPath of manifestPaths) {
      try {
        // Validate each manifest file path
        const validation = Security.validatePath(manifestPath);
        if (!validation.valid) {
          logger.warn('Skipping invalid manifest path', { path: manifestPath });
          continue;
        }

        const content = await fs.promises.readFile(
          validation.sanitized,
          'utf8',
        );
        const manifestData = JSON.parse(content);

        // Extract directory information
        const dirPath = path.dirname(manifestPath);
        const relativeDirPath = path.relative(root, dirPath);

        manifests.push({
          appName: manifestData.appName || path.basename(dirPath),
          entryName: manifestData.entryName || '',
          rootUrl: manifestData.rootUrl || '',
          directoryPath: relativeDirPath,
          filePath: path.relative(root, manifestPath),
          manifestData,
        });
      } catch (error) {
        logger.warn('Failed to read manifest file', {
          path: manifestPath,
          error: error.message,
        });
      }
    }

    return manifests;
  }

  /**
   * Find web component pattern files in a directory
   * @param {string} directory - Directory to scan
   * @returns {Promise<Array>} - Array of pattern data objects
   */
  static async findWebComponentPatterns(directory) {
    try {
      // Validate the directory path
      const validation = Security.validatePath(directory);
      if (!validation.valid) {
        throw new _McpError(_ErrorCode.InvalidParams, validation.error);
      }

      // Check scan operation permissions
      const opCheck = Security.checkFileOperation('scan', validation.sanitized);
      if (!opCheck.allowed) {
        throw new _McpError(_ErrorCode.InvalidParams, opCheck.error);
      }

      const patterns = [];
      const root = PathDetector.getVetsWebsiteRoot();
      const absoluteDir = opCheck.sanitizedPath;

      // Scan for .js and .jsx files
      const files = await this.findPatternFiles(absoluteDir);

      for (const filePath of files) {
        try {
          // Validate each file path
          const fileValidation = Security.validatePath(filePath);
          if (!fileValidation.valid) {
            logger.warn('Skipping invalid pattern file', { path: filePath });
            continue;
          }

          const content = await fs.promises.readFile(
            fileValidation.sanitized,
            'utf8',
          );
          const patternInfo = this.extractPatternInfo(content, filePath);

          if (patternInfo) {
            patterns.push({
              name: patternInfo.name,
              description: patternInfo.description,
              componentType: patternInfo.componentType,
              filePath: path.relative(root, filePath),
              exports: patternInfo.exports,
              imports: patternInfo.imports,
              sourcePreview: patternInfo.sourcePreview,
            });
          }
        } catch (error) {
          logger.debug('Failed to process pattern file', {
            path: filePath,
            error: error.message,
          });
        }
      }

      return patterns;
    } catch (error) {
      logger.error('Error finding web component patterns', {
        directory,
        error: error.message,
      });

      if (error.constructor.name === 'McpError' || error.code) {
        throw error;
      }

      throw new _McpError(
        _ErrorCode.InternalError,
        `Error finding patterns in ${directory}: ${error.message}`,
      );
    }
  }

  /**
   * Recursively find pattern files (.js, .jsx) in a directory
   * @param {string} dir - Directory to scan
   * @param {Array} patternFiles - Array to collect found files
   * @param {number} depth - Current recursion depth
   * @returns {Promise<Array>} - Array of pattern file paths
   */
  static async findPatternFiles(dir, patternFiles = [], depth = 0) {
    // Limit recursion depth
    const MAX_DEPTH = 5;
    if (depth > MAX_DEPTH) {
      return patternFiles;
    }

    try {
      const files = await fs.promises.readdir(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);

        try {
          const stat = await fs.promises.stat(filePath);

          if (stat.isDirectory()) {
            // Skip certain directories
            const skipDirs = [
              'node_modules',
              '.git',
              'dist',
              'build',
              '__tests__',
              '__mocks__',
            ];
            if (!skipDirs.includes(file)) {
              await this.findPatternFiles(filePath, patternFiles, depth + 1);
            }
          } else if (
            (file.endsWith('.js') || file.endsWith('.jsx')) &&
            !file.includes('.test.') &&
            !file.includes('.spec.')
          ) {
            patternFiles.push(filePath);
          }
        } catch (statError) {
          logger.debug('Failed to stat file in pattern scan', {
            path: filePath,
            error: statError.message,
          });
        }
      }

      return patternFiles;
    } catch (error) {
      logger.warn('Error scanning pattern directory', {
        dir,
        error: error.message,
      });
      return patternFiles;
    }
  }

  /**
   * Extract pattern information from a JavaScript file
   * @param {string} content - File content
   * @param {string} filePath - File path for context
   * @returns {Object|null} - Pattern information or null
   */
  static extractPatternInfo(content, filePath) {
    try {
      const fileName = path.basename(filePath, path.extname(filePath));

      // Extract component type
      let componentType = 'unknown';
      if (
        content.includes('React.Component') ||
        content.includes('extends Component')
      ) {
        componentType = 'React Class Component';
      } else if (content.includes('function') && content.includes('return')) {
        componentType = 'Functional Component';
      } else if (content.includes('web-component')) {
        componentType = 'Web Component';
      }

      // Extract description from comments
      let description = '';
      const commentMatch = content.match(/\/\*\*[\s\S]*?\*\//);
      if (commentMatch) {
        const comment = commentMatch[0];
        const descMatch = comment.match(/@description\s+(.+)/);
        if (descMatch) {
          description = descMatch[1].trim();
        } else {
          // Try to get first line of comment
          const lines = comment.split('\n');
          if (lines.length > 1) {
            description = lines[1].replace(/^\s*\*\s*/, '').trim();
          }
        }
      }

      // Extract exports
      const exports = [];
      const exportMatches = content.matchAll(
        /export\s+(?:default\s+)?(?:const|let|var|function|class)?\s*(\w+)/g,
      );
      for (const match of exportMatches) {
        if (match[1]) {
          exports.push(match[1]);
        }
      }

      // Extract imports
      const imports = [];
      const importMatches = content.matchAll(
        /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g,
      );
      for (const match of importMatches) {
        if (match[1]) {
          imports.push(match[1]);
        }
      }

      // Get preview (first 200 chars)
      const sourcePreview = `${content.substring(0, 200).trim()}...`;

      return {
        name: fileName,
        description: description || `Pattern from ${fileName}`,
        componentType,
        exports,
        imports,
        sourcePreview,
      };
    } catch (error) {
      logger.debug('Failed to extract pattern info', {
        file: filePath,
        error: error.message,
      });
      return null;
    }
  }
}

export default FileScanner;
