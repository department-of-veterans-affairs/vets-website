import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ACCOUNT_TYPES_OPTIONS } from '../../constants';
import PaymentInformationEditModal from '../../components/PaymentInformationEditModal';

describe('<PaymentInformationEditModal/>', () => {
  const defaultProps = {
    onClose() {},
    onSubmit() {},
    setPaymentInformationUiState() {},
    paymentInformationUiState: {
      isEditing: true,
      isSaving: false,
      editModalFields: {
        financialInstitutionRoutingNumber: {
          field: {
            value: '',
            dirty: false,
          },
        },
        accountNumber: {
          field: {
            value: '',
            dirty: false,
          },
        },
        accountType: {
          value: {
            value: ACCOUNT_TYPES_OPTIONS.checking,
            dirty: false,
          },
        },
      },
    },
  };

  it('renders', () => {
    const wrapper = shallow(<PaymentInformationEditModal {...defaultProps} />);
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });

  it('renders empty when not editing', () => {
    const paymentInformationUiState = {
      ...defaultProps.paymentInformationUiState,
      isEditing: false,
    };
    const props = { ...defaultProps, paymentInformationUiState };
    const wrapper = shallow(<PaymentInformationEditModal {...props} />);

    expect(wrapper.html()).to.be.empty;
    wrapper.unmount();
  });

  it('submits', () => {
    const onSubmit = sinon.spy();
    const paymentInformationUiState = {
      isEditing: true,
      isSaving: false,
      editModalFields: {
        financialInstitutionRoutingNumber: {
          field: {
            value: '123123123',
            dirty: false,
          },
        },
        accountNumber: {
          field: {
            value: '123456',
            dirty: false,
          },
        },
        accountType: {
          value: {
            value: ACCOUNT_TYPES_OPTIONS.checking,
            dirty: false,
          },
        },
      },
    };

    const props = { ...defaultProps, onSubmit, paymentInformationUiState };
    const wrapper = shallow(<PaymentInformationEditModal {...props} />);
    const event = {
      preventDefault() {},
    };

    wrapper.find('form').simulate('submit', event);

    expect(onSubmit.called).to.be.true;

    const submitVal = onSubmit.firstCall.args[0];

    expect(submitVal).to.be.deep.equal({
      financialInstitutionName: 'Hidden form field',
      financialInstitutionRoutingNumber: '123123123',
      accountNumber: '123456',
      accountType: ACCOUNT_TYPES_OPTIONS.checking,
    });

    wrapper.unmount();
  });

  it('does not submit when input is invalid', () => {
    const setPaymentInformationUiState = sinon.spy();
    const onSubmit = sinon.spy();
    const paymentInformationUiState = {
      isEditing: true,
      isSaving: false,
      editModalFields: {
        financialInstitutionRoutingNumber: {
          field: {
            value: 'INVALID',
            dirty: false,
          },
        },
        accountNumber: {
          field: {
            value: '123',
            dirty: false,
          },
        },
        accountType: {
          value: {
            value: ACCOUNT_TYPES_OPTIONS.checking,
            dirty: false,
          },
        },
      },
    };

    const props = {
      ...defaultProps,
      setPaymentInformationUiState,
      onSubmit,
      paymentInformationUiState,
    };
    const wrapper = shallow(<PaymentInformationEditModal {...props} />);
    const event = {
      preventDefault() {},
    };

    wrapper.find('form').simulate('submit', event);

    expect(onSubmit.called).to.be.false;
    expect(setPaymentInformationUiState.called).to.be.true;

    wrapper.unmount();
  });
});
