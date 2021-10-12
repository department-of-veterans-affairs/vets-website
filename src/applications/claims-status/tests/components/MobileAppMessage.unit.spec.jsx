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
    const wrapper = shallow(<MobileAppMessage mockUserAgent={'blah'} />);
    expect(wrapper.length).to.equal(1);
    expect(wrapper.props().status).to.equal('info');
    expect(wrapper.text()).to.include(
      'Download it on the App Store or on Google Play.',
    );
    expect(wrapper.find('a[aria-label]').length).to.equal(2);
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

    wrapper.props().onClose();
    expect(wrapper).to.be.empty;
    expect(sessionStorage.getItem(STORAGE_KEY)).to.equal('hidden');
    wrapper.unmount();
  });

  it('should show app store link for iOS device', () => {
    const wrapper = shallow(<MobileAppMessage mockUserAgent={'iPhone'} />);
    const link = wrapper.find('a[aria-label]');
    expect(wrapper.text()).to.include('Download it on the App Store.');
    expect(link.length).to.equal(1);
    expect(link.props()['aria-label']).to.include('app store');
    wrapper.unmount();
  });
  it('should show Google play store link for android device', () => {
    const wrapper = shallow(<MobileAppMessage mockUserAgent={'android'} />);
    const link = wrapper.find('a[aria-label]');
    expect(wrapper.text()).to.include('Download it on Google Play.');
    expect(link.length).to.equal(1);
    expect(link.props()['aria-label']).to.include('Google Play');
    wrapper.unmount();
  });
});
