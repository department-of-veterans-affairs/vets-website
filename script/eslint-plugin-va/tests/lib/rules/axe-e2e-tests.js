'use strict';

const rule = require('../../../rules/axe-e2e-tests');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();

ruleTester.run('axe-e2e-tests', rule, {
  valid: [
    "it('does something', function() { cy.axeCheck(); });",
    "it('does something', function() { cy.injectAxeThenAxeCheck(); });",
    "it('does something', function() { if(foo) { cy.axeCheck(); } });",
    "it('does something', function() { cy.axeCheckBestPractice() })",
    "notIt('does something', function() {});",
  ],
  invalid: [
    {
      code: "it('does something', function() {});",
      output: null,
      errors: [{ messageId: 'missingAxeCheckCall', type: 'CallExpression' }],
    },
    {
      code: "it('does something', function() { notCy.axeCheck(); });",
      output: null,
      errors: [{ messageId: 'missingAxeCheckCall', type: 'CallExpression' }],
    },
    {
      code: "it('does something', function() { cy.notAxeCheck(); });",
      output: null,
      errors: [{ messageId: 'missingAxeCheckCall', type: 'CallExpression' }],
    },
  ],
});
