// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import Banner from './index';
import EmergencyBanner from '@department-of-veterans-affairs/component-library/EmergencyBanner';

describe('<Banner>', () => {
  const defaultProps = {
    content: `<p>For questions about COVID-19 and how it affects VA health care and benefit services, visit our <a href="/coronavirus-veteran-frequently-asked-questions/">coronavirus FAQs</a> or read <a href="https://www.publichealth.va.gov/n-coronavirus/">VA’s public health response</a>.</p>↵↵<p>Please contact us first before going to any <a href="/find-locations">VA location</a>. Contacting us first helps us keep you safe.</p>↵↵<p>For the latest coronavirus information, visit the <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC website</a>.</p>↵`,
    dismissibleStatus: 'perm',
    title: 'Coronavirus',
    type: 'warning',
    visible: 'true',
  };

  it('should render emergency banner', () => {
    const wrapper = shallow(<Banner {...defaultProps} />);
    expect(wrapper.find(EmergencyBanner)).to.not.equal(null);
    wrapper.unmount();
  });
});
