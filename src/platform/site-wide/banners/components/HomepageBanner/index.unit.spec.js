// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import HomepageBanner from './index';

describe('<HomepageBanner>', () => {
  const defaultProps = {
    content: `<p>For questions about COVID-19 and how it affects VA health care and benefit services, visit our <a href="/coronavirus-veteran-frequently-asked-questions/">coronavirus FAQs</a> or read <a href="https://www.publichealth.va.gov/n-coronavirus/">VA’s public health response</a>.</p>↵↵<p>Please contact us first before going to any <a href="/find-locations">VA location</a>. Contacting us first helps us keep you safe.</p>↵↵<p>For the latest coronavirus information, visit the <a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC website</a>.</p>↵`,
    title: 'Coronavirus',
    type: 'warning',
    visible: true,
  };

  it('should render homepage banner', () => {
    const wrapper = shallow(<HomepageBanner {...defaultProps} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should not render when invisible', () => {
    const wrapper = shallow(
      <HomepageBanner {...defaultProps} visible={false} />,
    );
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });
});
