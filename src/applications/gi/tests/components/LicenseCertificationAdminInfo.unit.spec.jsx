import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LicenseCertificationAdminInfo from '../../components/LicenseCertificationAdminInfo';

describe('<LicenseCertificationAdminInfo/>', () => {
  const defaultProps = {
    institution: {
      name: 'test institution',
      mailingAddress: {
        address1: '123 test street',
        city: 'test city',
        state: 'CA',
        zip: '12345',
      },
    },
    type: 'License',
  };

  it('should render the institution name', () => {
    const wrapper = shallow(
      <LicenseCertificationAdminInfo {...defaultProps} />,
    );
    expect(wrapper.find('.name-wrapper p').text()).to.equal('Test Institution');
    wrapper.unmount();
  });

  it('should render the mailing address for non-certification types', () => {
    const wrapper = shallow(
      <LicenseCertificationAdminInfo {...defaultProps} />,
    );
    const addressBlock = wrapper.find('.va-address-block');
    expect(addressBlock.exists()).to.be.true;
    expect(addressBlock.text()).to.contain('123 Test Street');
    expect(addressBlock.text()).to.contain('Test City, CA 12345');
    wrapper.unmount();
  });

  it('should render certification message instead of address for Certification type', () => {
    const props = {
      ...defaultProps,
      type: 'Certification',
    };
    const wrapper = shallow(<LicenseCertificationAdminInfo {...props} />);
    expect(wrapper.find('.va-address-block').exists()).to.be.false;
    expect(wrapper.text()).to.contain(
      'Certification tests are available to be taken nationally',
    );
    wrapper.unmount();
  });

  it('should render the VA form link', () => {
    const wrapper = shallow(
      <LicenseCertificationAdminInfo {...defaultProps} />,
    );
    const vaLink = wrapper.find('va-link');
    expect(vaLink.exists()).to.be.true;
    expect(vaLink.prop('href')).to.equal(
      'https://www.va.gov/find-forms/about-form-22-0803/',
    );
    wrapper.unmount();
  });

  it('should render the location icon', () => {
    const wrapper = shallow(
      <LicenseCertificationAdminInfo {...defaultProps} />,
    );
    const vaIcon = wrapper.find('va-icon');
    expect(vaIcon.exists()).to.be.true;
    expect(vaIcon.prop('icon')).to.equal('location_city');
    expect(vaIcon.prop('size')).to.equal(3);
    wrapper.unmount();
  });
});
