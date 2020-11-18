import React from 'react';
import { expect } from 'chai';
import { render, getNodeText } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import getSchemas from '../../../src/js/definitions/directDeposit';

const getFieldNames = wrapper =>
  Array.from(
    wrapper.baseElement.querySelectorAll(
      '.schemaform-field-template > legend, .schemaform-field-template > label, .form-checkbox > label',
    ),
  ).map(f => getNodeText(f));

const testFieldOrder = (getSchemasOptions, expectedFieldNames) => {
  const { schema, uiSchema } = getSchemas(getSchemasOptions);
  const form = render(<DefinitionTester schema={schema} uiSchema={uiSchema} />);

  expect(getFieldNames(form)).to.eql(expectedFieldNames);
};

describe('Direct deposit definition', () => {
  it('should render all the fields', () =>
    testFieldOrder(null, [
      'Account type',
      'Bank routing number',
      'Bank account number',
    ]));

  it('should render bankName', () =>
    testFieldOrder({ bankName: true }, [
      'Account type',
      'Bank name',
      'Bank routing number',
      'Bank account number',
    ]));

  it('should render declineDirectDeposit', () =>
    testFieldOrder({ declineDirectDeposit: true }, [
      'Account type',
      'Bank routing number',
      'Bank account number',
      'I don’t want to use direct deposit',
    ]));

  it('should render all optional fields in the correct order', () =>
    testFieldOrder({ bankName: true, declineDirectDeposit: true }, [
      'Account type',
      'Bank name',
      'Bank routing number',
      'Bank account number',
      'I don’t want to use direct deposit',
    ]));

  it('should render optional fields with supplied schema and uiSchema', () => {});
});
