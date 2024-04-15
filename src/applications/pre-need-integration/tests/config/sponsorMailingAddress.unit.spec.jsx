/* import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  claimant: {
    hasCurrentlyBuried: '1',
  },
};

const store = mockStore({
  form: {
    data: payload,
  },
});

describe('Pre-need sponsor mailing address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contactInformation.pages.sponsorMailingAddress;
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
    fillData(form, 'select#root_application_veteran_address_country', 'USA');
    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(2);

    fillData(form, 'select#root_application_veteran_address_country', 'MEX');
    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(1);
    form.unmount();
  });

  it('should submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    fillData(form, 'input#root_application_veteran_address_street', 'Test');
    fillData(form, 'input#root_application_veteran_address_city', 'Test');
    fillData(form, 'select#root_application_veteran_address_state', 'MA');
    fillData(
      form,
      'input#root_application_veteran_address_postalCode',
      '12345',
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
 */
