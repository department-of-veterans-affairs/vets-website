/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import i18next from 'i18next';
import i18n from '../../utils/i18n/i18n';

import PreCheckInAccordionBlock from '../PreCheckInAccordionBlock';

describe('check-in', () => {
  describe('PreCheckInAccordionBlock', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      featureToggles: {
        // eslint-disable-next-line camelcase
        check_in_experience_phone_appointments_enabled: false,
      },
    };
    const store = mockStore(initState);

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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="no"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.exist;
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="no"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
      );
    });
    it('All messages render', () => {
      const screen = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="no"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="yes"
              emergencyContactUpToDate="yes"
              nextOfKinUpToDate="yes"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="yes"
              nextOfKinUpToDate="yes"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="yes"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="no"
              emergencyContactUpToDate="yes"
              nextOfKinUpToDate="no"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="yes"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="yes"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="yes"
              emergencyContactUpToDate="yes"
              nextOfKinUpToDate="no"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <PreCheckInAccordionBlock
              demographicsUpToDate="yes"
              emergencyContactUpToDate="no"
              nextOfKinUpToDate="no"
              appointments={appointments}
            />
          </I18nextProvider>
        </Provider>,
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
    describe('Error page messages render', () => {
      it('In person messages render', () => {
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <PreCheckInAccordionBlock errorPage />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Contact Information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'A staff member will help you on the day of your appointment.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Or you can sign in to your VA account to update your contact information online.',
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
          "During pre-check-in, you can review your personal, emergency contact, and next of kin information and confirm it's up to date. This helps us better prepare for your appointment.",
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can pre-check-in online before midnight of the day of your appointment.',
        );
      });
      it('Phone messages render', () => {
        const initPhoneState = {
          featureToggles: {
            // eslint-disable-next-line camelcase
            check_in_experience_phone_appointments_enabled: true,
          },
        };
        const phoneAppointments = [
          {
            clinicFriendlyName: 'TEST CLINIC',
            clinicName: 'LOM ACC CLINIC TEST',
            clinicPhoneNumber: '5551234567',
            kind: 'phone',
          },
        ];
        const phoneStore = mockStore(initPhoneState);
        const screen = render(
          <Provider store={phoneStore}>
            <I18nextProvider i18n={i18n}>
              <PreCheckInAccordionBlock
                errorPage
                appointments={phoneAppointments}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Contact Information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can sign in to your VA account to update your contact information online.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          "Or you can call 800-698-2411 and select 0. We're here 24/7.",
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Emergency and next of kin information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          "Please call 800-698-2411 and select 0. We're here 24/7.",
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
          "During pre-check-in, you can review your personal, emergency contact, and next of kin information and confirm it's up to date. This helps us better prepare for your appointment.",
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can pre-check-in online before midnight of the day of your appointment.',
        );
      });
    });
    describe('Phone confirmation messages render', () => {
      const initPhoneState = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          check_in_experience_phone_appointments_enabled: true,
        },
      };
      const phoneAppointments = [
        {
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          clinicPhoneNumber: '5551234567',
          kind: 'phone',
        },
      ];
      const phoneStore = mockStore(initPhoneState);
      it('Renders demographics, NOK, and EC messages', () => {
        const screen = render(
          <Provider store={phoneStore}>
            <I18nextProvider i18n={i18n}>
              <PreCheckInAccordionBlock
                demographicsUpToDate="no"
                emergencyContactUpToDate="no"
                nextOfKinUpToDate="no"
                appointments={phoneAppointments}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Contact Information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'You can sign in to your VA account to update your contact information online.',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          "Or you can call 800-698-2411 and select 0. We're here 24/7.",
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          'Emergency and next of kin information',
        );
        expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
          "Please call 800-698-2411 and select 0. We're here 24/7.",
        );
      });
    });
  });
});
