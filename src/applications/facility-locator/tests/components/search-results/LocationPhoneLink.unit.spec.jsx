import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LocationPhoneLink from '../../../components/search-results-items/common/LocationPhoneLink';

describe('LocationPhoneLink', () => {
  it('should render null if bad phone number passed', () => {
    const locationWithBadPhone = {
      attributes: { phone: { main: '123456789' } },
    };

    const wrapper = shallow(
      <LocationPhoneLink location={locationWithBadPhone} />,
    );
    expect(wrapper.html()).to.equal(
      '<div class="facility-phone-group"><p><strong>Telecommunications Relay Services (using TTY):</strong> <va-telephone tty="true" contact="711"></va-telephone></p></div>',
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
    expect(wrapper.find('va-telephone').length).to.equal(2);
    expect(
      wrapper
        .find('strong')
        .at(0)
        .text(),
    ).to.equal('Main phone: ');
    expect(
      wrapper
        .find('strong')
        .at(1)
        .text(),
    ).to.equal('Telecommunications Relay Services (using TTY):');
    wrapper.unmount();
  });
});
