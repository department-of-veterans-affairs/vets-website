import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { CurrentRep } from '../components/cards/CurrentRep';

describe('CurrentRep component', () => {
  const defaultProps = {
    DynamicHeader: 'h2',
    DynamicSubheader: 'h3',
    poaType: 'representative',
    name: 'John Doe',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 456',
    city: 'Springfield',
    stateCode: 'IL',
    zipCode: '12345',
    email: 'johndoe@example.com',
    contact: '555-123-4567',
    extension: '123',
    concatAddress: '123 Main St Suite 456 Springfield, IL 12345',
    vcfUrl: 'https://example.com/download-vcf',
  };

  it('renders with all required props', () => {
    const wrapper = shallow(<CurrentRep {...defaultProps} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('displays the representative name', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    expect(wrapper.find('h3').text()).to.equal('John Doe');
    wrapper.unmount();
  });

  it('shows correct title for individual representative', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    // Without knowing exactly what representativeTypeMap returns, we can just check for "Your current"
    expect(wrapper.find('h2').text()).to.include('Your current');
    wrapper.unmount();
  });

  it('shows correct title for organization', () => {
    const orgProps = { ...defaultProps, poaType: 'organization' };
    const wrapper = mount(<CurrentRep {...orgProps} />);
    expect(wrapper.find('h2').text()).to.include(
      'Veteran Service Organization',
    );
    wrapper.unmount();
  });

  it('displays the organization note when poaType is organization', () => {
    const orgProps = { ...defaultProps, poaType: 'organization' };
    const wrapper = mount(<CurrentRep {...orgProps} />);
    expect(wrapper.text()).to.include(
      'You can work with any accredited VSO representative at this organization',
    );
    wrapper.unmount();
  });

  it('does not display organization note when poaType is representative', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    expect(wrapper.text()).to.not.include(
      'You can work with any accredited VSO representative at this organization',
    );
    wrapper.unmount();
  });

  it('renders address when concatAddress is provided', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    expect(wrapper.find('.address-link a').prop('href')).to.equal(
      'https://maps.google.com?daddr=123 Main St Suite 456 Springfield, IL 12345',
    );
    expect(wrapper.text()).to.include('123 Main St');
    expect(wrapper.text()).to.include('Suite 456');
    expect(wrapper.text()).to.include('Springfield, IL 12345');
    wrapper.unmount();
  });

  it('does not render address when concatAddress is missing', () => {
    const propsWithoutAddress = { ...defaultProps, concatAddress: null };
    const wrapper = mount(<CurrentRep {...propsWithoutAddress} />);
    expect(wrapper.find('.address-link')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('renders email for individual representative when email is provided', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    expect(
      wrapper.find('a[href="mailto:johndoe@example.com"]').text(),
    ).to.equal('johndoe@example.com');
    wrapper.unmount();
  });

  it('does not render email for organization', () => {
    const orgProps = {
      ...defaultProps,
      poaType: 'organization',
      email: 'org@example.com',
    };
    const wrapper = mount(<CurrentRep {...orgProps} />);
    expect(wrapper.find('a[href="mailto:org@example.com"]')).to.have.lengthOf(
      0,
    );
    wrapper.unmount();
  });

  it('renders phone number when contact is provided', () => {
    const wrapper = shallow(<CurrentRep {...defaultProps} />);
    const telephone = wrapper.find('va-telephone');
    expect(telephone.prop('contact')).to.equal('555-123-4567');
    expect(telephone.prop('extension')).to.equal('123');
    wrapper.unmount();
  });

  it('renders VCF download link for individual representative', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    const downloadLink = wrapper.find(
      'va-link[text="Download your accredited representative\'s contact information"]',
    );
    expect(downloadLink.exists()).to.be.true;
    expect(downloadLink.prop('href')).to.equal(
      'https://example.com/download-vcf',
    );
    wrapper.unmount();
  });

  it('includes a link to learn about accredited representatives', () => {
    const wrapper = mount(<CurrentRep {...defaultProps} />);
    const learnMoreLink = wrapper.find(
      'va-link[text="Learn about accredited representatives"]',
    );
    expect(learnMoreLink.exists()).to.be.true;
    expect(learnMoreLink.prop('href')).to.contain(
      '/resources/va-accredited-representative-faqs/',
    );
    wrapper.unmount();
  });
});
