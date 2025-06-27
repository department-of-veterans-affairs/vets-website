#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop, no-plusplus, no-unused-vars */

/**
 * Unit Test Runner for VA Manifest MCP Server
 *
 * Comprehensive test suite to validate all MCP tool functions
 * and identify potential issues before deployment.
 */

import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the MCP server tools
import ManifestTools from '../../src/tools/manifestTools.js';
import PatternTools from '../../src/tools/patternTools.js';
import PathDetector from '../../src/utils/pathDetector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.startTime = Date.now();
  }

  /**
   * Add a test to the suite
   */
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  /**
   * Run all tests
   */
  async run() {
    process.stderr.write('🚀 Starting VA Manifest MCP Server Unit Tests\n\n');
    process.stderr.write(`${'='.repeat(60)}\n`);

    for (const { name, testFn } of this.tests) {
      try {
        process.stderr.write(`⏳ Running: ${name}\n`);
        await testFn();
        process.stderr.write(`✅ PASSED: ${name}\n\n`);
        this.passed += 1;
      } catch (error) {
        process.stderr.write(`❌ FAILED: ${name}\n`);
        process.stderr.write(`   Error: ${error.message}\n\n`);
        this.failed += 1;
      }
    }

    this.printSummary();
  }

  /**
   * Print test summary
   */
  printSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const total = this.passed + this.failed;

    process.stderr.write(`${'='.repeat(60)}\n`);
    process.stderr.write(
      `📊 Test Results: ${this.passed}/${total} passed (${duration}s)\n`,
    );

    if (this.failed === 0) {
      process.stderr.write('🎉 All tests passed!\n');
      process.exit(0);
    } else {
      process.stderr.write(`⚠️  ${this.failed} test(s) failed\n`);
      process.exit(1);
    }
  }

  /**
   * Assert helper functions
   */
  static async assertSuccess(result) {
    assert(result.content, 'Result should have content');
    assert(Array.isArray(result.content), 'Content should be an array');
    assert(result.content.length > 0, 'Content should not be empty');
    assert(result.content[0].type === 'text', 'Content should be text type');
    assert(
      typeof result.content[0].text === 'string',
      'Text should be a string',
    );
  }

  static assertValidJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      assert(typeof parsed === 'object', 'Should parse to an object');
      return parsed;
    } catch (error) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
  }

  static assertValidManifestScanResult(result) {
    const data = TestRunner.assertValidJSON(result.content[0].text);
    assert(
      typeof data.scannedDirectory === 'string',
      'Should have scannedDirectory',
    );
    assert(typeof data.totalFiles === 'number', 'Should have totalFiles count');
    assert(
      typeof data.validManifests === 'number',
      'Should have validManifests count',
    );
    assert(
      typeof data.statistics === 'object',
      'Should have statistics object',
    );
    assert(Array.isArray(data.nextSteps), 'Should have nextSteps array');
  }

  static assertValidSearchResult(result, searchTerm) {
    const data = TestRunner.assertValidJSON(result.content[0].text);
    assert(
      data.searchTerm === searchTerm,
      `Search term should match: ${searchTerm}`,
    );
    assert(
      typeof data.totalScanned === 'number',
      'Should have totalScanned count',
    );
    assert(
      typeof data.totalMatches === 'number',
      'Should have totalMatches count',
    );
    assert(Array.isArray(data.results), 'Should have results array');
  }

  static assertValidCatalogResult(result) {
    const data = TestRunner.assertValidJSON(result.content[0].text);
    assert(typeof data.title === 'string', 'Should have title');
    assert(
      typeof data.totalApplications === 'number' ||
        typeof data.totalPatterns === 'number',
      'Should have total count',
    );
    assert(
      typeof data.generatedAt === 'string',
      'Should have generatedAt timestamp',
    );
    assert(
      Array.isArray(data.applications) || Array.isArray(data.patterns),
      'Should have applications or patterns array',
    );
  }
}

// Initialize test runner
const runner = new TestRunner();

// ============================
// PATH DETECTION TESTS
// ============================

runner.test(
  'PathDetector.getVetsWebsiteRoot() returns valid path',
  async () => {
    const root = PathDetector.getVetsWebsiteRoot();
    assert(typeof root === 'string', 'Root should be a string');
    assert(path.isAbsolute(root), 'Root should be an absolute path');

    // Check if it looks like vets-website
    const srcPath = path.join(root, 'src', 'applications');
    assert(
      fs.existsSync(srcPath),
      `Expected src/applications to exist at: ${srcPath}`,
    );
  },
);

