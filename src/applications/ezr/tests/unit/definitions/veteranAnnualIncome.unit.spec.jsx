import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import { VeteranAnnualIncomePage } from '../../../definitions/veteranAnnualIncome';
import mockPrefillWithNonPrefillData from '../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { renderProviderWrappedComponent } from '../../helpers';
import { testNumberOfErrorsOnSubmit } from '../config/helpers.spec';

describe('ezr VeteranAnnualIncomePage config', () => {
  const { schema, uiSchema } = VeteranAnnualIncomePage();
  const definitions = {
    ...formConfig.defaultDefinitions,
  };
  const mockStoreData = {
    form: {
      data: {
        'view:householdEnabled': true,
        'view:isProvidersAndDependentsPrefillEnabled': true,
        nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
      },
    },
  };

  it('should render', () => {
    const { container } = renderProviderWrappedComponent(
      mockStoreData,
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
      />,
    );

    expect(container.querySelectorAll('input, select').length).to.equal(3);
  });

  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    3,
    'Veteran Annual Income',
  );

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const { container } = renderProviderWrappedComponent(
      mockStoreData,
      <DefinitionTester
        schema={schema}
        definitions={definitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    // Fill in the form fields
    const grossIncomeInput = container.querySelector(
      '#root_view\\:veteranGrossIncome_veteranGrossIncome',
    );
    const netIncomeInput = container.querySelector(
      '#root_view\\:veteranNetIncome_veteranNetIncome',
    );
    const otherIncomeInput = container.querySelector(
      '#root_view\\:veteranOtherIncome_veteranOtherIncome',
    );

    fireEvent.change(grossIncomeInput, { target: { value: '100000' } });
    fireEvent.change(netIncomeInput, { target: { value: '76000' } });
    fireEvent.change(otherIncomeInput, { target: { value: '0' } });

    const selectors = {
      errors: container.querySelectorAll('.usa-input-error'),
      submitBtn: container.querySelector('button[type="submit"]'),
    };
    fireEvent.click(selectors.submitBtn);

    const errors = container.querySelectorAll('.usa-input-error');
    expect(errors.length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
