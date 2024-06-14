import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';

import { setupI18n, teardownI18n } from '../../../../utils/i18n/i18n';
import CheckIn from '../index';
import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';

describe('check-in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('CheckIn component', () => {
    it('refresh appointments button exists', () => {
      const screen = render(
        <CheckInProvider>
          <CheckIn
            appointments={[
              {
                clinicPhone: '555-867-5309',
                startTime: '2021-07-19T13:56:31',
                facilityName: 'Acme VA',
                clinicName: 'Green Team Clinic1',
              },
            ]}
          />
        </CheckInProvider>,
      );

      expect(screen.queryByTestId('refresh-appointments-button')).to.exist;
    });
    it('displays a loading component if there is no appointment', () => {
      const screen = render(
        <CheckInProvider
          store={{
            appointments: [],
          }}
        >
          <CheckIn appointments={[]} />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('loading-indicator')).to.exist;
    });
  });
});
