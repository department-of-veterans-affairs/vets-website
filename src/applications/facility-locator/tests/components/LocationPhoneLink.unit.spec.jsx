import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationPhoneLink from '../../components/search-results/LocationPhoneLink';

describe('LocationPhoneLink', () => {
  it('should render null if bad phone number passed', () => {
    const locationWithBadPhone = {
      attributes: { phone: { main: '123456789' } },
    };

    const wrapper = shallow(
      <LocationPhoneLink location={locationWithBadPhone} />,
    );
    expect(wrapper.html()).to.equal('<div class="facility-phone-group"></div>');
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
    expect(wrapper.find('strong').text()).to.equal('Main Number: ');
    wrapper.unmount();
  });
});
