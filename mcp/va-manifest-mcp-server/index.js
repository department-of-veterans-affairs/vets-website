#!/usr/bin/env node

/**
 * VA.gov Manifest Catalog MCP Server
 * Main entry point for the modular MCP server
 */

import VAManifestCatalogServer from './src/server.js';

// Create and start the server
const server = new VAManifestCatalogServer();

server.run().catch(error => {
  // eslint-disable-next-line no-console
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
