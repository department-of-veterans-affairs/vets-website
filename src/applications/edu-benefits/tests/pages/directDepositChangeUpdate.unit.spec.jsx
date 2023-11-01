import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig1995 from '../../1995/config/form';

const pageTests = page => {
  const { schema, uiSchema } = page;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input').length).to.equal(3);
  });
  it('should not require bank account fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_bankAccountChangeUpdate_1'),
      {
        target: {
          value: 'startUpdate',
        },
      },
    );

    expect(formDOM.querySelectorAll('input').length).to.equal(7);

    submitForm(form);

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(0);
  });
  it('should show error on bad routing number', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );

    const formDOM = findDOMNode(form);
    ReactTestUtils.Simulate.change(
      formDOM.querySelector('#root_bankAccountChangeUpdate_1'),
      {
        target: {
          value: 'startUpdate',
        },
      },
    );
    const routingNumber = formDOM.querySelector(
      '#root_bankAccount_routingNumber',
    );

    ReactTestUtils.Simulate.change(routingNumber, {
      target: {
        value: '01234567',
      },
    });

    ReactTestUtils.Simulate.blur(routingNumber);

    expect(
      formDOM.querySelector('.usa-input-error #root_bankAccount_routingNumber'),
    ).not.to.be.null;
  });
};

describe('Edu directDepositChangePage', () => {
  describe('1995', () =>
    pageTests(formConfig1995.chapters.personalInformation.pages.directDeposit));
});
