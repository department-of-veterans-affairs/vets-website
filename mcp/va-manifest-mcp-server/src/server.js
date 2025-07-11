// Dynamic imports based on Node.js version
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import PathDetector from './utils/pathDetector.js';
import { importSDK } from './utils/sdkImports.js';
import logger from './utils/logger.js';

// Load package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
);

// These will be initialized in the constructor
let Server;
let StdioServerTransport;
let CallToolRequestSchema;
let ListToolsRequestSchema;

import Tools from './tools/index.js';

/**
 * VA.gov Manifest Catalog MCP Server
 * Provides tools for working with application manifests and web component patterns
 */
class VAManifestCatalogServer {
  constructor() {
    // Properties will be initialized in initialize()
    this.server = null;
    this.workingDirectory = null;
  }

  async initialize() {
    // Dynamically import SDK components based on Node.js version
    const sdk = await importSDK();

    // Assign to the module-level variables
    Server = sdk.Server;
    StdioServerTransport = sdk.StdioServerTransport;
    CallToolRequestSchema = sdk.CallToolRequestSchema;
    ListToolsRequestSchema = sdk.ListToolsRequestSchema;

    // Auto-detect vets-website root and set working directory
    this.workingDirectory = PathDetector.ensureCorrectWorkingDirectory();

    // Validate vets-website structure
    const validation = PathDetector.validateVetsWebsiteStructure();
    if (!validation.valid) {
      logger.warn('Required vets-website directories not found:', {
        missing: validation.missing,
      });
    }

    // Initialize MCP server
    this.server = new Server(
      {
        name: 'va-manifest-catalog',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    // Initialize Tools with SDK components
    Tools.initialize(sdk);
    this.setupToolHandlers();
  }

  /**
   * Set up MCP tool request handlers
   */
  setupToolHandlers() {
    // Handle tool listing requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Tools.getAllToolDefinitions(),
    }));

    // Handle tool execution requests
    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name: toolName, arguments: args } = request.params;
      logger.debug('Tool called', { toolName, args });
      const result = await Tools.executeTool(toolName, args);
      return result;
    });
  }

  /**
   * Set up error handling and cleanup
   */
  setupErrorHandling() {
    // MCP server error handling
    this.server.onerror = error => {
      logger.error('MCP server error', error);
    };

    // Process termination handling
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await this.cleanup();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await this.cleanup();
      process.exit(0);
    });

    // Unhandled error handling
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        promise: promise.toString(),
        reason,
      });
    });

    process.on('uncaughtException', error => {
      logger.error('Uncaught Exception', error);
      process.exit(1);
    });
  }

  /**
   * Cleanup resources before shutdown
   */
  async cleanup() {
    try {
      await this.server.close();
      logger.info('MCP server closed successfully');
    } catch (error) {
      logger.error('Error during cleanup', error);
    }
  }

  /**
   * Start the MCP server
   */
  async run() {
    try {
      // Make sure we're initialized
      if (!this.server) {
        await this.initialize();
      }

      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      // Log server info
      const toolInfo = Tools.getToolInfo();
      logger.info('VA.gov Manifest Catalog MCP Server started', {
        workingDirectory: this.workingDirectory,
        currentDirectory: process.cwd(),
        tools: {
          total: toolInfo.totalTools,
          manifest: toolInfo.categories.manifest.count,
          patterns: toolInfo.categories.patterns.count,
        },
      });
    } catch (error) {
      logger.error('Failed to start MCP server', error);
      throw error;
    }
  }

  /**
   * Get server status and information
   * @returns {Object} - Server status information
   */
  getStatus() {
    return {
      name: packageJson.name,
      version: packageJson.version,
      workingDirectory: this.workingDirectory,
      tools: Tools.getToolInfo(),
      structure: PathDetector.validateVetsWebsiteStructure(),
    };
  }
}

export default VAManifestCatalogServer;
