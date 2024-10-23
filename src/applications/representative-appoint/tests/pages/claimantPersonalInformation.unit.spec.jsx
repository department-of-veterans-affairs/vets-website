import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

describe('Claimant Personal Information page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInfo.pages.claimantPersonalInformation;

  const mockStore = configureStore();
  const store = mockStore({
    user: { login: { currentlyLoggedIn: true } },
  });

  // Custom page is rendered, so this only renders a submit button
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

    expect($('button[type="submit"]', container)).to.exist;
  });
});
