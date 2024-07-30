import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { setupI18n, teardownI18n } from '../../../../utils/i18n/i18n';
import AppointmentResources from '../index';
import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';

describe('pre-check-in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Appointment resources page', () => {
    it('renders the page', () => {
      const component = render(
        <CheckInProvider>
          <AppointmentResources />
        </CheckInProvider>,
      );

      expect(component.getByTestId('resouces-page')).to.exist;
    });
  });
});
