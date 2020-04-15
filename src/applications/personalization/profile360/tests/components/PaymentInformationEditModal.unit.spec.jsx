import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import set from 'platform/utilities/data/set';

import { ACCOUNT_TYPES_OPTIONS } from '../../constants';
import PaymentInformationEditModal from '../../components/PaymentInformationEditModal';

describe('<PaymentInformationEditModal/>', () => {
  const defaultProps = {
    isEditing: true,
    isSaving: false,
    onClose() {},
    onSubmit() {},
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

    const props = set('onSubmit', onSubmit, defaultProps);

    const wrapper = mount(<PaymentInformationEditModal {...props} />);
    wrapper.setState({
      formData: {
        accountNumber: '123456',
        routingNumber: '123456789',
        accountType: ACCOUNT_TYPES_OPTIONS.checking,
      },
    });

    wrapper.find('form').simulate('submit');

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

    const props = set('onSubmit', onSubmit, defaultProps);

    const wrapper = mount(<PaymentInformationEditModal {...props} />);
    wrapper.setState({
      formData: {
        accountNumber: 'invalid',
        routingNumber: '123456789',
        accountType: ACCOUNT_TYPES_OPTIONS.checking,
      },
    });

    wrapper.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    wrapper.unmount();
  });

  it('clears its state when the modal opens', () => {
    const props = set('isEditing', false, defaultProps);
    const wrapper = shallow(<PaymentInformationEditModal {...props} />);

    wrapper.setState({
      formData: {
        accountNumber: '123456',
        routingNumber: '123456789',
        accountType: ACCOUNT_TYPES_OPTIONS.checking,
      },
    });
    wrapper.setProps({ isEditing: true });

    const state = wrapper.state();

    expect(state).to.deep.equal({ formData: {} });

    wrapper.unmount();
  });
});
