/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

import PreCheckInAccordionBlock from '../PreCheckInAccordionBlock';

describe('check-in', () => {
  let i18n;
  beforeEach(() => {
    i18n = setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('PreCheckInAccordionBlock', () => {
    afterEach(() => {
      i18n.changeLanguage('en');
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
  });
});
