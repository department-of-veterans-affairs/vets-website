/**
 * SDK Import Helper
 *
 * This utility provides a consistent way to import the Model Context Protocol SDK
 * across different Node.js versions (14+) and different MCP SDK versions.
 *
 * Supports:
 * - Node.js 14.15.0+
 * - MCP SDK versions 0.5.x through 1.x+
 * - Automatic fallback mechanisms for import path resolution
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Node.js 14 compatibility: Add AbortController polyfill if not available
if (typeof globalThis.AbortController === 'undefined') {
  // Simple AbortController polyfill for Node.js 14
  globalThis.AbortController = class AbortController {
    constructor() {
      this.signal = {
        aborted: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      };
    }

    abort() {
      this.signal.aborted = true;
    }
  };
}

// Detect Node.js version
const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
const minorVersion = parseInt(nodeVersion.split('.')[1], 10);
const isLegacyNode = majorVersion < 15;

// Memoization for SDK import
let _sdkPromise = null;

let _sdkVersion = null;
let _sdkMajorVersion = 0;
let _versionDetected = false;

async function detectSDKVersion() {
  if (_versionDetected) {
    return { sdkVersion: _sdkVersion, sdkMajorVersion: _sdkMajorVersion };
  }

  try {
    // Try multiple possible locations for the SDK package.json
    const possiblePaths = [
      join(
        process.cwd(),
        'node_modules',
        '@modelcontextprotocol',
        'sdk',
        'package.json',
      ),
      join(
        import.meta.url
          .replace('file://', '')
          .replace('/src/utils/sdkImports.js', ''),
        'node_modules',
        '@modelcontextprotocol',
        'sdk',
        'package.json',
      ),
      join(
        process.cwd(),
        '..',
        '..',
        'node_modules',
        '@modelcontextprotocol',
        'sdk',
        'package.json',
      ),
    ];

    let packageJson = null;
    for (const path of possiblePaths) {
      try {
        packageJson = JSON.parse(readFileSync(path, 'utf8'));
        break;
      } catch (e) {
        // Continue to next path
      }
    }

    if (packageJson) {
      _sdkVersion = packageJson.version;
      _sdkMajorVersion = parseInt(_sdkVersion.split('.')[0], 10);
    } else {
      throw new Error('Package.json not found in any expected location');
    }
  } catch (error) {
    console.warn('Could not detect MCP SDK version, using fallback detection');
    // Try to detect version by attempting imports
    try {
      // If we can import from the 0.x path structure, assume 0.x
      await import('@modelcontextprotocol/sdk/server/index.js');
      _sdkVersion = '0.5.0'; // Fallback assumption
      _sdkMajorVersion = 0;
    } catch (e) {
      // Assume newer version
      _sdkVersion = '1.0.0'; // Fallback assumption
      _sdkMajorVersion = 1;
    }
  }

  _versionDetected = true;
  return { sdkVersion: _sdkVersion, sdkMajorVersion: _sdkMajorVersion };
}

/**
 * Get the appropriate import paths based on SDK version
 */
function getImportPaths(majorVersion) {
  // For SDK 0.x versions, use the specific paths
  if (majorVersion === 0) {
    return {
      server: '@modelcontextprotocol/sdk/server/index.js',
      stdio: '@modelcontextprotocol/sdk/server/stdio.js',
      types: '@modelcontextprotocol/sdk/types.js',
    };
  }

  // For SDK 1.x+ versions, try modern paths first
  return {
    server: '@modelcontextprotocol/sdk/server',
    stdio: '@modelcontextprotocol/sdk/server/stdio',
    types: '@modelcontextprotocol/sdk/types',
  };
}

/**
 * Import all SDK components needed for the application
 * This function handles different import paths based on Node.js and SDK versions
 * and memoizes the result.
 */
