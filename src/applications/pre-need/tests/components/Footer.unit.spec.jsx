import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Footer from '../../components/Footer';
import GetFormHelp from '../../components/GetFormHelp';

describe('Pre-need Footer component', () => {
  const formConfig = {
    formConfig: {
      getHelp: GetFormHelp(),
    },
  };

  const currentLocation = {
    basename:
      '/burials-and-memorials/pre-need/form-10007-apply-for-eligibility',
    pathname: '/introduction',
  };

  it('renders and unmounts without crashing', () => {
    const wrapper = mount(
      <Footer formConfig={formConfig} currentLocation={currentLocation} />,
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });
});
