import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App, STORAGE_KEY } from '.';

describe('<App>', () => {
  beforeEach(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  });

  it('should render', () => {
    const wrapper = shallow(<App mockUserAgent="blah" />);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.props().status).to.equal('info');
    const links = wrapper.find('a[target="_blank"]');
    expect(links.length).to.equal(2);
    expect(links.first().text()).to.eq(
      'Get the VA: Health and Benefits app from the Apple App Store',
    );
    expect(links.last().text()).to.eq(
      'Get the VA: Health and Benefits app from the Google Play store',
    );
    wrapper.unmount();
  });
  it('should hide the alert initially', () => {
    sessionStorage.setItem(STORAGE_KEY, 'hidden');
    const wrapper = shallow(<App />);
    expect(wrapper).to.be.empty;
    wrapper.unmount();
  });
  it('should hide the alert', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.length).to.equal(1);

    wrapper.props().onClose();
    expect(wrapper).to.be.empty;
    expect(sessionStorage.getItem(STORAGE_KEY)).to.equal('hidden');
    wrapper.unmount();
  });

  it('should show app store link for iOS device', () => {
    const wrapper = shallow(<App mockUserAgent="iPhone" />);
    const link = wrapper.find('a[target="_blank"]');
    expect(link.length).to.equal(1);
    expect(link.text()).to.eq(
      'Get the VA: Health and Benefits app from the Apple App Store',
    );
    wrapper.unmount();
  });
  it('should show Google play store link for android device', () => {
    const wrapper = shallow(<App mockUserAgent="android" />);
    const link = wrapper.find('a[target="_blank"]');
    expect(link.length).to.equal(1);
    expect(link.text()).to.eq(
      'Get the VA: Health and Benefits app from the Google Play store',
    );
    wrapper.unmount();
  });
});
