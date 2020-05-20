import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TwoFactorAuthorizationStatus from '../../components/TwoFactorAuthorizationStatus';
import Verified from '../../components/Verified';

describe('TwoFactorAuthorizationStatus', () => {
  describe('when `isMultifactorEnabled` is `true`', () => {
    it('should render a <Verified> component', () => {
      const wrapper = shallow(
        <TwoFactorAuthorizationStatus isMultifactorEnabled />,
      );
      expect(wrapper.type()).to.equal(Verified);
      expect(
        wrapper
          .at(0)
          .dive()
          .text()
          .includes(
            'You’ve added an extra layer of security to your account with 2-factor authentication.',
          ),
      ).to.be.true;
      wrapper.unmount();
    });
  });
  describe('when `isMultifactorEnabled` is `false`', () => {
    it('should render info about setting up 2FA', () => {
      const wrapper = shallow(
        <TwoFactorAuthorizationStatus isMultifactorEnabled={false} />,
      );
      const p = wrapper.find('p').at(0);
      expect(
        p
          .text()
          .includes(
            'Add an extra layer of security (called 2-factor authentication). This helps to make sure only you can access your account - even if someone gets your password.',
          ),
      ).to.be.true;
      wrapper.unmount();
    });
    it('should render a link to set up 2FA', () => {
      const wrapper = shallow(
        <TwoFactorAuthorizationStatus isMultifactorEnabled={false} />,
      );
      const link = wrapper.find('button.va-button-link');
      expect(link.text().includes('Set up 2-factor authentication')).to.be.true;
      wrapper.unmount();
    });
  });
});
