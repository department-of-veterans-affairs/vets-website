import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form.js';

describe('Pensions financial disclosure', () => {
  function runTests(page, namePath, fieldCount) {
    const { schema, uiSchema } = page;
    it('should render', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            data={{
              [namePath]: {
                first: 'Jane',
                last: 'Doe'
              }
            }}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}/>
      );
      const formDOM = findDOMNode(form);

      expect(formDOM.querySelectorAll('input').length)
        .to.equal(fieldCount);
      expect(formDOM.querySelector('.pensions-disclosure-name').textContent).to.contain('Jane Doe');
    });

    it('should not submit empty form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}/>
      );

      const formDOM = findDOMNode(form);

      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(fieldCount - 1);
      expect(onSubmit.called).to.be.false;
    });
    it('should submit after filling in required fields', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}/>
      );

      const formDOM = findDOMNode(form);

      Array.from(formDOM.querySelectorAll('input')).slice(0, -1)
        .forEach(input => {
          ReactTestUtils.Simulate.change(
            input, {
              target: {
                value: '0'
              }
            }
          );
        });

      submitForm(form);
      expect(onSubmit.called).to.be.true;
    });
  }
  describe('Monthly income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.monthlyIncome, 'veteranFullName', 7);
  });
  describe('Spouse monthly income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.spouseMonthlyIncome, 'spouseFullName', 7);
  });
  describe('Net worth', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.netWorth, 'veteranFullName', 7);
  });
  describe('Spouse net worth', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.spouseNetWorth, 'spouseFullName', 7);
  });
  describe('Expected income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.expectedIncome, 'veteranFullName', 4);
  });
  describe('Spouse expected income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.spouseExpectedIncome, 'spouseFullName', 4);
  });
});
