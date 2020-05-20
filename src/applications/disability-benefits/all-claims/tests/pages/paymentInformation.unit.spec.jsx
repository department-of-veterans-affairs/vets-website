import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form.js';

const {
  schema,
  uiSchema,
} = formConfig.chapters.additionalInformation.pages.paymentInformation;

describe('526 -- paymentInformation', () => {
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(1);
    form.unmount();
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const fakeStore = {
      getState: () => ({ form: { data: {} } }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const form = mount(
      // The page's PaymentView is connected to the redux store
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{
            'view:bankAccount': {
              bankAccountType: 'Checking',
              bankAccountNumber: '1234567890',
              bankRoutingNumber: '123456789',
              bankName: 'Test Bank',
            },
          }}
          formData={{}}
          uiSchema={uiSchema}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    form.unmount();
  });

  it('should not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:bankAccount': {
            bankAccountType: 'Checking',
          },
        }}
        formData={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    expect(form.find('.usa-input-error-message').length).to.equal(3);
    form.unmount();
  });

  it('should submit with no info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.calledOnce).to.be.true;
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    form.unmount();
  });
});
