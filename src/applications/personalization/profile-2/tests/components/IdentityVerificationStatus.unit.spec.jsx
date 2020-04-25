import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import IdentityVerificationStatus from '../../components/IdentityVerificationStatus';
import Verified from '../../components/Verified';

describe('IdentityVerificationStatus', () => {
  describe('when `isIdentityVerified` is `true`', () => {
    it('should render a <Verified> component', () => {
      const wrapper = shallow(
        <IdentityVerificationStatus isIdentityVerified />,
      );
      expect(wrapper.type()).to.equal(Verified);
      expect(
        wrapper
          .at(0)
          .dive()
          .text()
          .includes('We’ve verified your identity.'),
      ).to.be.true;
      wrapper.unmount();
    });
  });
  describe('when `isIdentityVerified` is `false`', () => {
    it('should render info about verifying your identity', () => {
      const wrapper = shallow(
        <IdentityVerificationStatus isIdentityVerified={false} />,
      );
      const p = wrapper.find('p').at(0);
      expect(
        p
          .text()
          .includes(
            'We need to make sure you’re you — and not someone pretending to be you — before we can give you access to your personal and health-related information. This helps to keep your information safe, and to prevent fraud and identity theft.',
          ),
      ).to.be.true;
      wrapper.unmount();
    });
    it('should render a link to verify your identity', () => {
      const wrapper = shallow(
        <IdentityVerificationStatus isMultifactorEnabled={false} />,
      );
      const link = wrapper.find('a');
      expect(link.prop('href')).to.equal('/verify?next=/profile');
      expect(link.text().includes('Verify your identity')).to.be.true;
      wrapper.unmount();
    });
  });
});
