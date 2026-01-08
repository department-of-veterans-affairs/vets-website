import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import DirectDepositField from '../../../components/DirectDepositField';
import DirectDepositViewField from '../../../components/DirectDepositViewField';

describe('DirectDepositField', () => {
  const defaultProps = {
    schema: {
      type: 'object',
      properties: {
        'view:directDeposit': {
          type: 'object',
          properties: {
            bankAccount: {
              type: 'object',
              required: ['accountType', 'accountNumber', 'routingNumber'],
              properties: {
                accountType: {
                  type: 'string',
                  enum: ['Checking', 'Savings'],
                },
                routingNumber: {
                  type: 'string',
                  pattern: '^[\\d*]{5}\\d{4}$',
                },
                accountNumber: {
                  type: 'string',
                  pattern: '^[\\d*]{5,17}$',
                },
              },
            },
          },
        },
      },
    },
    uiSchema: {
      'ui:title': 'Direct deposit information',
      'ui:field': DirectDepositField,
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
        viewComponent: DirectDepositViewField,
        volatileData: true,
      },
      bankAccount: bankAccountUI,
    },
    formContext: {
      onError: () => {},
    },
    formData: {
      bankAccount: {},
    },
    onChange: spy(),
    onBlur: () => {},
  };

  it('should start in edit mode if bankAccount data is empty', () => {
    const wrapper = shallow(<DirectDepositField {...defaultProps} />);
    expect(wrapper.text()).to.contain('Save');
    wrapper.unmount();
  });

  it('should display in view mode if bankAccount data is complete', () => {
    const props = {
      ...defaultProps,
      formData: {
        bankAccount: {
          accountType: 'Checking',
          routingNumber: '123456789',
          accountNumber: '123456789012',
        },
      },
    };
    const wrapper = shallow(<DirectDepositField {...props} />);
    expect(wrapper.find('DirectDepositViewField').length).to.equal(1);
    expect(wrapper.find('.input-section').length).to.equal(0);
    wrapper.unmount();
  });

  it('should display in view mode with error if bankAccount data is partially complete', () => {
    const props = {
      ...defaultProps,
      formData: {
        bankAccount: {
          accountType: 'Checking',
          routingNumber: '123456789',
          accountNumber: '',
        },
      },
      errorSchema: {
        bankAccount: {
          accountNumber: {
            __errors: ['You must provide a response'],
          },
        },
      },
    };
    const wrapper = mount(<DirectDepositField {...props} />);
    expect(wrapper.text()).to.contain(
      "Banking information is missing or invalid. Please make sure it's correct.",
    );
    wrapper.unmount();
  });
});
