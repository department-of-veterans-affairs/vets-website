/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';
import {
  setupServer,
  createPutHandler,
  createPostHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import MyVAHealth from '../components/MyVAHealth';

const oldLocation = global.window.location;

describe('MyVAHealth', () => {
  const ssoeTarget = `https://staging-patientportal.myhealth.va.gov`;
  const altSsoeTarget = `https://sandbox-patientportal.myhealth.va.gov`;
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

  [ssoeTarget, altSsoeTarget].forEach(targetUrl => {
    it(`should redirect formatted redirect url (${targetUrl}) when api returns 200`, async () => {
      global.window.location = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${targetUrl}`;

      server.use(
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () => jsonResponse({ provisioned: true }),
        ),
      );

      render(<MyVAHealth />);

      await waitFor(() => {
        expect(global.window.location).to.eql(targetUrl);
      });
    });
  });

  it('should redirect to error page 111 when 200 & `provisioned:false`', async () => {
    const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
    global.window.location = startingLocation;

    server.use(
      createPutHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
        () => jsonResponse({ provisioned: false }),
      ),
    );

    render(<MyVAHealth />);

    await waitFor(() => {
      expect(global.window.location).to.not.eql(startingLocation);
    });
  });

  it('should redirect to error page 110 when apiRequest in handleTouClick fails', async () => {
    const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
    global.window.location = startingLocation;

    server.use(
      createPutHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
        () =>
          jsonResponse({ error: 'Agreement not accepted' }, { status: 400 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept_and_provision`,
        () => jsonResponse({}, { status: 503 }),
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
      expect(global.window.location.includes('code=110')).to.be.true;
      expect(global.window.location).to.not.eql(startingLocation);
    });
  });

  context('`update_provisioning` returns an error', () => {
    it('display terms when `Agreement not accepted`', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () =>
            jsonResponse({ error: 'Agreement not accepted' }, { status: 500 }),
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
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () =>
            jsonResponse({ error: 'Account not Provisioned' }, { status: 401 }),
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
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () => jsonResponse({ error: 'Some other error' }, { status: 401 }),
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
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () =>
            jsonResponse({ error: 'Agreement not accepted' }, { status: 400 }),
        ),
        createPostHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept_and_provision`,
          () => jsonResponse({ good: 'togo' }),
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
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () => jsonResponse(400, { error: 'Agreement not accepted' }),
        ),
        createPostHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
          jsonResponse(200, { good: 'togo' }),
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
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () => jsonResponse({}, { status: 503 }),
        ),
        createPostHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
          () => jsonResponse({ good: 'togo' }),
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

    it('display terms + close deny', async () => {
      const startingLocation = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;
      global.window.location = startingLocation;

      server.use(
        createPutHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
          () =>
            jsonResponse({ error: 'Agreement not accepted' }, { status: 400 }),
        ),
        createPostHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
          () => jsonResponse({ good: 'togo' }),
        ),
      );

      const { findByTestId } = renderInReduxProvider(<MyVAHealth />, {
        initialState: {
          featureToggles: { terms_of_use: true },
        },
      });

      const declineButton = await findByTestId('decline');
      expect(declineButton).to.exist;
      const modal = await findByTestId('modal-show');
      expect(modal).to.exist;

      // via close event
      fireEvent.click(declineButton);
      expect(modal.getAttribute('visible')).to.eql('true');
      modal.__events.closeEvent();
      expect(modal.getAttribute('visible')).to.eql('false');

      // via secondary button
      fireEvent.click(declineButton);
      expect(modal.getAttribute('visible')).to.eql('true');
      modal.__events.secondaryButtonClick();
      expect(modal.getAttribute('visible')).to.eql('false');
    });
  });
});
