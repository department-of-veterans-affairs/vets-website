import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { LocationType } from '../../../constants';
import CCProviderPhoneLink from '../../../components/search-results-items/common/CCProviderPhoneLink';

describe('CCProviderPhoneLink', () => {
  it('should render a referral message for CCP Providers', () => {
    const ccpLocation = {
      type: LocationType.CC_PROVIDER,
      attributes: { phone: { main: '1234567890' } },
    };

    const ccpQuery = {
      facilityType: LocationType.CC_PROVIDER,
    };

    const wrapper = shallow(
      <CCProviderPhoneLink location={ccpLocation} query={ccpQuery} />,
    );
    expect(wrapper.find('p.referral-message').text()).to.equal(
      'If you don’t have a referral, contact your local VA medical center.',
    );

    wrapper.unmount();
  });
});
