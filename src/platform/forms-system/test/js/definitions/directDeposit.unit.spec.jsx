import React from 'react';
import { expect } from 'chai';
import { render, getNodeText } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import getSchemas, {
  prefillBankInformation,
} from '../../../src/js/definitions/directDeposit';

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
    testFieldOrder({}, [
      'Account type',
      "Bank's 9-digit routing number",
      'Bank account number',
    ]));

  it('should render bankName', () =>
    testFieldOrder({ optionalFields: { bankName: true } }, [
      'Account type',
      'Bank name',
      "Bank's 9-digit routing number",
      'Bank account number',
    ]));

  it('should render declineDirectDeposit', () =>
    testFieldOrder({ optionalFields: { declineDirectDeposit: true } }, [
      'Account type',
      "Bank's 9-digit routing number",
      'Bank account number',
      'I don’t want to use direct deposit',
    ]));

  it('should render all optional fields in the correct order', () =>
    testFieldOrder(
      { optionalFields: { bankName: true, declineDirectDeposit: true } },
      [
        'Account type',
        'Bank name',
        "Bank's 9-digit routing number",
        'Bank account number',
        'I don’t want to use direct deposit',
      ],
    ));

  it('should return optional fields with supplied schema and uiSchema', () => {
    const bankNameSchema = { schema: 'bankName' };
    const bankNameUiSchema = { uiSchema: 'bankName' };
    const declineDirectDepositSchema = { schema: 'declineDirectDeposit' };
    const declineDirectDepositUiSchema = { uiSchema: 'declineDirectDeposit' };

    const { schema, uiSchema } = getSchemas({
      optionalFields: {
        bankName: { schema: bankNameSchema, uiSchema: bankNameUiSchema },
        declineDirectDeposit: {
          schema: declineDirectDepositSchema,
          uiSchema: declineDirectDepositUiSchema,
        },
      },
    });

    // Compare schemas
    expect(schema.properties.bankAccount.properties.bankName).to.eql(
      bankNameSchema,
    );
    expect(schema.properties.declineDirectDeposit).to.eql(
      declineDirectDepositSchema,
    );
    // Compare uiSchemas
    expect(uiSchema.declineDirectDeposit).to.eql(declineDirectDepositUiSchema);
    expect(uiSchema.bankAccount.bankName).to.eql(bankNameUiSchema);
  });

  it('should render the affected benefits', () => {
    const { schema, uiSchema } = getSchemas({
      affectedBenefits: 'disability compensation, pension, and education',
    });

    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    // If this throws, the test failed. If it doesn't, the test passed.
    return form.getByText(
      /will change your bank account information for some VA benefits, including disability compensation, pension, and education./i,
    );
  });

  it('should render the unaffected benefits', () => {
    const { schema, uiSchema } = getSchemas({
      unaffectedBenefits: 'disability compensation, pension, and education',
    });

    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    // If this throws, the test failed. If it doesn't, the test passed.
    return form.getByText(
      /These updates won’t change your bank account information for disability compensation, pension, and education./i,
    );
  });
});

describe('prefillBankInformation', () => {
  const prefilledFormData = {
    standard: () => ({
      accountType: 'checking',
      accountNumber: '1234567890',
      routingNumber: '012345',
      bankName: 'Gringotts',
      firstName: 'Harry',
    }),
    nonStandard: () => ({
      type: 'checking',
      account: '1234567890',
      routing: '012345',
      name: 'Gringotts',
      firstName: 'Harry',
    }),
  };

  const transformedFormData = () => ({
    bankAccount: {
      'view:hasPrefilledBank': true,
    },
    'view:originalBankAccount': {
      'view:accountType': 'checking',
      'view:accountNumber': '1234567890',
      'view:routingNumber': '012345',
      'view:bankName': 'Gringotts',
    },
    firstName: 'Harry',
  });

  const nonStandardFieldNames = {
    accountType: 'type',
    accountNumber: 'account',
    routingNumber: 'routing',
    bankName: 'name',
  };

  it('should remove root-level fields in favor of "viewified" bank information', () => {
    expect(prefillBankInformation(prefilledFormData.standard())).to.deep.equal(
      transformedFormData(),
    );
  });

  it('should accept custom pre-filled field names', () => {
    expect(
      prefillBankInformation(
        prefilledFormData.nonStandard(),
        nonStandardFieldNames,
      ),
    ).to.deep.equal(transformedFormData());
  });
});
