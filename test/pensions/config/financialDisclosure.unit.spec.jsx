import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form.js';

describe('Pensions financial disclosure', () => {
  function runTests(page, namePath, fieldCount) {
    const { schema, uiSchema, title } = page;
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

    if (!namePath.startsWith('spouse')) {
      it('should render title on review page', () => {
        const form = ReactTestUtils.renderIntoDocument(
          <DefinitionTester
              reviewMode
              title={title}
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

        expect(formDOM.querySelector('.form-review-panel-page-header').textContent).to.contain('Jane Doe');
      });
    }

    it('should submit empty form', () => {
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

      expect(formDOM.querySelectorAll('.usa-input-error')).to.be.empty;
      expect(onSubmit.called).to.be.true;
    });

    it('should add another source', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}/>
      );

      const formDOM = findDOMNode(form);

      ReactTestUtils.Simulate.click(formDOM.querySelector('.pensions-sources-add-btn'));
      submitForm(form);
      expect(onSubmit.called).to.be.false;

      expect(formDOM.querySelectorAll('input').length)
        .to.equal(fieldCount + 2);

      ReactTestUtils.Simulate.change(
        formDOM.querySelector('[id$=additionalSources_0_name]'), {
          target: {
            value: 'A source'
          }
        }
      );
      ReactTestUtils.Simulate.change(
        formDOM.querySelector('[id$=additionalSources_0_amount]'), {
          target: {
            value: '34'
          }
        }
      );

      ReactTestUtils.Simulate.click(formDOM.querySelector('button.float-left'));

      expect(formDOM.querySelectorAll('input').length)
        .to.equal(fieldCount + 1);

      submitForm(form);
      expect(onSubmit.called).to.be.true;
    });

    it('should add and remove another source', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}/>
      );

      const formDOM = findDOMNode(form);

      ReactTestUtils.Simulate.click(formDOM.querySelector('.pensions-sources-add-btn'));
      submitForm(form);
      expect(onSubmit.called).to.be.false;

      expect(formDOM.querySelectorAll('input').length)
        .to.equal(fieldCount + 2);

      ReactTestUtils.Simulate.click(formDOM.querySelector('button.float-right'));

      expect(formDOM.querySelectorAll('input').length)
        .to.equal(fieldCount);

      submitForm(form);
      expect(onSubmit.called).to.be.true;
    });
  }
  describe('Monthly income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.monthlyIncome, 'veteranFullName', 6);
  });
  describe('Spouse monthly income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.spouseMonthlyIncome, 'spouseFullName', 6);
  });
  describe('Net worth', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.netWorth, 'veteranFullName', 6);
  });
  describe('Spouse net worth', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.spouseNetWorth, 'spouseFullName', 6);
  });
  describe('Expected income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.expectedIncome, 'veteranFullName', 3);
  });
  describe('Spouse expected income', () => {
    runTests(formConfig.chapters.financialDisclosure.pages.spouseExpectedIncome, 'spouseFullName', 3);
  });
  describe('Dependent expected income', () => {
    const page = formConfig.chapters.financialDisclosure.pages.dependentsExpectedIncome;
    runTests({
      title: page.title,
      schema: page.schema.properties.children.items,
      uiSchema: page.uiSchema.children.items
    }, 'childFullName', 3);
  });
  describe('Dependent monthly income', () => {
    const page = formConfig.chapters.financialDisclosure.pages.dependentsMonthlyIncome;
    runTests({
      title: page.title,
      schema: page.schema.properties.children.items,
      uiSchema: page.uiSchema.children.items
    }, 'childFullName', 6);
  });
  describe('Dependent net worth', () => {
    const page = formConfig.chapters.financialDisclosure.pages.dependentsNetWorth;
    runTests({
      title: page.title,
      schema: page.schema.properties.children.items,
      uiSchema: page.uiSchema.children.items
    }, 'childFullName', 6);
  });
});
