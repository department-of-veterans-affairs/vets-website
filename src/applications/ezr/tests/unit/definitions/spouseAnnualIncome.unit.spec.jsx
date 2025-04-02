import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';
import { SpouseAnnualIncomePage } from '../../../definitions/spouseAnnualIncome';
import mockPrefillWithNonPrefillData from '../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { renderProviderWrappedComponent } from '../../helpers';

describe('ezr SpouseAnnualIncomePage config', () => {
  const { schema, uiSchema } = SpouseAnnualIncomePage();
  const definitions = {
    ...formConfig.defaultDefinitions,
  };
  const mockStoreData = {
    'view:householdEnabled': true,
    'view:isProvidersAndDependentsPrefillEnabled': true,
    nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
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

  it('should not submit empty form', () => {
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
    const selectors = {
      errors: container.querySelectorAll('.usa-input-error'),
      submitBtn: container.querySelector('button[type="submit"]'),
    };
    fireEvent.click(selectors.submitBtn);

    const errors = container.querySelectorAll('.usa-input-error');
    expect(errors.length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

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
      '#root_view\\3A spouseGrossIncome_spouseGrossIncome',
    );
    const netIncomeInput = container.querySelector(
      '#root_view\\3A spouseNetIncome_spouseNetIncome',
    );
    const otherIncomeInput = container.querySelector(
      '#root_view\\3A spouseOtherIncome_spouseOtherIncome',
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
