import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import {
  PreparerDetailsTitle,
  ContactDetailsTitle,
  PreparerDescription,
  ValidateAddressTitle,
} from '../../components/PreparerHelpers';

describe('Pre-need PreparerHelpers components', () => {
  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<PreparerDetailsTitle />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<ContactDetailsTitle />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<ValidateAddressTitle />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('renders and unmounts without crashing', () => {
    const wrapper = mount(<PreparerDescription />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });
});
