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

describe('Direct deposit definition', () => {
  it('should render all the fields', () => {
    const { schema, uiSchema } = getSchemas();
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    expect(getFieldNames(form)).to.eql([
      'Account type',
      'Bank routing number',
      'Bank account number',
    ]);
  });

  it('should render bankName', () => {
    const { schema, uiSchema } = getSchemas({ bankName: true });
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    expect(getFieldNames(form)).to.eql([
      'Account type',
      'Bank name',
      'Bank routing number',
      'Bank account number',
    ]);
  });

  it('should render declineDirectDeposit', () => {
    const { schema, uiSchema } = getSchemas({ declineDirectDeposit: true });
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    expect(getFieldNames(form)).to.eql([
      'Account type',
      'Bank routing number',
      'Bank account number',
      'I don’t want to use direct deposit',
    ]);
  });

  it('should render all optional fields in the correct order', () => {
    const { schema, uiSchema } = getSchemas({
      bankName: true,
      declineDirectDeposit: true,
    });
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    expect(getFieldNames(form)).to.eql([
      'Account type',
      'Bank name',
      'Bank routing number',
      'Bank account number',
      'I don’t want to use direct deposit',
    ]);
  });

  it('should render optional fields with supplied schema and uiSchema', () => {});
});
