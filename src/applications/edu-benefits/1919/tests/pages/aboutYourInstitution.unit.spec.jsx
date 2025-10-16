import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { updateFormData } from '../../pages/aboutYourInstitution';

const mockStore = configureStore([]);

describe('About Your Institution (yes/no)', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.aboutYourInstitution;

  const renderPage = (data = {}, onSubmit = sandbox.spy()) => {
    const store = mockStore({ form: { data } });
    return render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
  };

  it('renders a Yes and a Not yet option', () => {
    const { container } = renderPage({ aboutYourInstitution: undefined });

    expect($$('va-radio-option', container).length).to.equal(2);

    const labels = $$('va-radio-option', container).map(el =>
      el.getAttribute('label'),
    );
    expect(labels).to.deep.equal(['Yes', 'Not yet']);
  });

  it('shows an error when no option is selected', async () => {
    const { container, getByRole } = renderPage({
      aboutYourInstitution: undefined,
    });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.be.greaterThan(0);
    });
  });

  it('returns the same object when the value has NOT changed', () => {
    const oldData = {
      aboutYourInstitution: true,
      institutionDetails: {
        facilityCode: 'ABC123',
        institutionName: 'Old U',
        institutionAddress: { street: '1 Main' },
      },
    };
    const newData = {
      aboutYourInstitution: true,
      institutionDetails: {
        facilityCode: 'ABC123',
        institutionName: 'Old U',
        institutionAddress: { street: '1 Main' },
      },
    };

    const result = updateFormData(oldData, newData);
    expect(result).to.equal(newData);
  });

  it('when changed from Yes → Not yet: clears fields and sets country to USA', () => {
    const oldData = {
      aboutYourInstitution: true,
      institutionDetails: {
        facilityCode: 'ABC123',
        institutionName: 'Old U',
        institutionAddress: { street: '1 Main', country: 'CAN' },
      },
    };
    const newData = {
      aboutYourInstitution: false,
      institutionDetails: {
        facilityCode: 'ABC123',
        institutionName: 'Old U',
        institutionAddress: { street: '1 Main', country: 'CAN' },
      },
    };

    const result = updateFormData(oldData, newData);

    expect(result).to.not.equal(newData);
    expect(result.institutionDetails.facilityCode).to.equal('');
    expect(result.institutionDetails.institutionName).to.equal(null);
    expect(result.institutionDetails.institutionAddress).to.deep.equal({
      country: 'USA',
    });
  });

  it('when changed from Not yet → Yes: clears fields and leaves empty address object', () => {
    const oldData = {
      aboutYourInstitution: false,
      institutionDetails: {
        facilityCode: 'ZZZ999',
        institutionName: 'Prev Name',
        institutionAddress: { country: 'USA' },
      },
    };
    const newData = {
      aboutYourInstitution: true,
      institutionDetails: {
        facilityCode: 'ZZZ999',
        institutionName: 'Prev Name',
        institutionAddress: { country: 'USA' },
      },
    };

    const result = updateFormData(oldData, newData);

    expect(result).to.not.equal(newData);
    expect(result.institutionDetails.facilityCode).to.equal('');
    expect(result.institutionDetails.institutionName).to.equal(null);
    expect(result.institutionDetails.institutionAddress).to.deep.equal({});
  });
});
