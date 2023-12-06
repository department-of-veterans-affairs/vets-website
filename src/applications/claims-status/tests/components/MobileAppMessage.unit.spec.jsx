import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MobileAppMessage, {
  STORAGE_KEY,
} from '../../components/MobileAppMessage';

describe('<MobileAppMessage>', () => {
  beforeEach(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  });

  it('should render', () => {
    const wrapper = shallow(<MobileAppMessage mockUserAgent="blah" />);
    expect(wrapper.length).to.equal(1);
    const links = wrapper.find('a[target="_blank"]');
    expect(links.length).to.equal(2);
    expect(links.first().text()).to.eq('Download the app from the App Store');
    expect(links.last().text()).to.eq('Download the app from Google Play');
    wrapper.unmount();
  });
  it('should hide the alert initially', () => {
    sessionStorage.setItem(STORAGE_KEY, 'hidden');
    const wrapper = shallow(<MobileAppMessage />);
    expect(wrapper).to.be.empty;
    wrapper.unmount();
  });
  it('should hide the alert', () => {
    const wrapper = shallow(<MobileAppMessage />);
    expect(wrapper.length).to.equal(1);

    wrapper.props().onCloseEvent();
    expect(wrapper).to.be.empty;
    expect(sessionStorage.getItem(STORAGE_KEY)).to.equal('hidden');
    wrapper.unmount();
  });

  it('should show app store link for iOS device', () => {
    const wrapper = shallow(<MobileAppMessage mockUserAgent="iPhone" />);
    const link = wrapper.find('a[target="_blank"]');
    expect(link.length).to.equal(1);
    expect(link.text()).to.eq('Download the app from the App Store');
    wrapper.unmount();
  });
  it('should show Google play store link for android device', () => {
    const wrapper = shallow(<MobileAppMessage mockUserAgent="android" />);
    const link = wrapper.find('a[target="_blank"]');
    expect(link.length).to.equal(1);
    expect(link.text()).to.eq('Download the app from Google Play');
    wrapper.unmount();
  });
});
