import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('22-10297 Phone and email address page', () => {
  afterEach(cleanup);

  const mockStore = configureStore();
  const store = mockStore({});
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.phoneAndEmail;

  it('renders inputs', () => {
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={{ contactInfo: {} }}
        />
      </Provider>,
    );

    expect(
      container.querySelector(
        "va-telephone-input[label='Mobile phone number']",
      ),
    ).to.exist;
    expect(
      container.querySelector("va-telephone-input[label='Home phone number']"),
    ).to.exist;
    expect(container.querySelector("va-text-input[label='Email']")).to.exist;
  });
});
