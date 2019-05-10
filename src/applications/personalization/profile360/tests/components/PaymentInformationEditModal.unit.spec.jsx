import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import set from 'platform/utilities/data/set';

import { ACCOUNT_TYPES_OPTIONS } from '../../constants';
import PaymentInformationEditModal from '../../components/PaymentInformationEditModal';

describe('<PaymentInformationEditModal/>', () => {
  const defaultProps = {
    fields: {
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
    isEditing: true,
    isSaving: false,
    onClose() {},
    onSubmit() {},
    editModalFieldChanged() {},
    responseError: null,
  };

  it('renders', () => {
    const wrapper = shallow(<PaymentInformationEditModal {...defaultProps} />);
    expect(wrapper.html()).to.not.be.empty;
    wrapper.unmount();
  });

  it('renders empty when not editing', () => {
    const props = set('isEditing', false, defaultProps);
    const wrapper = shallow(<PaymentInformationEditModal {...props} />);
    expect(wrapper.html()).to.be.empty;
    wrapper.unmount();
  });

  it('submits', () => {
    const onSubmit = sinon.spy();

    let props = set('fields.accountNumber.field.value', '123456', defaultProps);
    props = set(
      'fields.financialInstitutionRoutingNumber.field.value',
      '123456789',
      props,
    );
    props = set('onSubmit', onSubmit, props);

    const wrapper = shallow(<PaymentInformationEditModal {...props} />);
    const event = {
      preventDefault() {},
    };

    wrapper.find('form').simulate('submit', event);

    expect(onSubmit.called).to.be.true;

    const submitVal = onSubmit.firstCall.args[0];

    expect(submitVal).to.be.deep.equal({
      financialInstitutionName: 'Hidden form field',
      financialInstitutionRoutingNumber: '123456789',
      accountNumber: '123456',
      accountType: ACCOUNT_TYPES_OPTIONS.checking,
    });

    wrapper.unmount();
  });

  it('does not submit when input is invalid', () => {
    const onSubmit = sinon.spy();

    let props = set(
      'fields.accountNumber.field.value',
      'INVALID',
      defaultProps,
    );
    props = set('onSubmit', onSubmit, props);

    const wrapper = shallow(<PaymentInformationEditModal {...props} />);
    const event = {
      preventDefault() {},
    };

    wrapper.find('form').simulate('submit', event);
    expect(onSubmit.called).to.be.false;
    wrapper.unmount();
  });
});
