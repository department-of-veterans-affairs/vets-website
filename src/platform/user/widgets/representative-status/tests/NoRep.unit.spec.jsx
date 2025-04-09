import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { NoRep } from '../components/cards/NoRep';

describe('NoRep component', () => {
  const defaultProps = {
    DynamicHeader: 'h2',
  };

  it('renders with required props', () => {
    const wrapper = shallow(<NoRep {...defaultProps} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('displays the correct heading', () => {
    const wrapper = mount(<NoRep {...defaultProps} />);
    const headerElement = wrapper.find('.auth-no-rep-header');
    expect(headerElement.exists()).to.be.true;

    // Use a more flexible check to avoid apostrophe encoding issues
    const headerText = headerElement.text();
    expect(headerText.indexOf('have an accredited representative') > -1).to.be
      .true;
    wrapper.unmount();
  });

  it('renders the correct heading level', () => {
    const wrapper = mount(<NoRep DynamicHeader="h3" />);
    expect(wrapper.find('h3.auth-no-rep-header').exists()).to.be.true;
    wrapper.unmount();
  });

  it('includes an icon in the header', () => {
    const wrapper = mount(<NoRep {...defaultProps} />);
    const icon = wrapper.find('va-icon[icon="account_circle"]');
    expect(icon.exists()).to.be.true;
    expect(icon.prop('size')).to.equal(4);
    expect(icon.prop('srtext')).to.equal('Your representative');
    wrapper.unmount();
  });

  it('includes a link to learn about accredited representatives', () => {
    const wrapper = mount(<NoRep {...defaultProps} />);
    const link = wrapper.find('va-link');

    expect(link.exists()).to.be.true;
    expect(link.prop('href')).to.equal(
      'https://www.va.gov/resources/va-accredited-representative-faqs/',
    );
    expect(link.prop('text')).to.equal(
      'Learn about accredited representatives',
    );
    wrapper.unmount();
  });

  it('has the correct class structure', () => {
    const wrapper = mount(<NoRep {...defaultProps} />);

    expect(wrapper.find('.auth-card').exists()).to.be.true;
    expect(wrapper.find('.auth-header-icon').exists()).to.be.true;
    expect(wrapper.find('.auth-no-rep-text').exists()).to.be.true;
    expect(wrapper.find('.auth-no-rep-body').exists()).to.be.true;

    wrapper.unmount();
  });
});
