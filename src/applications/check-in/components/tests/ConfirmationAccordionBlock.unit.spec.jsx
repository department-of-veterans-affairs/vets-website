/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

import ConfirmationAccordionBlock from '../ConfirmationAccordionBlock';

describe('check-in', () => {
  let i18n;
  beforeEach(() => {
    i18n = setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('ConfirmationAccordionBlock', () => {
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
          <ConfirmationAccordionBlock appointments={appointments} />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.exist;
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Contact Information',
      );
      expect(screen.getByTestId('pre-check-in-accordions')).to.contain.text(
        'Emergency and next of kin information',
      );
    });
    describe('Clinic phone number rendering', () => {
      const noPhoneNumber = [
        {
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
        },
      ];
      it('Displays questions message', () => {
        const screen = render(
          <CheckInProvider>
            <ConfirmationAccordionBlock appointments={appointments} />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('call-for-questions-accordion')).to.exist;
      });
      it('Does not display questions message', () => {
        const screen = render(
          <CheckInProvider>
            <ConfirmationAccordionBlock appointments={noPhoneNumber} />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('call-for-questions-accordion')).to.not
          .exist;
      });
    });
  });
});
