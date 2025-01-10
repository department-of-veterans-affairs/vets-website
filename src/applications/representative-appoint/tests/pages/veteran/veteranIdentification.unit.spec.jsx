import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';

describe('Veteran Identification page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInfo.pages.veteranIdentification;

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

  it('should have proper max lengths in schema', () => {
    expect(schema.properties.veteranVAFileNumber.maxLength).to.equal(9);
    expect(schema.properties.veteranServiceNumber.maxLength).to.equal(9);
  });
});
