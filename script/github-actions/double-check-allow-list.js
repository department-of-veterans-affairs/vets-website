/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const TESTS = process.env.TESTS || [];
const { TESTS_PROPERTY } = process.env;

const ALLOW_LIST =
  process.env.TEST_TYPE &&
  fs.existsSync(path.resolve(`${process.env.TEST_TYPE}_allow_list.json`))
    ? JSON.parse(
        fs.readFileSync(
          path.resolve(`${process.env.TEST_TYPE}_allow_list.json`),
        ),
      )
    : [];

console.log('TESTS', TESTS);
console.log('TESTS_PROPERTY', TESTS_PROPERTY);
console.log('ALLOW_LIST', ALLOW_LIST);
