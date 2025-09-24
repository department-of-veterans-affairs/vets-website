import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Footer from '../../components/Footer';

describe('Pre-need Footer component', () => {
  const GetFormHelpMock = () => (
    <div className="mock-get-form-help">Help content</div>
  );

  const baseLocation = {
    basename:
      '/burials-and-memorials/pre-need/form-10007-apply-for-eligibility',
  };

  it('renders FormFooter when getHelp is defined', () => {
    const wrapper = mount(
      <Footer
        formConfig={{ getHelp: GetFormHelpMock }}
        currentLocation={{ ...baseLocation, pathname: '/introduction' }}
      />,
    );

    expect(wrapper.find('.mock-get-form-help')).to.have.lengthOf(1);
    expect(wrapper.find('.help-footer-box')).to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('does not render FormFooter when getHelp is undefined', () => {
    const wrapper = mount(
      <Footer
        formConfig={{}}
        currentLocation={{ ...baseLocation, pathname: '/introduction' }}
      />,
    );

    expect(wrapper.find('.mock-get-form-help')).to.have.lengthOf(0);
    expect(wrapper.find('.help-footer-box')).to.have.lengthOf(0);

    wrapper.unmount();
  });

  it('renders on non-introduction path and still renders FormFooter', () => {
    const wrapper = mount(
      <Footer
        formConfig={{ getHelp: GetFormHelpMock }}
        currentLocation={{ ...baseLocation, pathname: '/confirmation' }}
      />,
    );

    expect(wrapper.find('.mock-get-form-help')).to.have.lengthOf(1);
    expect(wrapper.find('.help-footer-box')).to.have.lengthOf(1);

    wrapper.unmount();
  });
});
