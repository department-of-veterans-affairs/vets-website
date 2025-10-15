import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.additionalInformation.pages.paymentInformation;

describe('526 -- paymentInformation', () => {
  it('should render with no prefill', () => {
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

    const alert = form.find('va-alert');
    expect(alert.length).to.equal(1);
    expect(alert.find('strong').text()).to.contain(
      'We’ll use this bank account for all your VA benefit payments',
    );

    form.unmount();
  });

  it('should render with prefill', () => {
    const formData = {
      'view:originalBankAccount': {
        'view:bankAccountType': 'Checking',
        'view:bankAccountNumber': '*********1234',
        'view:bankRoutingNumber': '*****2115',
        'view:bankName': 'Comerica',
      },
    };
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={formData}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(1);

    const alert = form.find('va-alert');
    expect(alert.length).to.equal(1);
    expect(alert.find('strong').text()).to.contain(
      'We’ll use this bank account for all your VA benefit payments',
    );

    form.unmount();
  });

  it('should submit with all required info', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.calledOnce).to.be.true;
      expect(form.find('.usa-input-error-message').length).to.equal(0);
    });

    const alert = form.find('va-alert');
    expect(alert.length).to.equal(1);
    expect(alert.find('strong').text()).to.contain(
      'We’ll use this bank account for all your VA benefit payments',
    );

    form.unmount();
  });

  it('should not submit without required info', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find('.usa-input-error-message').length).to.equal(3);
      form.unmount();
    });
  });

  it('should submit with no info', async () => {
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.calledOnce).to.be.true;
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      form.unmount();
    });
  });
});

describe('Confirmation view - ui:confirmationField with custom ConfirmationPaymentInformation component', () => {
  it('should render payment information correctly', () => {
    const formData = {
      'view:bankAccount': {
        bankAccountType: 'Checking',
        bankAccountNumber: '1234567890',
        bankRoutingNumber: '123456789',
        bankName: 'Test Bank',
      },
    };

    const confirmationField = uiSchema['ui:confirmationField']({ formData });
    const { container } = render(confirmationField);

    const heading = container.querySelector('h4');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Payment Information');

    // Check that banking details are displayed
    expect(container.textContent).to.contain('Checking');
    expect(container.textContent).to.contain('Test Bank');
    expect(container.textContent).to.contain('******7890');
    expect(container.textContent).to.contain('*****6789');
  });

  it('should not display if optional paymentInformation is not provided', () => {
    const confirmationField = uiSchema['ui:confirmationField']({
      formData: {},
    });
    const { container } = render(confirmationField);
    expect(container.firstChild).to.be.null;
  });
});
