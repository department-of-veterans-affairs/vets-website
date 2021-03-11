import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { HealthCare } from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';

describe('HealthCare', () => {
  describe('Prescriptions', () => {
    const defaultProps = {
      authenticatedWithSSOe: true,
      prescriptions: {
        data: null,
      },
      canAccessRx: false,
      loadPrescriptions: () => {},
    };

    it('when enrolled in VA health care, should not render when they have never had any prescriptions managed by the VA', () => {
      const wrapper = mount(<HealthCare {...defaultProps} />);
      expect(wrapper.find('Prescriptions').exists()).to.be.false;
      wrapper.unmount();
    });
  });
});
