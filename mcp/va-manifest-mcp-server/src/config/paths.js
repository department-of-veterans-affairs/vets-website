/**
 * Centralized path configuration for VA.gov MCP Server
 * All default paths and directory structures are defined here
 */

const PathConfig = {
  // Manifest-related paths
  manifests: {
    sourceDirectory: 'src/applications',
    catalogFile: 'src/applications/manifest-catalog.json',
    filePattern: 'manifest.json',
  },

  // Web component pattern paths
  patterns: {
    sourceDirectory: 'src/platform/forms-system/src/js/web-component-patterns',
    catalogFile:
      'src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json',
    filePatterns: ['*.js', '*.jsx'],
  },

  // Required directory structure for validation
  requiredStructure: {
    applicationsDir: 'src/applications',
    formsSystemDir: 'src/platform/forms-system',
    webComponentPatternsDir:
      'src/platform/forms-system/src/js/web-component-patterns',
  },

  // File patterns to ignore during scanning
  ignorePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '*.test.js',
    '*.spec.js',
    '__tests__',
    '__mocks__',
  ],
};

export default PathConfig;
