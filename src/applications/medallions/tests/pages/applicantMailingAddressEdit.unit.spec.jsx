import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions applicantMailingAddressEdit', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.editMailingAddress;

  const mockStore = configureStore([]);
  const store = mockStore({});

  it('should render', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('va-text-input').length).to.be.greaterThan(0);
    form.unmount();
  });

  it('should render address fields', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            applicantMailingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62701',
              country: 'USA',
            },
          }}
        />
      </Provider>,
    );

    expect(form.find('va-text-input').length).to.equal(4);
    form.unmount();
  });

  it('should show alert about profile updates', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect(form.find('va-alert').length).to.equal(1);
    form.unmount();
  });
});
