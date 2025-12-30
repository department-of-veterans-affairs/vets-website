import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.associatedOfficialsChapter.pages.principlesOfExcellenceNew;

const mockStore = configureStore();

describe('New Commitment Chapter = Principles of Excellence Point of Contact Page', () => {
  const renderPage = (
    formData = {
      authorizedOfficial: {},
      newCommitment: {
        principlesOfExcellencePointOfContact: {},
      },
    },
  ) => {
    const store = mockStore({ form: { data: formData } });
    return render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );
  };

  it('renders full name input fields', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="First or given name"]', container).length,
    ).to.equal(1);

    expect($$('va-text-input[label="Middle name"]', container).length).to.equal(
      1,
    );

    expect(
      $$('va-text-input[label="Last or family name"]', container).length,
    ).to.equal(1);
  });

  it('renders title input field', () => {
    const { container } = renderPage();

    expect($$('va-text-input[label="Title"]', container).length).to.equal(1);
  });

  it('renders international phone number input field', async () => {
    const { container } = renderPage();
    expect(
      $$('va-telephone-input[label="Phone number"]', container).length,
    ).to.equal(1);
  });

  it('renders email input field', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="Email address"]', container).length,
    ).to.equal(1);
  });

  describe('SCO radio button', () => {
    it('renders if the authorizing official is not the SCO', async () => {
      const { container } = renderPage({
        authorizedOfficial: { 'view:isSCO': false },
        newCommitment: {
          principlesOfExcellencePointOfContact: {},
        },
      });

      expect(
        $$(
          'va-radio[label="Is this person also a school certifying official?"]',
          container,
        ).length,
      ).to.equal(1);
    });

    it('does not render if the authorizing official is the SCO', async () => {
      const { container } = renderPage({
        authorizedOfficial: { 'view:isSCO': true },
        newCommitment: {
          principlesOfExcellencePointOfContact: {},
        },
      });

      expect(
        $$(
          'va-radio[label="Is this person also a school certifying official?"]',
          container,
        ).length,
      ).to.equal(0);
    });
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      // at least 4 input form errors (first name, last name, title, emai)
      expect($$('va-text-input[error]', container).length).to.equal(4);

      // at least 1 radio form errors (SCO)
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });
});
