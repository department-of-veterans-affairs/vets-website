import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import page from '../../pages/additionalInstitutionsItemWithCode';
import formConfig from '../../config/form';
import * as useValidateFacilityCodeModule from '../../hooks/useValidateFacilityCode';

const mockStore = configureStore([]);

const renderPage = storeData => {
  const store = mockStore(storeData);
  return render(
    <Provider store={store}>
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={page.schema}
        uiSchema={page.uiSchema}
        data={storeData.form.data}
      />
    </Provider>,
  );
};

const buildState = details => {
  return {
    form: {
      data: {
        ...details,
      },
    },
  };
};

describe('22-0976 additional institutions item page', () => {
  let useValidateFacilityCodeStub;

  beforeEach(() => {
    // Mock the hooks to return controlled values
    useValidateFacilityCodeStub = sinon.stub(
      useValidateFacilityCodeModule,
      'useValidateFacilityCode',
    );

    // Default mock return values
    useValidateFacilityCodeStub.returns({
      loading: false,
      hasError: false,
    });

    window.history.pushState(
      {},
      '',
      '/additional-institutions-facility-code/0',
    );
  });

  afterEach(() => {
    useValidateFacilityCodeStub.restore();
  });

  it('renders the input', () => {
    const { container } = renderPage(
      buildState({ hasVaFacilityCode: true, additionalInstitutions: [] }),
    );

    expect(container.querySelector('va-text-input[label="Facility code"]')).to
      .exist;
  });

  it('shows an error when invalid facility code is given', async () => {
    const { container, getByRole } = renderPage(
      buildState({
        hasVaFacilityCode: true,
        facilityCode: '1234567$',
        additionalInstitutions: [],
      }),
    );

    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const facilityCodeInput = container.querySelector('va-text-input');
    expect(facilityCodeInput.getAttribute('error')).to.equal(
      'Enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  });
});
