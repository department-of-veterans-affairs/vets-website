#!/usr/bin/env node

/**
 * Cypress Screenshots MCP Server
 * 
 * Provides GitHub Copilot with tools to automatically access and analyze
 * Cypress test failure screenshots without manual drag-and-drop.
 * 
 * Tools provided:
 * - list_test_screenshots: List all available screenshots from recent test runs
 * - get_screenshot: Get base64-encoded screenshot with metadata
 * - analyze_latest_failures: Get all screenshots from the most recent test run
 * - search_screenshots: Search for screenshots by test name or spec file
 * 
 * Node 14 Compatible Implementation (no external dependencies)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const WORKSPACE_ROOT = path.resolve(__dirname, '../../');
const SCREENSHOTS_DIR = path.join(WORKSPACE_ROOT, 'cypress/screenshots');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit for base64 encoding

/**
 * Recursively find all screenshot files in a directory
 */
function findScreenshots(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findScreenshots(filePath, fileList);
    } else if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const relativePath = path.relative(SCREENSHOTS_DIR, filePath);
      const stats = fs.statSync(filePath);
      
      fileList.push({
        path: relativePath,
        fullPath: filePath,
        name: file,
        size: stats.size,
        modified: stats.mtime,
        specFile: extractSpecFile(relativePath),
        testName: extractTestName(relativePath, file),
        attemptNumber: extractAttemptNumber(file),
      });
    }
  });
  
  return fileList;
}

/**
 * Extract spec file name from screenshot path
 */
function extractSpecFile(relativePath) {
  const parts = relativePath.split(path.sep);
  // First part is usually the spec file name (directory)
  return parts[0] || 'unknown';
}

/**
 * Extract test name from path and filename
 */
function extractTestName(relativePath, filename) {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  
  // Remove attempt suffix if present (e.g., " (attempt 2)")
  const cleanName = nameWithoutExt.replace(/\s*\(attempt \d+\)$/i, '');
  
  // Remove " (failed)" suffix if present
  const testName = cleanName.replace(/\s*\(failed\)$/i, '');
  
  return testName;
}

/**
 * Extract attempt number from filename
 */
function extractAttemptNumber(filename) {
  const match = filename.match(/\(attempt (\d+)\)/i);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Encode screenshot as base64
 */
function encodeScreenshot(filePath) {
  const stats = fs.statSync(filePath);
  
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`Screenshot too large: ${stats.size} bytes (max ${MAX_FILE_SIZE})`);
  }
  
  const buffer = fs.readFileSync(filePath);
  return buffer.toString('base64');
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
  };
  return mimeTypes[ext] || 'image/png';
}

/**
 * List all available screenshots
 */
function listTestScreenshots(args = {}) {
  const screenshots = findScreenshots(SCREENSHOTS_DIR);
  
  // Sort by modification time (newest first)
  screenshots.sort((a, b) => b.modified - a.modified);
  
  // Apply filters if provided
  let filtered = screenshots;
  
  if (args.specFile) {
    filtered = filtered.filter(s => 
      s.specFile.toLowerCase().includes(args.specFile.toLowerCase())
    );
  }
  
  if (args.testName) {
    filtered = filtered.filter(s => 
      s.testName.toLowerCase().includes(args.testName.toLowerCase())
    );
  }
  
  if (args.limit) {
    filtered = filtered.slice(0, parseInt(args.limit, 10));
  }
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          total: filtered.length,
          screenshots: filtered.map(s => ({
            path: s.path,
            name: s.name,
            specFile: s.specFile,
            testName: s.testName,
            attemptNumber: s.attemptNumber,
            size: s.size,
            modified: s.modified.toISOString(),
          })),
        }, null, 2),
      },
    ],
  };
}

/**
 * Get a specific screenshot with base64 encoding
 */
