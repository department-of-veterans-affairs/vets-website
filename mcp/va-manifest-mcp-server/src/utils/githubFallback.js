/**
 * GitHub API fallback utility for when local vets-website repo is not available
 * Provides remote access to repository data via GitHub API
 */

import PathDetector from './pathDetector.js';
import { importSDK } from './sdkImports.js';
import logger from './logger.js';

// These will be initialized when needed
let McpError;
let ErrorCode;

// Initialize SDK components
async function initializeSDK() {
  const sdk = await importSDK();
  McpError = sdk.McpError;
  ErrorCode = sdk.ErrorCode;
}

// Initialize immediately
initializeSDK();

class GitHubFallback {
  /**
   * Check if we should use GitHub fallback mode
   * @returns {boolean} - True if fallback mode should be used
   */
  static shouldUseFallback() {
    return PathDetector.isInFallbackMode();
  }

  /**
   * Fetch file content from GitHub
   * @param {string} filePath - Path to file in repository
   * @returns {Promise<string>} - File content
   */
  static async fetchFileContent(filePath) {
    const repoInfo = PathDetector.getGitHubRepoInfo();
    const url = `${repoInfo.rawUrl}/${filePath}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to fetch ${filePath} from GitHub: ${error.message}`,
      );
    }
  }

  /**
   * Fetch directory listing from GitHub API
   * @param {string} dirPath - Directory path in repository
   * @returns {Promise<Array>} - Array of file/directory objects
   */
  static async fetchDirectoryListing(dirPath) {
    const repoInfo = PathDetector.getGitHubRepoInfo();
    const url = `${repoInfo.baseUrl}/contents/${dirPath}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return []; // Directory doesn't exist
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to fetch directory listing for ${dirPath}: ${error.message}`,
      );
    }
  }

  /**
   * Recursively find manifest files in GitHub repository
   * @param {string} dirPath - Directory path to search
   * @returns {Promise<Array>} - Array of manifest file paths
   */
  static async findManifestFiles(dirPath = 'src/applications') {
    const manifestFiles = [];

    try {
      const items = await this.fetchDirectoryListing(dirPath);

      for (const item of items) {
        if (item.type === 'dir') {
          // Recursively search subdirectories
          const subManifests = await this.findManifestFiles(item.path);
          manifestFiles.push(...subManifests);
        } else if (item.name === 'manifest.json') {
          manifestFiles.push(item.path);
        }
      }

      return manifestFiles;
    } catch (error) {
      logger.error('Error scanning GitHub directory', {
        path: dirPath,
        error: error.message,
      });
      return [];
    }
  }

  /**
   * Extract manifest data from GitHub
   * @param {string} manifestPath - Path to manifest file
   * @returns {Promise<Object|null>} - Manifest metadata or null
   */
  static async extractManifestData(manifestPath) {
    try {
      const content = await this.fetchFileContent(manifestPath);
      const manifest = JSON.parse(content);

      // Calculate directory path relative to src/applications
      const relativePath = manifestPath.replace('src/applications/', '');
      const directoryPath = relativePath.includes('/')
        ? `src/applications/${relativePath.substring(
            0,
            relativePath.lastIndexOf('/'),
          )}`
        : 'src/applications';

      return {
        directoryPath,
        appName: manifest.appName || 'N/A',
        entryName: manifest.entryName || 'N/A',
        rootUrl: manifest.rootUrl || 'N/A',
        manifestPath,
        manifest,
        source: 'github', // Mark as GitHub source
      };
    } catch (error) {
      logger.error('Error processing GitHub manifest', {
        path: manifestPath,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Find web component pattern files in GitHub repository
   * @param {string} dirPath - Directory path to search
   * @returns {Promise<Array>} - Array of pattern file paths
   */
  static async findWebComponentPatternFiles(
    dirPath = 'src/platform/forms-system/src/js/web-component-patterns',
  ) {
    const patternFiles = [];

    try {
      const items = await this.fetchDirectoryListing(dirPath);

      for (const item of items) {
        if (item.type === 'dir') {
          // Recursively search subdirectories
          const subPatterns = await this.findWebComponentPatternFiles(
            item.path,
          );
          patternFiles.push(...subPatterns);
        } else if (this.isPatternFile(item.name)) {
          // Check if file content looks like a web component pattern
          try {
            const content = await this.fetchFileContent(item.path);
            if (this.looksLikeWebComponentPattern(content, item.path)) {
              patternFiles.push(item.path);
            }
          } catch (error) {
            // Skip files we can't read
            logger.warn('Could not read GitHub file', {
              path: item.path,
              error: error.message,
            });
          }
        }
      }

      return patternFiles;
    } catch (error) {
      logger.error('Error scanning GitHub patterns directory', {
        path: dirPath,
        error: error.message,
      });
      return [];
    }
  }

  /**
   * Check if a file extension indicates it could be a pattern file
   * @param {string} fileName - Name of the file
   * @returns {boolean} - True if file could contain patterns
   */
  static isPatternFile(fileName) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    return extensions.some(ext => fileName.endsWith(ext));
  }

  /**
   * Analyze file content to determine if it's a web component pattern
   * @param {string} content - File content
   * @param {string} filePath - Path to the file
   * @returns {boolean} - True if this looks like a web component pattern
   */
  static looksLikeWebComponentPattern(content, filePath) {
    const contentIndicators = [
      'customElements.define',
      'HTMLElement',
      'web-component',
      '@customElement',
      'Component',
    ];

    const pathIndicators = ['pattern', 'component'];

    const hasContentIndicator = contentIndicators.some(indicator =>
      content.includes(indicator),
    );

    const hasPathIndicator = pathIndicators.some(indicator =>
      filePath.toLowerCase().includes(indicator),
    );

    return hasContentIndicator || hasPathIndicator;
  }

  /**
   * Extract pattern data from GitHub
   * @param {string} patternPath - Path to pattern file
   * @returns {Promise<Object|null>} - Pattern metadata or null
   */
  static async extractPatternData(patternPath) {
    try {
      const content = await this.fetchFileContent(patternPath);
      const fileName = patternPath.substring(patternPath.lastIndexOf('/') + 1);
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));

      // Extract component information from the file
      const componentNameMatch = content.match(
        /customElements\.define\(['"`]([^'"`]+)['"`]/,
      );
      const classNameMatch = content.match(/class\s+(\w+)/);
      const extendsMatch = content.match(/extends\s+(\w+)/);

      // Look for JSDoc comments or other documentation
      const docMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
      const description =
        docMatches.length > 0
          ? docMatches[0]
              .replace(/\/\*\*|\*\//g, '')
              .replace(/\s*\*\s?/g, ' ')
              .trim()
          : '';

      return {
        filePath: patternPath,
        name: nameWithoutExt,
        componentName: componentNameMatch ? componentNameMatch[1] : null,
        className: classNameMatch ? classNameMatch[1] : null,
        extends: extendsMatch ? extendsMatch[1] : null,
        description: description || 'No description available',
        componentType: this.detectComponentType(content),
        fileSize: content.length,
        lastModified: new Date().toISOString(), // GitHub API doesn't provide this easily
        source: 'github', // Mark as GitHub source
      };
    } catch (error) {
      logger.error('Error processing GitHub pattern', {
        path: patternPath,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Detect the type of component based on file content
   * @param {string} content - File content
   * @returns {string} - Component type
   */
  static detectComponentType(content) {
    if (content.includes('customElements.define')) return 'Custom Element';
    if (content.includes('HTMLElement') && !content.includes('React'))
      return 'Web Component';
    if (
      content.includes('React.Component') ||
      content.includes('useState') ||
      content.includes('useEffect') ||
      content.includes('from "react"') ||
      content.includes("from 'react'")
    )
      return 'React Component';
    if (content.includes('Component') && content.includes('render'))
      return 'React Component';
    if (content.includes('@customElement')) return 'Lit Element';
    if (content.includes('class') && content.includes('extends'))
      return 'Class Component';
    return 'JavaScript Module';
  }

  /**
   * Get fallback mode status and instructions
   * @returns {Object} - Status and setup instructions
   */
  static getFallbackStatus() {
    return {
      mode: 'github-fallback',
      active: this.shouldUseFallback(),
      repository: PathDetector.getGitHubRepoInfo(),
      instructions: PathDetector.getSetupInstructions(),
      limitations: [
        'Read-only access to repository content',
        'Cannot scan local changes or uncommitted files',
        'Subject to GitHub API rate limits',
        'Cannot generate or update local catalog files',
        'Limited to published repository content',
      ],
    };
  }
}

export default GitHubFallback;
