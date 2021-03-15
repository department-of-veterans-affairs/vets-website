import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { HealthCare } from '~/applications/personalization/dashboard-2/components/health-care/HealthCare';

describe('HealthCare', () => {
  const defaultProps = {
    appointments: [],
    authenticatedWithSSOe: true,
    canAccessRx: false,
    canAccessMessaging: true,
    fetchFolder: () => {},
    fetchConfirmedFutureAppointments: () => {},
  };

  describe('Prescriptions', () => {
    it('when enrolled in VA health care, should not render when they have never had any prescriptions managed by the VA', () => {
      const wrapper = mount(<HealthCare {...defaultProps} />);
      expect(wrapper.find('Prescriptions').exists()).to.be.false;
      wrapper.unmount();
    });
  });

  describe('Messaging', () => {
    describe('when eligible for messaging', () => {
      it('should render the unread messages count', () => {
        defaultProps.unreadMessagesCount = 3;
        const wrapper = mount(<HealthCare {...defaultProps} />);
        expect(wrapper.text()).to.contain('You have 3 new messages');
        wrapper.unmount();
      });

      it('should render "View all new messages"', () => {
        const wrapper = mount(<HealthCare {...defaultProps} />);
        expect(wrapper.text()).to.contain('View your new messages');
        wrapper.unmount();
      });
    });

    describe('when not eligible for messaging', () => {
      it('should not render', () => {
        defaultProps.canAccessMessaging = false;
        const wrapper = mount(<HealthCare {...defaultProps} />);
        expect(wrapper.text()).to.not.contain('Messages');
        wrapper.unmount();
      });
    });
  });
});
