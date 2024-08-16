/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import MyVAHealth from '../components/MyVAHealth';

const oldLocation = global.window.location;

describe('MyVAHealth', () => {
  const ssoeTarget = `https://staging-patientportal.myhealth.va.gov`;
  const server = setupServer();

  before(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    cleanup();
    global.window.location = oldLocation;
  });

  after(() => server.close());

  it('should render', () => {
    const { container } = render(<MyVAHealth />);

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.not.be.null;
  });

  it('should redirect formatted redirect url when api returns 200', async () => {
    global.window.location = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;

    server.use(
      rest.put(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
        (_, res, ctx) => res(ctx.status(200), ctx.json({ provisioned: true })),
      ),
    );

    render(<MyVAHealth />);

    await waitFor(() => {
      expect(global.window.location).to.eql(ssoeTarget);
    });
  });

  it('should redirect to error page 111 when 200 & `provisioned:false`', async () => {
    const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
    global.window.location = startingLocation;

    server.use(
      rest.put(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
        (_, res, ctx) => res(ctx.status(200), ctx.json({ provisioned: false })),
      ),
    );

    render(<MyVAHealth />);

    await waitFor(() => {
      expect(global.window.location).to.not.eql(startingLocation);
    });
  });

  context('`update_provisioning` returns an error', () => {
    it('display terms when `Agreement not accepted`', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        rest.put(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          (_, res, ctx) =>
            res(ctx.status(500), ctx.json({ error: 'Agreement not accepted' })),
        ),
      );

      const { queryByText } = renderInReduxProvider(<MyVAHealth />, {
        initialState: {
          featureToggles: { terms_of_use: true },
        },
      });

      await waitFor(() => {
        expect(
          queryByText(/VA online services terms of use/i, { selector: 'h1' }),
        ).to.not.be.null;
      });
    });

    it('redirect to error page 111 when `Account not Provisioned`', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        rest.put(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          (_, res, ctx) =>
            res(
              ctx.status(401),
              ctx.json({ error: 'Account not Provisioned' }),
            ),
        ),
      );

      render(<MyVAHealth />);

      await waitFor(() => {
        expect(global.window.location.includes(`code=111`)).to.be.true;
        expect(global.window.location).to.not.eql(startingLocation);
      });
    });

    it('redirect to error page 110 if any other error', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        rest.put(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          (_, res, ctx) =>
            res(ctx.status(401), ctx.json({ error: 'Some other error' })),
        ),
      );

      render(<MyVAHealth />);

      await waitFor(() => {
        expect(global.window.location.includes(`code=110`)).to.be.true;
        expect(global.window.location).to.not.eql(startingLocation);
      });
    });
  });

  context(`user actions`, () => {
    it('display terms + click `accept`', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        rest.put(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          (_, res, ctx) =>
            res(ctx.status(400), ctx.json({ error: 'Agreement not accepted' })),
        ),
        rest.post(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept_and_provision`,
          (_req, res, ctx) => res(ctx.status(200), ctx.json({ good: 'togo' })),
        ),
      );

      const { findByTestId } = renderInReduxProvider(<MyVAHealth />, {
        initialState: {
          featureToggles: { terms_of_use: true },
        },
      });

      const acceptButton = await findByTestId('accept');
      expect(acceptButton).to.exist;

      fireEvent.click(acceptButton);

      await waitFor(() => {
        expect(global.window.location).to.not.eql(startingLocation);
      });
    });

    it('display terms + click `deny`', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        rest.put(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          (_, res, ctx) =>
            res(ctx.status(400), ctx.json({ error: 'Agreement not accepted' })),
        ),
        rest.post(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
          (_req, res, ctx) => res(ctx.status(200), ctx.json({ good: 'togo' })),
        ),
      );

      const { container } = renderInReduxProvider(<MyVAHealth />, {
        initialState: {
          featureToggles: { terms_of_use: true },
        },
      });

      const modal = $('va-modal', container);
      modal.__events.primaryButtonClick();

      await waitFor(() => {
        expect(global.window.location).to.not.eql(startingLocation);
      });
    });

    it('display terms + network error', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        rest.put(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          (_, res) => res.networkError(),
        ),
        rest.post(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
          (_req, res, ctx) => res(ctx.status(200), ctx.json({ good: 'togo' })),
        ),
      );

      renderInReduxProvider(<MyVAHealth />, {
        initialState: {
          featureToggles: { terms_of_use: true },
        },
      });

      await waitFor(() => {
        expect(global.window.location.includes('code=110')).to.be.true;
        expect(global.window.location).to.not.eql(startingLocation);
      });
    });
  });
});
