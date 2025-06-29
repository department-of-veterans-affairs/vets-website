import BaseTool from './baseTool.js';
import ManifestTools from './manifestTools.js';
import PatternTools from './patternTools.js';
import SetupInstructions from './setupInstructions.js';
import ToolRegistry from './toolRegistry.js';

// Create a singleton registry instance
const registry = new ToolRegistry();

let _McpError;
let _ErrorCode;

/**
 * Central export for all MCP tools
 * Uses ToolRegistry for dynamic tool management
 */
class Tools {
  static initialize(sdk) {
    _McpError = sdk.McpError;
    _ErrorCode = sdk.ErrorCode;

    // Initialize base class first
    BaseTool.initialize(sdk);
    ManifestTools.initialize(sdk);
    PatternTools.initialize(sdk);
    SetupInstructions.initialize(sdk);

    // Register tool categories
    registry.registerCategory(
      'manifest',
      ManifestTools,
      'Tools for working with application manifests',
    );
    registry.registerCategory(
      'patterns',
      PatternTools,
      'Tools for working with web component patterns',
    );
    registry.registerCategory(
      'setup',
      SetupInstructions,
      'Tools for setup and configuration',
    );
  }

  /**
   * Get all tool definitions
   * @returns {Array} - Array of all tool definitions
   */
  static getAllToolDefinitions() {
    return registry.getAllDefinitions();
  }

  /**
   * Execute a tool by name
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} args - Arguments for the tool
   * @returns {Promise<Object>} - Tool execution result
   */
  static async executeTool(toolName, args) {
    try {
      return await registry.execute(toolName, args);
    } catch (error) {
      // If it's a registry error, wrap it in MCP error
      if (error.message.startsWith('Unknown tool:')) {
        throw new _McpError(_ErrorCode.MethodNotFound, error.message);
      }
      throw error;
    }
  }

  /**
   * Get tools organized by category
   * @returns {Object} - Tools organized by category
   */
  static getToolsByCategory() {
    return registry.getByCategory();
  }

  /**
   * Get tool information including categories and counts
   * @returns {Object} - Tool information summary
   */
  static getToolInfo() {
    return registry.getInfo();
  }
}

// CLI entry point for direct execution
/* eslint-disable no-console */
if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, ...args] = process.argv;
  (async () => {
    if (cmd === 'generate_manifest_catalog') {
      const sourceDirectory = args[0];
      const outputFile = args[1];
      const result = await Tools.executeTool('generate_manifest_catalog', {
        sourceDirectory,
        outputFile,
      });
      console.log('Manifest catalog generated');
      if (result && result.content && result.content[0]) {
        const data = JSON.parse(result.content[0].text);
        console.log(JSON.stringify(data.summary, null, 2));
      }
    } else {
      console.log(
        'Usage: node src/tools/index.js generate_manifest_catalog [sourceDirectory] [outputFile]',
      );
      console.log('\nAvailable commands:');
      console.log(
        '  generate_manifest_catalog - Generate a manifest catalog',
      );
    }
  })();
}
/* eslint-enable no-console */

export default Tools;
