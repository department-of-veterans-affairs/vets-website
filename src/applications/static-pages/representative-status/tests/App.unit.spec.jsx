import React from 'react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor, cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import App from '../components/App';

const createFakeStore = ({
  isLoading = false,
  toggleEnabled = true,
  hasRepresentative = false,
  isLoggedIn = true,
} = {}) => ({
  featureToggles: {
    loading: isLoading,
    // eslint-disable-next-line camelcase
    representative_status_enabled: toggleEnabled,
  },
  user: {
    login: {
      hasRepresentative,
      currentlyLoggedIn: isLoggedIn,
    },
    profile: {
      loa: { current: 3 },
    },
  },
});

describe('App component', () => {
  afterEach(cleanup);

  context('authenticated', () => {
    const server = setupServer();

    before(() => {
      server.listen();
    });

    after(() => {
      server.close();
    });

    it('should render when no rep found', async () => {
      server.use(
        rest.get(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          (_, res, ctx) => res(ctx.status(200), ctx.json({})),
        ),
      );
      const { container } = renderInReduxProvider(<App baseHeader={2} />, {
        initialState: createFakeStore({ hasRepresentative: false }),
      });

      await waitFor(() => {
        const h2Tag = container.querySelector('h2');
        expect(h2Tag).to.exist;
        expect(h2Tag.textContent).to.eql(
          'You don’t have an accredited representative',
        );
      });
    });

    it('should render content when rep api fails', async () => {
      server.use(
        rest.get(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          (_, res, ctx) => res(ctx.status(400), ctx.json({})),
        ),
      );
      const { container } = renderInReduxProvider(<App baseHeader={2} />, {
        initialState: createFakeStore({ hasRepresentative: false }),
      });

      await waitFor(() => {
        const h2Tag = container.querySelector('h2');
        expect(h2Tag).to.exist;
        expect(h2Tag.textContent).to.eql(
          'We can’t check if you have an accredited representative.',
        );
      });
    });

    it('should render when rep is found', async () => {
      server.use(
        rest.get(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          (_, res, ctx) =>
            res(
              ctx.status(200),
              ctx.json({
                data: {
                  id: '074',
                  type: 'veteran_service_organizations',
                  attributes: {
                    addressLine1: '1608 K St NW',
                    addressLine2: null,
                    addressLine3: null,
                    addressType: 'Domestic',
                    city: 'Washington',
                    countryName: 'United States',
                    countryCodeIso3: 'USA',
                    province: 'District Of Columbia',
                    internationalPostalCode: null,
                    stateCode: 'DC',
                    zipCode: '20006',
                    zipSuffix: '2801',
                    phone: '202-861-2700',
                    type: 'organization',
                    name: 'American Legion',
                    email: 'sample@test.com',
                  },
                },
              }),
            ),
        ),
      );
      const { container } = renderInReduxProvider(<App baseHeader={2} />, {
        initialState: createFakeStore({ hasRepresentative: true }),
      });

      await waitFor(() => {
        expect(container.querySelector('.auth-rep-subheader')).to.exist;
        expect(
          container.querySelector('.auth-rep-subheader h3').textContent,
        ).to.contain('American Legion');
      });
    });
  });
});
