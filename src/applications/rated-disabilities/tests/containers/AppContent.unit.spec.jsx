import React from 'react';
import { render } from '@testing-library/react';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import noRatings from '../fixtures/no-ratings.json';

import AppContent from '../../components/AppContent';

const RATED_DISABILITIES_ENDPOINT =
  'https://dev-api.va.gov/v0/rated_disabilities';

describe('<AppContent>', () => {
  context('When the user has no disability ratings', () => {
    beforeEach(() => {
      server.use(
        createGetHandler(RATED_DISABILITIES_ENDPOINT, () =>
          jsonResponse(noRatings, { status: 200 }),
        ),
      );
    });

    it('displays an alert indicating that there are no ratings', () => {
      const screen = render(<AppContent />);

      screen.findByText('We don’t have any rated disabilities on file for you');
    });
  });
});
