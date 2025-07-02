/* eslint-disable no-console */
// Simple validation script for Node 14 compatibility
import PathDetector from '../src/utils/pathDetector.js';

// Validate the vets-website structure and print the results
const results = PathDetector.validateVetsWebsiteStructure();
console.log(JSON.stringify(results, null, 2));