export async function importSDK() {
  if (_sdkPromise) {
    return _sdkPromise; // Return the existing promise if already importing/imported
  }

  _sdkPromise = (async () => {
    // Detect SDK version first
    const {
      sdkVersion: detectedVersion,
      sdkMajorVersion: detectedMajorVersion,
    } = await detectSDKVersion();
    const paths = getImportPaths(detectedMajorVersion);

    console.error(
      `Importing MCP SDK v${detectedVersion ||
        'unknown'} on Node.js ${nodeVersion}`,
    );

    try {
      const result = await attemptImport(paths);
      console.error('✓ MCP SDK imported successfully');
      return result;
    } catch (primaryError) {
      console.warn('Primary import strategy failed:', primaryError.message);
    }

    // Fallback strategies
    const fallbackStrategies = [
      // Strategy 1: Try explicit dist paths
      {
        server: '@modelcontextprotocol/sdk/dist/server/index.js',
        stdio: '@modelcontextprotocol/sdk/dist/server/stdio.js',
        types: '@modelcontextprotocol/sdk/dist/types.js',
      },
      // Strategy 2: Try root imports (for newer versions)
      {
        server: '@modelcontextprotocol/sdk',
        stdio: '@modelcontextprotocol/sdk',
        types: '@modelcontextprotocol/sdk',
      },
      // Strategy 3: Try alternative paths
      {
        server: '@modelcontextprotocol/sdk/server/index',
        stdio: '@modelcontextprotocol/sdk/server/stdio',
        types: '@modelcontextprotocol/sdk/types',
      },
    ];

    for (let i = 0; i < fallbackStrategies.length; i++) {
      try {
        console.warn(`Trying fallback strategy ${i + 1}...`);
        const result = await attemptImport(fallbackStrategies[i]);
        if (result) {
          console.error(`✓ MCP SDK imported using fallback strategy ${i + 1}`);
          return result;
        }
      } catch (fallbackError) {
        console.warn(
          `Fallback strategy ${i + 1} failed:`,
          fallbackError.message,
        );
      }
    }

    throw new Error(
      'All import strategies failed. Please check your MCP SDK installation.',
    );
  })();

  return _sdkPromise;
}

/**
 * Attempt to import SDK components using the given paths
 */
async function attemptImport(paths) {
  try {
    // Import modules
    const serverModule = await import(paths.server);
    const stdioModule = await import(paths.stdio);
    const typesModule = await import(paths.types);

    // Extract components with validation
    const components = {
      Server: serverModule.Server || serverModule.default?.Server,
      StdioServerTransport:
        stdioModule.StdioServerTransport ||
        stdioModule.default?.StdioServerTransport,
      CallToolRequestSchema:
        typesModule.CallToolRequestSchema ||
        typesModule.default?.CallToolRequestSchema,
      ListToolsRequestSchema:
        typesModule.ListToolsRequestSchema ||
        typesModule.default?.ListToolsRequestSchema,
      McpError: typesModule.McpError || typesModule.default?.McpError,
      ErrorCode: typesModule.ErrorCode || typesModule.default?.ErrorCode,
    };

    // Validate that all required components are available
    const missing = Object.entries(components)
      .filter(([name, component]) => !component)
      .map(([name]) => name);

    if (missing.length > 0) {
      throw new Error(`Missing required components: ${missing.join(', ')}`);
    }

    return components;
  } catch (error) {
    throw new Error(`Import attempt failed: ${error.message}`);
  }
}

/**
 * Get SDK and Node.js version information
 */
export async function getVersionInfo() {
  const {
    sdkVersion: detectedVersion,
    sdkMajorVersion: detectedMajorVersion,
  } = await detectSDKVersion();

  return {
    nodeVersion,
    nodeMajorVersion: majorVersion,
    nodeMinorVersion: minorVersion,
    isLegacyNode,
    sdkVersion: detectedVersion,
    sdkMajorVersion: detectedMajorVersion,
    importPaths: getImportPaths(detectedMajorVersion),
  };
}
