/**
 * Setup Instructions Tool
 * Provides setup instructions and fallback mode information
 */

import PathDetector from '../utils/pathDetector.js';
import GitHubFallback from '../utils/githubFallback.js';

let _McpError;
let _ErrorCode;

const setupInstructionsTool = {
  name: 'get_setup_instructions',
  description:
    'Get setup instructions for the MCP server and information about fallback mode',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};

class SetupInstructions {
  static initialize(sdk) {
    _McpError = sdk.McpError;
    _ErrorCode = sdk.ErrorCode;
  }

  /**
   * Get tool definitions for setup instructions
   * @returns {Array} - Array of tool definitions
   */
  static getToolDefinitions() {
    return [setupInstructionsTool];
  }

  /**
   * Get setup instructions and fallback mode information
   * @param {Object} args - Arguments (none required)
   * @returns {Promise<Object>} - Setup instructions and status
   */
  static async getSetupInstructions() {
    try {
      const isInFallbackMode = PathDetector.isInFallbackMode();
      const setupInstructions = PathDetector.getSetupInstructions();
      const fallbackStatus = GitHubFallback.getFallbackStatus();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                currentMode: isInFallbackMode ? 'fallback' : 'local',
                isLocalRepoAvailable: !isInFallbackMode,
                workingDirectory: process.cwd(),
                setupInstructions,
                fallbackStatus: isInFallbackMode ? fallbackStatus : null,
                recommendations: isInFallbackMode
                  ? [
                      'Clone the vets-website repository for full functionality',
                      'Update your Claude Desktop MCP configuration to point to the local repo',
                      'Run the server from within the vets-website directory',
                    ]
                  : [
                      'You have full local access to the vets-website repository',
                      'All tools are available with full functionality',
                      'You can scan, generate, and update local files',
                    ],
              },
              null,
              2,
            ),
          },
        ],
      };
    } catch (error) {
      throw new _McpError(
        _ErrorCode.InternalError,
        `Failed to get setup instructions: ${error.message}`,
      );
    }
  }
}

export default SetupInstructions;
