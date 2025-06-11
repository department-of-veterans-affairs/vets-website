import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { UnknownRep } from '../components/alerts/UnknownRep';

describe('UnknownRep component', () => {
  const defaultProps = {
    DynamicHeader: 'h2',
  };

  it('renders with required props', () => {
    const wrapper = shallow(<UnknownRep {...defaultProps} />);
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('displays the correct error heading', () => {
    const wrapper = mount(<UnknownRep {...defaultProps} />);
    const headerElement = wrapper.find('h2');
    expect(headerElement.exists()).to.be.true;

    // Avoid apostrophe issues by checking for substring
    const headerText = headerElement.text();
    expect(
      headerText.indexOf('check if you have an accredited representative') > -1,
    ).to.be.true;
    wrapper.unmount();
  });

  it('uses the provided DynamicHeader component type', () => {
    const wrapper = mount(<UnknownRep DynamicHeader="h3" />);
    expect(wrapper.find('h3').exists()).to.be.true;
    wrapper.unmount();
  });

  it('renders an error alert', () => {
    const wrapper = shallow(<UnknownRep {...defaultProps} />);
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('error');
    expect(alert.prop('visible')).to.be.true;
    expect(alert.prop('uswds')).to.be.true;
    wrapper.unmount();
  });

  it('displays an apology message', () => {
    const wrapper = mount(<UnknownRep {...defaultProps} />);
    const paragraphs = wrapper.find('p');
    const firstParagraphText = paragraphs.at(0).text();
    expect(firstParagraphText.indexOf('sorry') > -1).to.be.true;
    expect(firstParagraphText.indexOf('system isn') > -1).to.be.true;
    expect(firstParagraphText.indexOf('Try again later') > -1).to.be.true;
    wrapper.unmount();
  });

  it('includes a telephone contact', () => {
    const wrapper = shallow(<UnknownRep {...defaultProps} />);
    const telephone = wrapper.find('va-telephone');
    expect(telephone.exists()).to.be.true;
    expect(telephone.prop('contact')).to.equal(CONTACTS.VA_BENEFITS);
    wrapper.unmount();
  });

  it('provides fallback instructions with phone number', () => {
    const wrapper = mount(<UnknownRep {...defaultProps} />);
    const secondParagraph = wrapper.find('p').at(1);
    const paragraphText = secondParagraph.text();
    expect(paragraphText.indexOf('call us at') > -1).to.be.true;
    expect(paragraphText.indexOf('accredited representative') > -1).to.be.true;
    wrapper.unmount();
  });

  it('applies correct attributes to the heading', () => {
    const wrapper = shallow(<UnknownRep {...defaultProps} />);
    // In shallow rendering, we need to find the DynamicHeader by its component name
    const header = wrapper.find({ slot: 'headline' });
    expect(header.exists()).to.be.true;
    wrapper.unmount();
  });
});
