import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import TravelEligibilityAdditionalInfo from '../TravelEligibilityAdditionalInfo';

describe('Check-in shared components', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('TravelEligibilityAdditionalInfo', () => {
    it('Renders', () => {
      const screen = render(
        <CheckInProvider>
          <TravelEligibilityAdditionalInfo />
        </CheckInProvider>,
      );

      expect(screen.queryByTestId('travel-reimbursement-content')).to.exist;
    });
  });
});
