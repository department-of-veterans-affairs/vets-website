// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import Banners from './index';
import HomepageBanner from '../HomepageBanner';
import MaintenanceBanner from '../MaintenanceBanner';

describe('<Banners>', () => {
  const defaultProps = {
    homepageBannerContent: `<p>For questions about COVID-19 and how it affects VA health care and benefit services, visit our <a href="/coronavirus-veteran-frequently-asked-questions/">coronavirus FAQs</a> or read <a href="https://www.publichealth.va.gov/n-coronavirus/">VA’s public health response</a>.</p>↵↵<p>Please contact us first before going to any <a href="/find-locations">VA location</a>. Contacting us first helps us keep you safe.</p>↵↵<p>For the latest coronavirus information, visit the <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC website</a>.</p>↵`,
    homepageBannerTitle: 'Coronavirus',
    homepageBannerType: 'warning',
    homepageBannerVisible: 'true',
  };

  it('should render homepage banner', () => {
    const wrapper = shallow(<Banners {...defaultProps} />);
    expect(wrapper.find(HomepageBanner)).to.not.equal(null);
    wrapper.unmount();
  });

  it('should render maintenance banner', () => {
    const wrapper = shallow(<Banners {...defaultProps} />);
    expect(wrapper.find(MaintenanceBanner)).to.not.equal(null);
    wrapper.unmount();
  });
});
