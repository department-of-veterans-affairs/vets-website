import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import TransitionModal from 'platform/user/authentication/components/account-transition/TransitionModal';

describe('TransitionModal', () => {
  const props = {
    visible: false,
    onClose: sinon.spy(),
  };

  it('should display when `visible` is set to true', () => {
    const wrapper = mount(<TransitionModal {...props} />);
    expect(wrapper.prop('visible')).to.be.false;
    wrapper.props().visible = true;
    expect(wrapper.prop('visible')).to.be.true;
    wrapper.unmount();
  });

  it('should include `Prepare for sign in changes at VA` in the modal', () => {
    const wrapper = mount(<TransitionModal {...props} />);
    expect(wrapper.find('Modal').props().title).to.include(
      'Prepare for sign in changes at VA',
    );
    wrapper.unmount();
  });

  it('should forward as a primary action', () => {
    const wrapper = shallow(<TransitionModal {...props} />);
    wrapper.prop('primaryButton').action();
    expect(window.location).equal('/transfer-account');
    wrapper.unmount();
  });

  it('should close as a secondary action', () => {
    const wrapper = shallow(<TransitionModal {...props} />);
    wrapper.prop('secondaryButton').action();
    expect(wrapper.prop('onClose').calledOnce).to.be.true;
    wrapper.unmount();
  });
});
