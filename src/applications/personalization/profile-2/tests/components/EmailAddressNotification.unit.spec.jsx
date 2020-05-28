import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EmailAddressNotification from '../../components/EmailAddressNotification';

describe('EmailAddressNotification', () => {
  describe('when `signInServiceName` is `dslogon`', () => {
    const wrapper = shallow(
      <EmailAddressNotification signInServiceName="dslogon" />,
    );

    const anchor = wrapper.find('a');

    it('should render the correct button text', () => {
      expect(anchor.text().includes('DS Logon')).to.be.true;
    });
    it('should render the correct link url', () => {
      expect(anchor.props().href).to.equal(
        'https://myaccess.dmdc.osd.mil/identitymanagement',
      );
    });
    wrapper.unmount();
  });

  describe('when `signInServiceName` is `idme`', () => {
    const wrapper = shallow(
      <EmailAddressNotification signInServiceName="idme" />,
    );

    const anchor = wrapper.find('a');

    it('should render the correct button text', () => {
      expect(anchor.text().includes('ID.me')).to.be.true;
    });
    it('should render the correct link url', () => {
      expect(anchor.props().href).to.equal('https://wallet.id.me/settings');
    });
    wrapper.unmount();
  });

  describe('when `signInServiceName` is `mhv`', () => {
    const wrapper = shallow(
      <EmailAddressNotification signInServiceName="mhv" />,
    );

    const anchor = wrapper.find('a');

    it('should render the correct button text', () => {
      expect(anchor.text().includes('My HealtheVet')).to.be.true;
    });
    it('should render the correct link url', () => {
      expect(anchor.props().href).to.equal('https://www.myhealth.va.gov');
    });
    wrapper.unmount();
  });
});
