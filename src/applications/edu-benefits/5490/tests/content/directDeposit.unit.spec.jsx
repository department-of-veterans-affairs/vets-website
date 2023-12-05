import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';
import {
  gaBankInfoHelpText,
  validateRoutingNumber,
} from '../../content/directDeposit';

describe('Edu 5490 personalInformation directDeposit', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.directDeposit;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={schema} data={{}} uiSchema={uiSchema} />,
    );
    const formDOM = findDOMNode(form);
    expect(formDOM).to.not.be.null;

    // expect(formDOM.querySelectorAll('input, select').length).to.equal(15);
  });
});

describe('Edu 5490 directDeposit', () => {
  it('should execute validateRoutingNumber', () => {
    const errors = {
      addError: (pattern = undefined) => {
        let result;
        if (pattern) {
          result = pattern;
        }
        return result;
      },
    };
    const routingNumber = 123;
    const validRoutingNumber = '026009593';
    const formData = {};
    const {
      schema,
    } = formConfig.chapters.personalInformation.pages.directDeposit;
    const errorMessages = {
      pattern: 'n/a',
    };
    validateRoutingNumber(
      errors,
      routingNumber,
      formData,
      schema,
      errorMessages,
    );
    validateRoutingNumber(
      errors,
      validRoutingNumber,
      formData,
      schema,
      errorMessages,
    );
  });
  it('should execute gaBankInfoHelpText', () => {
    gaBankInfoHelpText();
  });
});
