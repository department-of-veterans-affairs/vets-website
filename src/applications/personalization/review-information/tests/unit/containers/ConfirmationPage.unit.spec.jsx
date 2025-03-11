/* eslint-disable @department-of-veterans-affairs/enzyme-unmount */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cleanup } from '@testing-library/react';
import ConfirmationPage from '../../../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ConfirmationPage />);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    cleanup();
  });

  it('renders as expected', () => {
    expect(wrapper.exists()).to.be.true;
  });

  it('contains the correct alert content', () => {
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('success');
    expect(alert.find('h2').text()).to.equal(
      'Contact information added to your profile',
    );
  });

  it('contains the correct informational messages', () => {
    const alert = wrapper.find('va-alert');
    const paragraphs = alert.find('p');
    expect(paragraphs).to.have.lengthOf(2);
    expect(paragraphs.at(0).text()).to.include('If you apply for VA benefits');
    expect(paragraphs.at(1).text()).to.include(
      'You can change your email and text notification settings',
    );
  });

  it('renders "Go to your notification settings" link correctly', () => {
    const notificationLink = wrapper.find('va-link-action').at(0);
    expect(notificationLink.exists()).to.be.true;
    expect(notificationLink.prop('href')).to.equal('/profile/notifications/');
    expect(notificationLink.prop('text')).to.equal(
      'Go to your notification settings in your VA.gov profile',
    );
  });

  it('renders "Go back to My VA" link correctly', () => {
    const myVaLink = wrapper.find('va-link-action').at(1);
    expect(myVaLink.exists()).to.be.true;
    expect(myVaLink.prop('href')).to.equal('/my-va/');
    expect(myVaLink.prop('text')).to.equal('Go back to My VA');
  });

  it('renders "Go back to your profile" link correctly', () => {
    const profileLink = wrapper.find('va-link-action').at(2);
    expect(profileLink.exists()).to.be.true;
    expect(profileLink.prop('href')).to.equal('/profile/');
    expect(profileLink.prop('text')).to.equal('Go back to your profile');
  });
});
