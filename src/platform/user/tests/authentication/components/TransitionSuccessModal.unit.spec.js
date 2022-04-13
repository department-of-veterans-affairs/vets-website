import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import TransitionSuccessModal from '../../../authentication/components/account-transition/TransitionSuccessModal';

describe('', () => {
  let wrapper;
  const props = { visible: false, onClose: sinon.spy() };

  beforeEach(() => {
    wrapper = shallow(<TransitionSuccessModal {...props} />);
  });
  it('should display when `visible` is set to true', () => {
    expect(wrapper.prop('visible')).to.be.false;
    wrapper.setProps({ visible: true });
    expect(wrapper.prop('visible')).to.be.true;
    wrapper.unmount();
  });

  it('should include `Congratulations` in the modal', () => {
    expect(wrapper.find('.container').text()).to.include('Congratulations');
    wrapper.unmount();
  });

  it('should close the modal when primaryButton action is called', () => {
    wrapper = mount(<TransitionSuccessModal {...props} />);
    const mutatedProps = { visible: true, onClose: sinon.spy() };
    wrapper.setProps(mutatedProps);

    wrapper.find('.usa-button').simulate('click');
    expect(wrapper.prop('onClose').calledOnce).to.be.true;
    wrapper.unmount();
  });
});