function getScreenshot(args) {
  if (!args.path) {
    throw new Error('Screenshot path is required');
  }
  
  const fullPath = path.join(SCREENSHOTS_DIR, args.path);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Screenshot not found: ${args.path}`);
  }
  
  const stats = fs.statSync(fullPath);
  const base64Data = encodeScreenshot(fullPath);
  const mimeType = getMimeType(fullPath);
  
  const relativePath = args.path;
  const metadata = {
    path: relativePath,
    name: path.basename(fullPath),
    specFile: extractSpecFile(relativePath),
    testName: extractTestName(relativePath, path.basename(fullPath)),
    attemptNumber: extractAttemptNumber(path.basename(fullPath)),
    size: stats.size,
    modified: stats.mtime.toISOString(),
    mimeType,
  };
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(metadata, null, 2),
      },
      {
        type: 'image',
        data: base64Data,
        mimeType,
      },
    ],
  };
}

/**
 * Analyze latest test failures by getting recent screenshots
 */
function analyzeLatestFailures(args = {}) {
  const screenshots = findScreenshots(SCREENSHOTS_DIR);
  
  if (screenshots.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: 'No screenshots found. Run Cypress tests with `yarn cy:run` to generate failure screenshots.',
        },
      ],
    };
  }
  
  // Sort by modification time (newest first)
  screenshots.sort((a, b) => b.modified - a.modified);
  
  // Get screenshots from the last hour by default, or use provided timeWindow
  const timeWindowMinutes = args.timeWindowMinutes || 60;
  const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000);
  
  const recentScreenshots = screenshots.filter(s => s.modified > cutoffTime);
  
  if (recentScreenshots.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `No screenshots found in the last ${timeWindowMinutes} minutes. Most recent screenshot is from ${screenshots[0].modified.toISOString()}.`,
        },
      ],
    };
  }
  
  // Group by spec file
  const bySpec = {};
  recentScreenshots.forEach(s => {
    if (!bySpec[s.specFile]) {
      bySpec[s.specFile] = [];
    }
    bySpec[s.specFile].push(s);
  });
  
  const limit = args.limit || 5;
  const limitedScreenshots = recentScreenshots.slice(0, limit);
  
  // Build response with summary and images
  const content = [
    {
      type: 'text',
      text: `## Recent Test Failures (last ${timeWindowMinutes} minutes)\n\n` +
            `Found ${recentScreenshots.length} screenshot(s) across ${Object.keys(bySpec).length} spec file(s).\n\n` +
            `Showing ${limitedScreenshots.length} most recent:\n\n` +
            limitedScreenshots.map((s, idx) => 
              `${idx + 1}. **${s.testName}**\n` +
              `   - Spec: ${s.specFile}\n` +
              `   - Attempt: ${s.attemptNumber}\n` +
              `   - Time: ${s.modified.toISOString()}\n` +
              `   - Path: ${s.path}`
            ).join('\n\n'),
    },
  ];
  
  // Add images for each screenshot (if not too many)
  if (limitedScreenshots.length <= 3) {
    limitedScreenshots.forEach(s => {
      try {
        const base64Data = encodeScreenshot(s.fullPath);
        const mimeType = getMimeType(s.fullPath);
        
        content.push({
          type: 'text',
          text: `\n### ${s.testName} (${s.specFile})`,
        });
        
        content.push({
          type: 'image',
          data: base64Data,
          mimeType,
        });
      } catch (err) {
        content.push({
          type: 'text',
          text: `\nError loading ${s.path}: ${err.message}`,
        });
      }
    });
  } else {
    content.push({
      type: 'text',
      text: '\n\nℹ️ Too many screenshots to display automatically. Use `get_screenshot` with specific paths to view individual screenshots.',
    });
  }
  
  return { content };
}

/**
 * Search for screenshots matching criteria
 */
function searchScreenshots(args) {
  if (!args.query && !args.specFile) {
    throw new Error('Either query or specFile is required');
  }
  
  const screenshots = findScreenshots(SCREENSHOTS_DIR);
  let results = screenshots;
  
  if (args.specFile) {
    results = results.filter(s => 
      s.specFile.toLowerCase().includes(args.specFile.toLowerCase())
    );
  }
  
  if (args.query) {
    const query = args.query.toLowerCase();
    results = results.filter(s => 
      s.testName.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.path.toLowerCase().includes(query)
    );
  }
  
  // Sort by modification time (newest first)
  results.sort((a, b) => b.modified - a.modified);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          query: args.query || args.specFile,
          found: results.length,
          results: results.map(s => ({
            path: s.path,
            testName: s.testName,
            specFile: s.specFile,
            attemptNumber: s.attemptNumber,
            modified: s.modified.toISOString(),
          })),
        }, null, 2),
      },
    ],
  };
}

