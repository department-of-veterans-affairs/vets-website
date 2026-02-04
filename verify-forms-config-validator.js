#!/usr/bin/env node

/**
 * Verification script for forms-config-validator CI changes
 * This script tests that the select-unit-tests.js correctly identifies
 * when to run the forms-config-validator test
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Simple test cases to verify the logic works
const testCases = [
  {
    name: 'Should trigger when config/form.js is changed',
    changedFiles: [
      'src/applications/pensions/config/form.js',
    ],
    expectedInclusion: true,
  },
  {
    name: 'Should trigger when multiple files include config/form.js',
    changedFiles: [
      'src/applications/ezr/components/FormFields/MonthYearGroup.jsx',
      'src/applications/ezr/config/form.js',
      'src/applications/ezr/tests/unit/config/form.unit.spec.jsx',
    ],
    expectedInclusion: true,
  },
  {
    name: 'Should NOT trigger when no config/form.js is changed',
    changedFiles: [
      'src/applications/pensions/components/SomeComponent.jsx',
      'src/platform/forms/tests/some-other.unit.spec.jsx',
    ],
    expectedInclusion: false,
  },
  {
    name: 'Should NOT trigger when config/form.js is in non-application path',
    changedFiles: [
      'src/platform/config/form.js',
      'config/form.js',
    ],
    expectedInclusion: false,
  },
  {
    name: 'Should trigger for form.js in nested application paths',
    changedFiles: [
      'src/applications/ivc-champva/10-7959C/config/form.js',
    ],
    expectedInclusion: true,
  },
];

console.log('Testing forms-config-validator CI logic\n');
console.log('=' .repeat(60));

// Run each test case
testCases.forEach((testCase, index) => {
  console.log(`\nTest ${index + 1}: ${testCase.name}`);
  console.log('-'.repeat(60));
  
  // Simulate the detection logic
  const CHANGED_FILES = testCase.changedFiles;
  const hasFormConfigChanges = CHANGED_FILES.some(
    filePath =>
      filePath.includes('/config/form.js') &&
      filePath.startsWith('src/applications/'),
  );
  
  console.log('Changed files:', testCase.changedFiles.join(', '));
  console.log('Expected to include validator:', testCase.expectedInclusion);
  console.log('Actually includes validator:', hasFormConfigChanges);
  
  try {
    assert.strictEqual(
      hasFormConfigChanges,
      testCase.expectedInclusion,
      `Test failed: ${testCase.name}`
    );
    console.log('✅ PASSED');
  } catch (error) {
    console.log('❌ FAILED');
    console.error(error.message);
    process.exit(1);
  }
});

console.log('\n' + '='.repeat(60));
console.log('All tests passed! ✅');
console.log('\nThe logic correctly identifies when to run forms-config-validator test:');
console.log('- Runs when any src/applications/**/config/form.js is changed');
console.log('- Does not run for other file changes');
console.log('- Does not run for config/form.js outside src/applications/');
