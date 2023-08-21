/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import i18next from 'i18next';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

import PreCheckInAccordionBlock from '../PreCheckInAccordionBlock';

describe('check-in', () => {
  describe('PreCheckInAccordionBlock', () => {
    afterEach(() => {
      i18next.changeLanguage('en');
    });
    const appointments = [
      {
        clinicFriendlyName: 'TEST CLINIC',
        clinicName: 'LOM ACC CLINIC TEST',
        clinicPhoneNumber: '5551234567',
      },
    ];
    it('Renders', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.exist;
    });
    it('All messages render', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Emergency and next of kin information',
      );
    });
    it('No contact messages render', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Next of kin',
      );
    });
    it('Only contact message renders', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Next of kin',
      );
    });
    it('Only contact and emergency contact message renders', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Next of kin',
      );
    });
    it('Only contact and next of kin message renders', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Next of kin',
      );
    });
    it('Only emergency contact message renders', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Next of kin',
      );
    });
    it('Only next of kin message renders', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Next of kin',
      );
    });
    it('Only emergency contact and next of kin messages render', () => {
      const screen = render(
        <CheckInProvider>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Emergency and next of kin information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Emergency information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Next of kin',
      );
    });
    describe('Clinic phone number rendering', () => {
      const noPhoneAppointments = [
        {
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
        },
      ];
      it('Displays questions message', () => {
        const screen = render(
          <CheckInProvider>
            <PreCheckInAccordionBlock
              demographicsUpToDate="yes"
              emergencyContactUpToDate="yes"
              nextOfKinUpToDate="yes"
              appointments={appointments}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Call your VA health care team:',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'TEST CLINIC at ',
        );
      });
      it('Does not display questions message', () => {
        const screen = render(
          <CheckInProvider>
            <PreCheckInAccordionBlock
              demographicsUpToDate="yes"
              emergencyContactUpToDate="yes"
              nextOfKinUpToDate="yes"
              appointments={noPhoneAppointments}
            />
          </CheckInProvider>,
        );
        expect(
          screen.getByTestId('pre-check-in-accordions'),
        ).to.not.contain.text('Call your VA health care team:');
        expect(
          screen.getByTestId('pre-check-in-accordions'),
        ).to.not.contain.text('TEST CLINIC at ');
      });
    });

    describe('Error page messages render', () => {
      it('In person messages render', () => {
        const screen = render(
          <CheckInProvider>
            <PreCheckInAccordionBlock errorPage />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Contact Information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'A staff member will help you on the day of your appointment.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Or you can sign in to your VA.gov profile to update your contact information online.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Emergency and next of kin information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'A staff member will help you on the day of your appointment.',
        );
        // Confirmation accordions are not present.
        expect(
          screen.getByTestId('pre-check-in-accordions'),
        ).to.not.contain.text(
          'We can better prepare for your appointment and contact you more easily.',
        );
        expect(
          screen.getByTestId('pre-check-in-accordions'),
        ).to.not.contain.text('Call your VA health care team:');
        // Error accordions are present.
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'During pre-check-in, you can review your personal, emergency contact, and next of kin information and confirm it’s up to date. This helps us better prepare for your appointment.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can pre-check-in online before midnight of the day of your appointment.',
        );
      });
      it('Phone messages render', () => {
        const phoneAppointments = [
          {
            clinicFriendlyName: 'TEST CLINIC',
            clinicName: 'LOM ACC CLINIC TEST',
            clinicPhoneNumber: '5551234567',
            kind: 'phone',
          },
        ];
        const screen = render(
          <CheckInProvider>
            <PreCheckInAccordionBlock
              errorPage
              appointments={phoneAppointments}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Contact Information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can sign in to your VA.gov profile to update your contact information online.',
        );
        expect(screen.getByTestId('or-you-can-call')).to.exist;
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Emergency and next of kin information',
        );
        expect(screen.getByTestId('please-call')).to.exist;
        // Confirmation accordions are not present.
        expect(
          screen.getByTestId('pre-check-in-accordions'),
        ).to.not.contain.text(
          'We can better prepare for your appointment and contact you more easily.',
        );
        expect(
          screen.getByTestId('pre-check-in-accordions'),
        ).to.not.contain.text('Call your VA health care team:');
        // Error accordions are present.
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'During pre-check-in, you can review your personal, emergency contact, and next of kin information and confirm it’s up to date. This helps us better prepare for your appointment.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can pre-check-in online before midnight of the day of your appointment.',
        );
      });
    });
    describe('Phone confirmation messages render', () => {
      const phoneAppointments = [
        {
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          clinicPhoneNumber: '5551234567',
          kind: 'phone',
        },
      ];
      it('Renders demographics, NOK, and EC messages', () => {
        const screen = render(
          <CheckInProvider>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="no"
              appointments={phoneAppointments}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Contact Information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can sign in to your VA.gov profile to update your contact information online.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Emergency and next of kin information',
        );
        expect(screen.getByTestId('or-you-can-call')).to.exist;
        expect(screen.getByTestId('please-call')).to.exist;
      });
    });
  });
});