runner.test('PathDetector.validateVetsWebsiteStructure() works', async () => {
  const validation = PathDetector.validateVetsWebsiteStructure();
  assert(typeof validation === 'object', 'Validation should return an object');
  assert(typeof validation.valid === 'boolean', 'Should have valid property');
  assert(Array.isArray(validation.missing), 'Should have missing array');
  assert(Array.isArray(validation.existing), 'Should have existing array');
});

// ============================
// MANIFEST TOOLS TESTS
// ============================

runner.test(
  'ManifestTools.scanManifests() with default directory',
  async () => {
    const result = await ManifestTools.scanManifests({});
    TestRunner.assertSuccess(result);
    TestRunner.assertValidManifestScanResult(result);

    const data = JSON.parse(result.content[0].text);
    assert(
      data.scannedDirectory === 'src/applications',
      'Should scan default directory',
    );
    assert(data.totalFiles > 0, 'Should find manifest files');
  },
);

runner.test(
  'ManifestTools.generateManifestCatalog() creates catalog',
  async () => {
    const result = await ManifestTools.generateManifestCatalog({});
    TestRunner.assertSuccess(result);

    // Check if catalog file was created
    const catalogPath = path.join(
      PathDetector.getVetsWebsiteRoot(),
      'src/applications/manifest-catalog.json',
    );
    assert(fs.existsSync(catalogPath), 'Catalog file should be created');

    // Validate catalog content
    const catalogContent = fs.readFileSync(catalogPath, 'utf8');
    const catalog = JSON.parse(catalogContent);
    assert(typeof catalog.title === 'string', 'Should have title');
    assert(
      typeof catalog.totalApplications === 'number',
      'Should have totalApplications',
    );
    assert(
      Array.isArray(catalog.applications),
      'Should have applications array',
    );
  },
);

runner.test(
  'ManifestTools.readManifestCatalog() reads existing catalog',
  async () => {
    const result = await ManifestTools.readManifestCatalog({});
    TestRunner.assertSuccess(result);

    const { text } = result.content[0];
    assert(
      text.includes('Manifest Catalog Summary'),
      'Should have catalog summary',
    );
    assert(
      text.includes('totalApplications'),
      'Should mention total applications',
    );
  },
);

runner.test('ManifestTools.searchApplications() finds results', async () => {
  const searchTerm = 'form';
  const result = await ManifestTools.searchApplications({ searchTerm });
  TestRunner.assertSuccess(result);
  TestRunner.assertValidSearchResult(result, searchTerm);

  const data = JSON.parse(result.content[0].text);
  assert(data.totalMatches >= 0, 'Should have non-negative matches');
});

runner.test(
  'ManifestTools.searchApplications() with specific field',
  async () => {
    const searchTerm = 'profile';
    const searchField = 'entryName';
    const result = await ManifestTools.searchApplications({
      searchTerm,
      searchField,
    });
    TestRunner.assertSuccess(result);
    TestRunner.assertValidSearchResult(result, searchTerm);

    const data = JSON.parse(result.content[0].text);
    assert(
      data.searchField === searchField,
      'Should use specified search field',
    );
  },
);

runner.test(
  'ManifestTools.getApplicationInfo() finds application',
  async () => {
    const appIdentifier = 'profile';
    const result = await ManifestTools.getApplicationInfo({ appIdentifier });
    TestRunner.assertSuccess(result);

    const { text } = result.content[0];
    assert(text.includes(appIdentifier), 'Should mention the app identifier');
    assert(text.includes('catalogEntry'), 'Should have catalog entry');
  },
);

runner.test(
  'ManifestTools.validateManifest() handles missing file gracefully',
  async () => {
    const manifestPath = 'src/applications/nonexistent/manifest.json';

    try {
      await ManifestTools.validateManifest({ manifestPath });
      assert.fail('Should throw error for missing file');
    } catch (error) {
      assert(
        error.message.includes('Failed to validate manifest'),
        'Should have appropriate error message',
      );
    }
  },
);

// ============================
// PATTERN TOOLS TESTS
// ============================

runner.test(
  'PatternTools.scanWebComponentPatterns() scans patterns',
  async () => {
    const result = await PatternTools.scanWebComponentPatterns({});
    TestRunner.assertSuccess(result);

    const data = JSON.parse(result.content[0].text);
    assert(
      typeof data.scannedDirectory === 'string',
      'Should have scannedDirectory',
    );
    assert(typeof data.totalFiles === 'number', 'Should have totalFiles count');
    assert(
      typeof data.validPatterns === 'number',
      'Should have validPatterns count',
    );
    assert(Array.isArray(data.patterns), 'Should have patterns array');
  },
);

