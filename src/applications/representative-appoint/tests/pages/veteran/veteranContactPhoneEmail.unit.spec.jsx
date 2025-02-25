import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';

describe('Veteran Contact Phone Email page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInfo.pages.veteranContactPhoneEmail;

  const mockStore = configureStore();
  const store = mockStore({
    user: { login: { currentlyLoggedIn: true } },
    form: { data: {} },
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    expect(container.querySelector('button[type="submit"]')).to.exist;
  });

  it('should have proper max length for email field', () => {
    expect(schema.properties.veteranEmail.maxLength).to.equal(61);
  });

  it('should require email when LOA3 is true and representative submission method is online', () => {
    const formData = {
      'view:isUserLOA3': true,
      representativeSubmissionMethod: 'online',
    };

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={formData}
        />
      </Provider>,
    );

    const emailField = container.querySelector(
      'va-text-input[name="root_veteranEmail"]',
    );

    expect(emailField).to.exist;

    expect(emailField).to.have.attribute('required');
  });

  it('should NOT require email when LOA3 is false or representative submission method is not online', () => {
    const formData = {
      'view:isUserLOA3': false,
      representativeSubmissionMethod: 'mail',
    };

    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={{}}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={formData}
        />
      </Provider>,
    );

    const emailField = container.querySelector(
      'va-text-input[name="root_veteranEmail"]',
    );

    expect(emailField).to.exist;

    expect(emailField.required).to.equal(false);
  });
});
