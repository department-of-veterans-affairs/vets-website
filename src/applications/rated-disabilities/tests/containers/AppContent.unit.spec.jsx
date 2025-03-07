import React from 'react';
import { render } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import noRatings from '../fixtures/no-ratings.json';

import AppContent from '../../components/AppContent';

const RATED_DISABILITIES_ENDPOINT =
  'https://dev-api.va.gov/v0/rated_disabilities';

describe('<AppContent>', () => {
  const server = setupServer();

  before(() => {
    server.listen();
  });

  after(() => {
    server.close();
  });

  context('When the user has no disability ratings', () => {
    before(() => {
      server.use(
        rest.get(RATED_DISABILITIES_ENDPOINT, (_, res, ctx) =>
          res(ctx.status(200), ctx.json(noRatings)),
        ),
      );
    });

    it('displays an alert indicating that there are no ratings', () => {
      const screen = render(<AppContent />);

      screen.findByText('We don’t have any rated disabilities on file for you');
    });
  });
});
