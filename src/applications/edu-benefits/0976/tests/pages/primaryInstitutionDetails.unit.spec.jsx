import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import page from '../../pages/primaryInstitutionDetails';
import formConfig from '../../config/form';
import * as useValidateFacilityCodeModule from '../../hooks/useValidateFacilityCode';

const mockStore = configureStore([]);

const renderPage = (storeData = {}) => {
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
        primaryInstitutionDetails: {
          ...details,
        },
      },
    },
  };
};

describe('22-0976 primary institution details page', () => {
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
  });

  afterEach(() => {
    useValidateFacilityCodeStub.restore();
  });

  it('renders the page', () => {
    const { container } = renderPage(buildState({ facilityCode: '' }));

    expect(container.textContent).to.contain(
      'If your institution has a VA facility code, please enter it below',
    );
    expect(container.querySelectorAll('va-text-input').length).to.equal(1);
  });

  it('shows a loading state if loading', () => {
    useValidateFacilityCodeStub.returns({
      loading: true,
      hasError: false,
    });
    const { container } = renderPage(buildState({ facilityCode: '1234567' }));

    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('shows institution data when available', () => {
    const { container } = renderPage(
      buildState({
        facilityCode: '12345678',
        name: 'Test University',
        failedToLoad: false,
        type: 'PUBLIC',
        mailingAddress: {
          street: '123 Fake St.',
          street2: '',
          street3: '',
          city: 'YUMA',
          state: 'AZ',
          postalCode: '85365',
          country: 'USA',
        },
      }),
    );

    expect(container.textContent).to.contain('Test University');
    expect(container.textContent).to.contain('123 Fake St.');
  });

  it('shows an error when input is invalid', async () => {
    const { container, getByRole } = renderPage(
      buildState({
        facilityCode: '1234567$',
        name: '',
        failedToLoad: false,
      }),
    );

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const input = container.querySelector('va-text-input');

      expect(input.getAttribute('error')).to.equal(
        'Enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
      );
    });
  });
});
