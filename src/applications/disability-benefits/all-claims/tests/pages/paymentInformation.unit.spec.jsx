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

    expect(form.find('va-text-input').length).to.equal(3);
    expect(form.find('va-select').length).to.equal(1);

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

    expect(form.find('va-text-input').length).to.equal(3);
    expect(form.find('va-select').length).to.equal(1);

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
      expect(form.find('va-text-input[error]').length).to.equal(0);
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
      expect(form.find('va-text-input[error]').length).to.equal(3);
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
      expect(form.find('va-text-input[error]').length).to.equal(0);
      form.unmount();
    });
  });
});

describe('Confirmation view - ui:confirmationField with custom ConfirmationPaymentInformation component', () => {
  it('should render new payment information when provided', () => {
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

  it('should render prefilled bank information when available and no new info provided', () => {
    const formData = {
      'view:bankAccount': {
        'view:hasPrefilledBank': true,
      },
      'view:originalBankAccount': {
        'view:bankAccountType': 'Savings',
        'view:bankAccountNumber': '9876543210',
        'view:bankRoutingNumber': '987654321',
        'view:bankName': 'Prefilled Bank',
      },
    };

    const confirmationField = uiSchema['ui:confirmationField']({ formData });
    const { container } = render(confirmationField);

    const heading = container.querySelector('h4');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Payment Information');

    // Check that prefilled banking details are displayed
    expect(container.textContent).to.contain('Savings');
    expect(container.textContent).to.contain('Prefilled Bank');
    expect(container.textContent).to.contain('******3210');
    expect(container.textContent).to.contain('*****4321');
  });

  it('should display new banking info over prefilled info when both exist', () => {
    const formData = {
      'view:bankAccount': {
        'view:hasPrefilledBank': true,
        bankAccountType: 'Checking',
        bankAccountNumber: '1234567890',
        bankRoutingNumber: '123456789',
        bankName: 'New Bank',
      },
      'view:originalBankAccount': {
        bankAccountType: 'Savings',
        bankAccountNumber: '9876543210',
        bankRoutingNumber: '987654321',
        bankName: 'Old Bank',
      },
    };

    const confirmationField = uiSchema['ui:confirmationField']({ formData });
    const { container } = render(confirmationField);

    // Check that new bank info is displayed
    expect(container.textContent).to.contain('New Bank');
    expect(container.textContent).to.contain('******7890'); // new account number
    expect(container.textContent).to.contain('*****6789'); // new routing number

    // Check that old bank info is not displayed
    expect(container.textContent).not.to.contain('Old Bank');
    expect(container.textContent).not.to.contain('******3210'); // old account number
    expect(container.textContent).not.to.contain('*****4321'); // old routing number
  });

  it('should not display if neither prefilled nor new banking info is provided', () => {
    const confirmationField = uiSchema['ui:confirmationField']({
      formData: {},
    });
    const { container } = render(confirmationField);
    expect(container.firstChild).to.be.null;
  });

  it('should handle undefined view:bankAccount', () => {
    const confirmationField = uiSchema['ui:confirmationField']({
      formData: {
        'view:bankAccount': undefined,
      },
    });
    const { container } = render(confirmationField);
    expect(container.firstChild).to.be.null;
  });

  it('should handle null view:bankAccount', () => {
    const confirmationField = uiSchema['ui:confirmationField']({
      formData: {
        'view:bankAccount': null,
      },
    });
    const { container } = render(confirmationField);
    expect(container.firstChild).to.be.null;
  });

  it('should handle partial new banking info', () => {
    const formData = {
      'view:bankAccount': {
        bankAccountType: 'Checking',
        // Missing bankAccountNumber and bankRoutingNumber
      },
    };

    const confirmationField = uiSchema['ui:confirmationField']({ formData });
    const { container } = render(confirmationField);

    expect(container.textContent).to.contain('Checking');
    expect(container.textContent).not.to.contain('******');
    expect(container.textContent).not.to.contain('*****');
  });

  it('should render when only bankName is provided', () => {
    const formData = {
      'view:bankAccount': {
        bankName: 'Test Bank Only',
        // No other banking fields provided
      },
    };

    const confirmationField = uiSchema['ui:confirmationField']({ formData });
    const { container } = render(confirmationField);

    const heading = container.querySelector('h4');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal('Payment Information');

    // Bank name should be displayed
    expect(container.textContent).to.contain('Test Bank Only');

    // Other fields should be empty but not show masked values
    expect(container.textContent).not.to.contain('******');
    expect(container.textContent).not.to.contain('*****');
  });
});
