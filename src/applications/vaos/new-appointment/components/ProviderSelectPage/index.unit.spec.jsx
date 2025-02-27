import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import SelectProviderPage from './index';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';

const defaultState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingOhDirectSchedule: true,
    vaOnlineSchedulingOhRequest: true,
  },
};

describe('VAOS Page: ProviderSelectPage', () => {
  beforeEach(() => {
    mockFetch();
  });

  describe('when there is a single provider', () => {
    it('should display the type of care specific page header', async () => {
      const providers = [
        {
          name: 'Sarah Bennett, RD',
          lastAppointment: '9/12/2024',
        },
      ];

      const store = createTestStore(defaultState);

      const screen = renderWithStoreAndRouter(
        <SelectProviderPage providers={providers} />,
        {
          store,
        },
      );

      expect(screen.getByText(/Your nutrition and food provider/i)).to.exist;
    });
  });

  describe('when there are multiple providers', () => {
    it('should display the generic page header', async () => {
      const providers = [
        {
          name: 'Sarah Bennett, RD',
          lastAppointment: '9/12/2024',
        },
        {
          name: 'Julie Carson, RD',
          lastAppointment: '7/12/2024',
        },
      ];

      const store = createTestStore(defaultState);

      const screen = renderWithStoreAndRouter(
        <SelectProviderPage providers={providers} />,
        {
          store,
        },
      );

      expect(screen.getByText(/Which provider do you want to schedule with?/i))
        .to.exist;
    });
  });
});
