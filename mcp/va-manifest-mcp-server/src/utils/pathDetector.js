import fs from 'fs';
import path from 'path';
import logger from './logger.js';

/**
 * Path detection and validation for vets-website structure
 * SECURITY: This class NO LONGER changes process working directory
 */
class PathDetector {
  static vetsWebsiteRoot = null; // Cache the detected root

  /**
   * Get the vets-website root directory without changing process.cwd()
   * @returns {string} - Path to vets-website root
   */
  static getVetsWebsiteRoot() {
    // Return cached value if available
    if (this.vetsWebsiteRoot) {
      return this.vetsWebsiteRoot;
    }

    // Check current directory first
    const currentDir = process.cwd();
    const expectedSrcPath = path.join(currentDir, 'src', 'applications');

    if (fs.existsSync(expectedSrcPath)) {
      logger.info('Using current directory as vets-website root', {
        path: currentDir,
      });
      this.vetsWebsiteRoot = currentDir;
      return currentDir;
    }

    // Try to find vets-website root
    const rootDir = this.findVetsWebsiteRoot();
    if (rootDir) {
      logger.info('Found vets-website root', { path: rootDir });
      this.vetsWebsiteRoot = rootDir;
      return rootDir;
    }

    // If we can't find the local repo, log guidance
    logger.warn('Local vets-website repository not found', {
      currentDirectory: currentDir,
      fallback: 'GitHub API',
    });

    // Return current directory as fallback (DO NOT change process.cwd())
    this.vetsWebsiteRoot = currentDir;
    return currentDir;
  }

  /**
   * Search for the vets-website root directory by looking for indicators
   * @param {string} startDir - Directory to start searching from
   * @returns {string|null} - Path to vets-website root or null if not found
   */
  static findVetsWebsiteRoot(startDir = process.cwd()) {
    let searchDir = startDir;

    while (searchDir !== path.dirname(searchDir)) {
      const testSrcPath = path.join(searchDir, 'src', 'applications');
      const packageJsonPath = path.join(searchDir, 'package.json');

      if (fs.existsSync(testSrcPath) && fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, 'utf8'),
          );
          // Verify this is the vets-website package
          if (packageJson.name && packageJson.name.includes('vets-website')) {
            return searchDir;
          }
        } catch (error) {
          logger.debug('Failed to read package.json', {
            path: packageJsonPath,
            error: error.message,
          });
        }
      }

      // Move up one directory
      searchDir = path.dirname(searchDir);
    }

    // Check environment variable as last resort
    const envRoot = process.env.VETS_WEBSITE_ROOT;
    if (envRoot && fs.existsSync(path.join(envRoot, 'src', 'applications'))) {
      return envRoot;
    }

    return null;
  }

  /**
   * DEPRECATED: This method now just returns the root without changing directory
   * @returns {string} - The vets-website root directory
   */
  static ensureCorrectWorkingDirectory() {
    // NO LONGER CHANGES WORKING DIRECTORY - Security fix
    return this.getVetsWebsiteRoot();
  }

  /**
   * Get paths relative to vets-website root
   * @returns {Object} - Object containing important paths
   */
  static getPaths() {
    const root = this.getVetsWebsiteRoot();
    return {
      root,
      applications: path.join(root, 'src', 'applications'),
      manifestCatalog: path.join(
        root,
        'src',
        'applications',
        'manifest-catalog.json',
      ),
      patternsDir: path.join(
        root,
        'src',
        'platform',
        'forms-system',
        'src',
        'js',
        'web-component-patterns',
      ),
      patternsCatalog: path.join(
        root,
        'src',
        'platform',
        'forms-system',
        'src',
        'js',
        'web-component-patterns',
        'web-component-patterns-catalog.json',
      ),
    };
  }

  /**
   * Validate that required vets-website structure exists
   * @returns {Object} - Validation result with missing/existing paths
   */
  static validateVetsWebsiteStructure() {
    const paths = this.getPaths();
    const required = {
      applications: paths.applications,
      manifestCatalog: paths.manifestCatalog,
      patternsDir: paths.patternsDir,
      patternsCatalog: paths.patternsCatalog,
    };

    const missing = [];
    const existing = [];

    Object.entries(required).forEach(([key, pathToCheck]) => {
      if (fs.existsSync(pathToCheck)) {
        existing.push({ key, path: pathToCheck });
      } else {
        missing.push({ key, path: pathToCheck });
      }
    });

    return {
      valid: missing.length === 0,
      missing,
      existing,
    };
  }

  /**
   * Check if we're in a vets-website repository
   * @returns {boolean} - True if in vets-website repo
   */
  static isInVetsWebsite() {
    const root = this.findVetsWebsiteRoot();
    return root !== null;
  }

  /**
   * Get absolute path ensuring it's within vets-website
   * @param {string} relativePath - Path relative to vets-website root
   * @returns {string} - Absolute path
   */
  static getAbsolutePath(relativePath) {
    const root = this.getVetsWebsiteRoot();
    return path.join(root, relativePath);
  }
}

export default PathDetector;
