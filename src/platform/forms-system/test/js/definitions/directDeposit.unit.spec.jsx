import React from 'react';
import { expect } from 'chai';
import { render, getNodeText } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import getSchemas from '../../../src/js/definitions/directDeposit';

const getFieldNames = wrapper =>
  Array.from(
    wrapper.baseElement.querySelectorAll(
      '.schemaform-field-template > legend, .schemaform-field-template > label',
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

  it('should render one optional fields in the correct order', () => {});

  it('should render all optional fields in the correct order', () => {});

  it('should render optional fields with supplied schema and uiSchema', () => {});
});
