import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import formConfig from '../../../config/form';
import { VeteranAnnualIncomePage } from '../../../definitions/veteranAnnualIncome';
import mockPrefillWithNonPrefillData from '../../e2e/fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import { setMockStoreData } from '../../helpers';

describe('ezr VeteranAnnualIncomePage config', () => {
  const { schema, uiSchema } = VeteranAnnualIncomePage();
  const definitions = {
    ...formConfig.defaultDefinitions,
  };
  const { mockStore } = setMockStoreData({
    'view:householdEnabled': true,
    'view:isProvidersAndDependentsPrefillEnabled': true,
    nonPrefill: mockPrefillWithNonPrefillData.formData.nonPrefill,
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(container.querySelectorAll('input, select').length).to.equal(3);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
        />
      </Provider>,
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
    const { container } = render(
      <Provider store={mockStore}>
        <DefinitionTester
          schema={schema}
          definitions={definitions}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    // Fill in the form fields
    const grossIncomeInput = container.querySelector(
      '#root_view\\3A veteranGrossIncome_veteranGrossIncome',
    );
    const netIncomeInput = container.querySelector(
      '#root_view\\3A veteranNetIncome_veteranNetIncome',
    );
    const otherIncomeInput = container.querySelector(
      '#root_view\\3A veteranOtherIncome_veteranOtherIncome',
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
