import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { Unauth } from '../components/alerts/Unauth';

describe('Unauth component', () => {
  const defaultProps = {
    toggleLoginModal: () => {},
    DynamicHeader: 'h2',
  };

  it('renders with required props', () => {
    const wrapper = shallow(<Unauth {...defaultProps} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('displays the correct heading', () => {
    const wrapper = mount(<Unauth {...defaultProps} />);
    const headerElement = wrapper.find('#track-your-status-on-mobile');
    expect(headerElement.exists()).to.be.true;
    expect(headerElement.text()).to.include('Sign in with a verified account');
    wrapper.unmount();
  });

  it('uses the provided DynamicHeader component type', () => {
    const wrapper = mount(<Unauth {...defaultProps} DynamicHeader="h3" />);
    expect(wrapper.find('h3#track-your-status-on-mobile').exists()).to.be.true;
    wrapper.unmount();
  });

  it('renders an info alert', () => {
    const wrapper = shallow(<Unauth {...defaultProps} />);
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('info');
    expect(alert.prop('visible')).to.be.true;
    wrapper.unmount();
  });

  it('includes a sign in button', () => {
    const wrapper = shallow(<Unauth {...defaultProps} />);
    const button = wrapper.find('va-button');
    expect(button.exists()).to.be.true;
    expect(button.prop('text')).to.equal('Sign in or create an account');
    expect(button.prop('uswds')).to.be.true;
    wrapper.unmount();
  });

  it('calls toggleLoginModal with true when button is clicked', () => {
    const toggleLoginModalSpy = sinon.spy();
    const wrapper = shallow(
      <Unauth {...defaultProps} toggleLoginModal={toggleLoginModalSpy} />,
    );

    const button = wrapper.find('va-button');
    button.simulate('click');

    expect(toggleLoginModalSpy.calledOnce).to.be.true;
    expect(toggleLoginModalSpy.calledWith(true)).to.be.true;
    wrapper.unmount();
  });
});
