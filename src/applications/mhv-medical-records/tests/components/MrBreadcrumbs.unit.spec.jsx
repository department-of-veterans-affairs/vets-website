import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import MrBreadcrumbs from '../../components/MrBreadcrumbs';

describe('MrBreadcrumbs component', () => {
  it('should display breadcrumbs on the landing page', () => {
    const initialState = {
      mr: {
        breadcrumbs: {
          crumbsList: [
            {
              href: '/',
              label: 'VA.gov home',
            },
            {
              href: '/my-health',
              label: 'My HealtheVet',
            },
            {
              href: '/',
              label: 'Medical records',
              isRouterLink: true,
            },
          ],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_integration_medical_records_to_phase_1: true,
      },
    };

    const screen = renderWithStoreAndRouter(<MrBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: '/',
    });
    screen.debug();
    const header = screen.getByTestId('breadcrumbs');
    expect(header).to.exist;
  });
});