/**
 * Simple stdio-based JSON-RPC 2.0 MCP server implementation
 * Compatible with Node 14 (no external dependencies)
 */
class SimpleMCPServer {
  constructor(serverInfo) {
    this.serverInfo = serverInfo;
    this.tools = [];
    this.requestId = 0;
  }

  registerTools(tools) {
    this.tools = tools;
  }

  async handleRequest(request) {
    try {
      if (request.method === 'initialize') {
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            serverInfo: this.serverInfo,
          },
        };
      }

      if (request.method === 'tools/list') {
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: this.tools,
          },
        };
      }

      if (request.method === 'tools/call') {
        const { name, arguments: args } = request.params;
        let result;

        switch (name) {
          case 'list_test_screenshots':
            result = listTestScreenshots(args || {});
            break;
          case 'get_screenshot':
            result = getScreenshot(args || {});
            break;
          case 'analyze_latest_failures':
            result = analyzeLatestFailures(args || {});
            break;
          case 'search_screenshots':
            result = searchScreenshots(args || {});
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          jsonrpc: '2.0',
          id: request.id,
          result,
        };
      }

      // Unknown method
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`,
        },
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: error.message,
          data: error.stack,
        },
      };
    }
  }

  start() {
    console.error('Cypress Screenshots MCP Server starting...');
    console.error(`Screenshots directory: ${SCREENSHOTS_DIR}`);
    console.error('Node version:', process.version);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    let buffer = '';

    rl.on('line', async (line) => {
      buffer += line;
      
      try {
        const request = JSON.parse(buffer);
        buffer = '';
        
        const response = await this.handleRequest(request);
        
        // Write response to stdout (MCP protocol uses stdout)
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (e) {
        // Not a complete JSON yet, keep buffering
        if (e instanceof SyntaxError) {
          // Continue buffering
        } else {
          console.error('Error processing request:', e);
          buffer = '';
        }
      }
    });

    rl.on('close', () => {
      console.error('MCP Server shutting down');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.error('Received SIGINT, shutting down');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('Received SIGTERM, shutting down');
      process.exit(0);
    });
  }
}

// Create and start the server
const server = new SimpleMCPServer({
  name: 'cypress-screenshots-mcp-server',
  version: '1.0.0',
});

server.registerTools([
  {
    name: 'list_test_screenshots',
    description: 
      'List all available Cypress test failure screenshots. ' +
      'Useful for getting an overview of recent test runs and finding specific screenshots. ' +
      'Returns metadata including test names, spec files, and modification times.',
    inputSchema: {
      type: 'object',
      properties: {
        specFile: {
          type: 'string',
          description: 'Filter by spec file name (partial match, case-insensitive)',
        },
        testName: {
          type: 'string',
          description: 'Filter by test name (partial match, case-insensitive)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of screenshots to return (default: all)',
        },
      },
    },
  },
  {
    name: 'get_screenshot',
    description: 
      'Get a specific screenshot by path and return it as base64-encoded image. ' +
      'Use this after list_test_screenshots to view the actual screenshot. ' +
      'Path should be the relative path from the list_test_screenshots response.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative path to the screenshot (from list_test_screenshots)',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'analyze_latest_failures',
    description: 
      'Automatically analyze the most recent test failures by finding and displaying ' +
      'screenshots from recent test runs. Perfect for quick failure diagnosis. ' +
      'Returns summary and up to 3 screenshots with full images.',
    inputSchema: {
      type: 'object',
      properties: {
        timeWindowMinutes: {
          type: 'number',
          description: 'Time window in minutes to consider (default: 60)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of screenshots to analyze (default: 5)',
        },
      },
    },
  },
  {
    name: 'search_screenshots',
    description: 
      'Search for screenshots by test name, spec file, or path. ' +
      'Returns matching screenshots sorted by modification time.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (matches test name, filename, or path)',
        },
        specFile: {
          type: 'string',
          description: 'Filter by spec file name',
        },
      },
    },
  },
]);

server.start();
