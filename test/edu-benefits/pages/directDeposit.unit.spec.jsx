import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester, submitForm } from '../../util/schemaform-utils.jsx';
import formConfig1990n from '../../../src/js/edu-benefits/1990n/config/form';
import formConfig1990e from '../../../src/js/edu-benefits/1990e/config/form';
import formConfig5490 from '../../../src/js/edu-benefits/5490/config/form';

const pageTests = (page, isRequired = false) => {
  const { schema, uiSchema } = page;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(4);
  });

  if (isRequired) {
    it('should show required errors', () => {
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            data={{}}
            uiSchema={uiSchema}/>
      );

      const formDOM = findDOMNode(form);
      submitForm(form);

      expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(3);
    });
  } else {
    it('should submit form', () => {
      const onSubmit = sinon.spy();
      const form = ReactTestUtils.renderIntoDocument(
        <DefinitionTester
            schema={schema}
            data={{}}
            onSubmit={onSubmit}
            uiSchema={uiSchema}/>
      );

      submitForm(form);

      expect(onSubmit.called).to.be.true;
    });
  }
};

describe('Edu directDepositChangePage', () => {
  describe('1990e', () => pageTests(formConfig1990e.chapters.personalInformation.pages.directDeposit));
  describe('1990n', () => pageTests(formConfig1990n.chapters.personalInformation.pages.directDeposit, true));
  describe('5490', () => pageTests(formConfig5490.chapters.personalInformation.pages.directDeposit));
});
