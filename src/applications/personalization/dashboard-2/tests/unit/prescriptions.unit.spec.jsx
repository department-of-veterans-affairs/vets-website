import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import { expect } from 'chai';

import Prescriptions from '~/applications/personalization/dashboard-2/components/health-care/Prescriptions';

import {
  prescriptions,
  onePrescription,
  noRefilledPrescriptions,
} from '~/applications/personalization/dashboard-2/utils/prescriptions';

describe('Prescriptions', () => {
  describe('when enrolled in VA health care', () => {
    describe('when there are prescriptions in the process of being refilled', () => {
      let wrapper;
      const props = {
        authenticatedWithSSOe: true,
        prescriptions: prescriptions.data,
      };

      beforeEach(() => {
        wrapper = mount(<Prescriptions {...props} />);
      });

      afterEach(() => {
        wrapper.unmount();
      });

      it('should render all necessary elements', () => {
        expect(wrapper.find('Prescriptions').exists()).to.be.true;

        // Section name
        expect(wrapper.text()).to.contain('Prescription refills');

        // Prescription name
        expect(wrapper.text()).to.contain(
          props.prescriptions[0].attributes.prescriptionName,
        );

        // Status date
        expect(wrapper.text()).to.contain(
          `Status: Submitted on ${moment(
            props.prescriptions[0].attributes?.refillSubmitDate,
          ).format('dddd, MMMM D, YYYY')}`,
        );

        // Notification CTA
        expect(wrapper.find('NotificationCTA').exists()).to.be.true;

        // CTA link
        const ctaLink = wrapper.find('a').first();
        expect(ctaLink.prop('href').endsWith('prescription_refill')).to.be.true;
      });

      it('updates should show the most recent prescription that has a status of Submitted OR Filled within the last 30 days', () => {
        // DOUBLE CHECK THIS ONE
        expect(wrapper.find('Prescriptions').exists()).to.be.true;
      });

      it('“You have [X] prescription updates.” should reflect the total number of prescriptions with a status of submitted or filled', () => {
        expect(wrapper.text()).to.contain('6 prescription refills');
      });
    });

    describe('when there are no prescriptions in the process of being refilled', () => {
      it('should render with the correct copy and design', () => {
        const props = {
          authenticatedWithSSOe: true,
          prescriptions: noRefilledPrescriptions.data,
        };
        const wrapper = mount(<Prescriptions {...props} />);
        expect(wrapper.find('Prescriptions').exists()).to.be.true;
        expect(wrapper.text()).to.contain(
          'You have no prescription refills in progress',
        );
        expect(wrapper.text()).to.contain('Go to prescription updates');
        expect(wrapper.html()).not.to.contain(
          'vads-u-background-color--gray-lightest',
        );
        wrapper.unmount();
      });
    });

    describe('when there is one prescription in the process of being refilled', () => {
      it('should render with the correct copy', () => {
        const props = {
          authenticatedWithSSOe: true,
          prescriptions: onePrescription.data,
        };
        const wrapper = mount(<Prescriptions {...props} />);
        expect(wrapper.text()).to.contain('1 prescription refill');
        wrapper.unmount();
      });
    });
  });
});
