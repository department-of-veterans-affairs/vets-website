/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import i18n from '../../utils/i18n/i18n';

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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </I18nextProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.exist;
    });
    it('passes axeCheck', () => {
      axeCheck(
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </I18nextProvider>,
      );
    });
    it('All messages render', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="no"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="yes"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="yes"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </I18nextProvider>,
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
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock
            demographicsUpToDate="yes"
            emergencyContactUpToDate="no"
            nextOfKinUpToDate="no"
            appointments={appointments}
          />
        </I18nextProvider>,
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
    it('Error page messages render', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <PreCheckInAccordionBlock errorPage />
        </I18nextProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Emergency and next of kin information',
      );
      // Confirmation accordions are not present.
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'We can better prepare for your appointment and contact you more easily.',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.not.contain.text(
        'Call your VA health care team:',
      );
      // Error accordions are present.
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        "During pre-check-in, you can review your personal, emergency contact, and next of kin information and confirm it's up to date. This helps us better prepare for your appointment.",
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'You can pre-check-in online before midnight of the day of your appointment.',
      );
    });
  });
});
