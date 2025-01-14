import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../../../../tests/mocks/setup';

import TestComponent from './TestComponent';

describe('Community Care Referrals', () => {
  describe('useIsInCCPilot hook', () => {
    it('Returns true when the user has a facility within the pilot list', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '983' }],
          },
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByTestId('pilot-value')).to.have.text('true');
    });
    it('Returns true when the user has a facility within the pilot list as well as some outside', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '983' }, { facilityId: '400' }],
          },
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByTestId('pilot-value')).to.have.text('true');
    });
    it('Returns false when the user has no facilities in the pilot list', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '400' }],
          },
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByTestId('pilot-value')).to.have.text('false');
    });
    it('Returns false when the user has a facility within the pilot list but the feature is off', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: false,
        },
        user: {
          profile: {
            facilities: [{ facilityId: '983' }],
          },
        },
      };
      const screen = renderWithStoreAndRouter(<TestComponent />, {
        initialState,
      });
      expect(screen.getByTestId('pilot-value')).to.have.text('false');
    });
  });
});
