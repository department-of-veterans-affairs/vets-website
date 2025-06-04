import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe('VA Facility Code Page (yes/no)', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionDetails;

  function renderPage(data = {}, onSubmit = sinon.spy()) {
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

  it('shows an error when no option is selected', () => {
    const { container, getByRole } = renderPage({
      institutionDetails: { hasVaFacilityCode: undefined },
    });
    fireEvent.click(getByRole('button', { name: /submit/i }));
    expect($$('va-radio[error]', container).length).to.be.greaterThan(0);
  });
});
