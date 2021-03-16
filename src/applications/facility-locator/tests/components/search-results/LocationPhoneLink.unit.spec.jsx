import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationPhoneLink from '../../../components/search-results-items/common/LocationPhoneLink';
import { LocationType } from '../../../constants';

describe('LocationPhoneLink', () => {
  it('should render null if bad phone number passed', () => {
    const locationWithBadPhone = {
      attributes: { phone: { main: '123456789' } },
    };

    const wrapper = shallow(
      <LocationPhoneLink location={locationWithBadPhone} />,
    );
    expect(wrapper.html()).to.equal(
      '<div class="facility-phone-group vads-u-margin-top--2"></div>',
    );
    wrapper.unmount();
  });

  it('should render correctly given a proper phone', () => {
    const locationWithGoodPhone = {
      attributes: { phone: { main: '1234567890' } },
    };

    const wrapper = shallow(
      <LocationPhoneLink location={locationWithGoodPhone} />,
    );
    expect(wrapper.find('Telephone').length).to.equal(1);
    expect(wrapper.find('strong').text()).to.equal('Main number: ');
    wrapper.unmount();
  });

  it('should render a referral message for CCP providers', () => {
    const ccpLocation = {
      type: LocationType.CC_PROVIDER,
      attributes: { phone: { main: '1234567890' } },
    };

    const ccpQuery = {
      facilityType: LocationType.CC_PROVIDER,
    };

    const wrapper = shallow(
      <LocationPhoneLink location={ccpLocation} query={ccpQuery} />,
    );
    expect(wrapper.find('#referral-message').text()).to.equal(
      'If you don’t have a referral, contact your local VA medical center.',
    );

    wrapper.unmount();
  });
});