runner.test(
  'PatternTools.generateWebComponentPatternsCatalog() creates catalog',
  async () => {
    const result = await PatternTools.generateWebComponentPatternsCatalog({});
    TestRunner.assertSuccess(result);

    // Check if catalog file was created
    const catalogPath = path.join(
      PathDetector.getVetsWebsiteRoot(),
      'src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json',
    );
    assert(
      fs.existsSync(catalogPath),
      'Patterns catalog file should be created',
    );
  },
);

runner.test(
  'PatternTools.readWebComponentPatternsCatalog() reads catalog',
  async () => {
    const result = await PatternTools.readWebComponentPatternsCatalog({});
    TestRunner.assertSuccess(result);

    const { text } = result.content[0];
    assert(
      text.includes('Web Component Patterns Catalog Summary'),
      'Should have patterns catalog summary',
    );
    assert(text.includes('totalPatterns'), 'Should mention total patterns');
  },
);

runner.test(
  'PatternTools.searchWebComponentPatterns() searches patterns',
  async () => {
    const searchTerm = 'address';
    const result = await PatternTools.searchWebComponentPatterns({
      searchTerm,
    });
    TestRunner.assertSuccess(result);

    const { text } = result.content[0];
    assert(text.includes(searchTerm), 'Should mention search term');
    assert(text.includes('patterns'), 'Should mention patterns');
  },
);

runner.test('PatternTools.getPatternInfo() gets pattern details', async () => {
  const patternIdentifier = 'addressPattern';
  const result = await PatternTools.getPatternInfo({ patternIdentifier });
  TestRunner.assertSuccess(result);

  const { text } = result.content[0];
  assert(text.includes(patternIdentifier), 'Should mention pattern identifier');
});

// ============================
// ERROR HANDLING TESTS
// ============================

runner.test(
  'ManifestTools.searchApplications() validates search parameters',
  async () => {
    try {
      await ManifestTools.searchApplications({
        searchTerm: '',
        searchField: 'invalid',
      });
      assert.fail('Should throw error for invalid parameters');
    } catch (error) {
      assert(error.code === -32602, 'Should throw InvalidParams error');
    }
  },
);

runner.test(
  'ManifestTools.getApplicationInfo() requires appIdentifier',
  async () => {
    try {
      await ManifestTools.getApplicationInfo({});
      assert.fail('Should throw error for missing appIdentifier');
    } catch (error) {
      assert(error.code === -32602, 'Should throw InvalidParams error');
    }
  },
);

runner.test(
  'PatternTools.getPatternInfo() requires patternIdentifier',
  async () => {
    try {
      await PatternTools.getPatternInfo({});
      assert.fail('Should throw error for missing patternIdentifier');
    } catch (error) {
      assert(error.code === -32602, 'Should throw InvalidParams error');
    }
  },
);

// ============================
// INTEGRATION TESTS
// ============================

runner.test(
  'Full workflow: scan -> generate -> search -> get info',
  async () => {
    // 1. Scan manifests
    const scanResult = await ManifestTools.scanManifests({});
    TestRunner.assertSuccess(scanResult);

    // 2. Generate catalog
    const catalogResult = await ManifestTools.generateManifestCatalog({});
    TestRunner.assertSuccess(catalogResult);

    // 3. Search applications
    const searchResult = await ManifestTools.searchApplications({
      searchTerm: 'profile',
    });
    TestRunner.assertSuccess(searchResult);

    const searchData = JSON.parse(searchResult.content[0].text);
    if (searchData.results.length > 0) {
      // 4. Get info for first result
      const firstResult = searchData.results[0];
      const infoResult = await ManifestTools.getApplicationInfo({
        appIdentifier: firstResult.entryName,
      });
      TestRunner.assertSuccess(infoResult);
    }
  },
);

runner.test(
  'Pattern workflow: scan -> generate -> search -> get info',
  async () => {
    // 1. Scan patterns
    const scanResult = await PatternTools.scanWebComponentPatterns({});
    TestRunner.assertSuccess(scanResult);

    // 2. Generate catalog
    const catalogResult = await PatternTools.generateWebComponentPatternsCatalog(
      {},
    );
    TestRunner.assertSuccess(catalogResult);

    // 3. Search patterns
    const searchResult = await PatternTools.searchWebComponentPatterns({
      searchTerm: 'text',
    });
    TestRunner.assertSuccess(searchResult);

    // 4. Get pattern info
    const infoResult = await PatternTools.getPatternInfo({
      patternIdentifier: 'textPatterns',
    });
    TestRunner.assertSuccess(infoResult);
  },
);

// ============================
// RUN TESTS
// ============================

// Set up environment
process.env.VETS_WEBSITE_ROOT = PathDetector.getVetsWebsiteRoot();

// Run all tests
runner.run().catch(error => {
  process.stderr.write(`Test runner failed: ${error.message}\n`);
  process.exit(1);
});
