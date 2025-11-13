import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import formConfig from '../../config/form';
import { updateFormData } from '../../pages/institutionDetails';

const mockStore = configureStore([]);

describe('VA Facility Code Page (yes/no)', () => {
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
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionDetails;

  function renderPage(data = {}, onSubmit = sandbox.spy()) {
    const store = mockStore({ form: { data } });
    return render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={data}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
  }

  it('renders a Yes and a Not yet option', () => {
    const { container } = renderPage({
      institutionDetails: { hasVaFacilityCode: undefined },
    });
    expect($$('va-radio-option', container).length).to.equal(2);

    const labels = $$('va-radio-option', container).map(el =>
      el.getAttribute('label'),
    );
    expect(labels).to.deep.equal(['Yes', 'Not yet']);
  });

  it('shows an error when no option is selected', async () => {
    const { container, getByRole } = renderPage({
      institutionDetails: { hasVaFacilityCode: undefined },
    });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.be.greaterThan(0);
    });
  });
  it('returns the same object when the radio choice has NOT changed', () => {
    const oldData = {
      institutionDetails: { hasVaFacilityCode: 'Y', institutionName: 'Foo' },
    };
    const newData = {
      institutionDetails: { hasVaFacilityCode: 'Y', institutionName: 'Foo' },
    };

    const result = updateFormData(oldData, newData);

    expect(result).to.equal(newData);
  });

  it('clears name & address when the radio choice DOES change', () => {
    const oldData = {
      institutionDetails: {
        hasVaFacilityCode: 'Y',
        institutionName: 'Old School',
        institutionAddress: { street: '111 Old', city: 'Springfield' },
      },
    };
    const newData = {
      institutionDetails: {
        hasVaFacilityCode: 'N',
        institutionName: 'Old School',
        institutionAddress: { street: '111 Old', city: 'Springfield' },
      },
    };

    const result = updateFormData(oldData, newData);

    expect(result).to.not.equal(newData);
    expect(result.institutionDetails.institutionName).to.be.null;
    expect(result.institutionDetails.institutionAddress).to.deep.equal({});
  });
});
