import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import {
  setupServer,
  createGetHandler,
  createPostHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import TermsOfUse from '../containers/TermsOfUse';

const store = ({
  termsOfUseEnabled = true,
  authenticatedWithSiS = false,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      terms_of_use: termsOfUseEnabled,
    },
    user: {
      profile: {
        session: {
          authBroker: authenticatedWithSiS ? 'sis' : 'ssoe',
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('TermsOfUse', () => {
  const oldLocation = global.window.location;
  const server = setupServer();
  const touResponse200 = { termsOfUseAgreement: { 'some-key': 'some-value' } };

  before(() => server.listen());
  afterEach(() => {
    global.window.location = oldLocation;
    cleanup();
    server.resetHandlers();
  });
  after(() => server.close());

  it('should render', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eql(
      'VA online services terms of use',
    );
    expect($('va-accordion', container)).to.exist;
    expect($('va-alert', container)).to.exist;
  });

  it('should display buttons by default', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
    );
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-button', container).length).to.eql(4); // modal
    });
  });

  it('should NOT display buttons if URL comes back as a 401', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({ errors: [{ code: '401' }] }, { status: 401 }),
      ),
    );
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-button', container).length).to.eql(2); // modal
    });
  });

  it('should NOT display buttons if title is `Not authorized`', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () =>
          jsonResponse(
            { errors: [{ code: '500', title: 'Not authorized' }] },
            { status: 401 },
          ),
      ),
    );
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-button', container).length).to.eql(2); // modal
    });
  });

  it('should NOT display Accept or Decline buttons termsOfUse Flipper is disabled', () => {
    const mockStore = store({ termsOfUseEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    expect($$('va-button', container).length).to.eql(2); // modal
  });

  it('should display the declined modal if the decline button is clicked', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
    );
    const { container, queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const declineButton = queryAllByTestId('decline')[0];

      fireEvent.click(declineButton);

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal).to.have.attribute('visible', 'true');
    });
  });

  it('should call `/decline` when `Decline and sign out button` is clicked', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=idme`;
    const termsCode = `555abc`;
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&terms_code=${termsCode}`;

    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
        ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('terms_code')).to.eql(termsCode);
          return jsonResponse(touResponse200);
        },
      ),
    );
    const { container, queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const declineButton = queryAllByTestId('decline')[0];

      fireEvent.click(declineButton);

      const modal = $('va-modal', container);
      expect(modal).to.exist;
      expect(modal).to.have.attribute('visible', 'true');

      // // click the Decline and sign out button
      fireEvent.click($('[text="Decline and sign out"]', container));
    });
  });

  it('should redirect to the `redirect_url`', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=idme`;
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}`;

    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        () => jsonResponse(touResponse200, { status: 200 }),
      ),
    );
    const { queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    const acceptButton = queryAllByTestId('accept')[0];
    expect(acceptButton).to.exist;

    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(global.window.location).to.eql(redirectUrl);
    });
  });

  it('should redirect to sessionStorage rather than the `redirect_url`', async () => {
    const redirectUrl = `https://dev.va.gov/?next=loginModal`;
    global.window.location = `https://dev.va.gov/terms-of-use/`;
    sessionStorage.setItem('authReturnUrl', redirectUrl);

    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        () => jsonResponse(touResponse200, { status: 200 }),
      ),
    );
    const { queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    const acceptButton = queryAllByTestId('accept')[0];
    expect(acceptButton).to.exist;

    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(global.window.location).to.not.eql(redirectUrl);
      expect(global.window.location).to.eql('https://dev.va.gov');
    });
  });

  it('should redirect to the `ssoeTarget`', async () => {
    const redirectUrl = `https://int.eauth.va.gov/isam/sps/auth?PartnerId=https://staging-patientportal.myhealth.va.gov/session-api/protocol/saml2/metadata`;
    global.window.location = `https://dev.va.gov/terms-of-use/?ssoeTarget=https%3A%2F%2Fint.eauth.va.gov%2Fisam%2Fsps%2Fauth%3FPartnerId%3Dhttps%3A%2F%2Fstaging-patientportal.myhealth.va.gov%2Fsession-api%2Fprotocol%2Fsaml2%2Fmetadata`;
    sessionStorage.setItem('authReturnUrl', redirectUrl);

    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        () => jsonResponse(touResponse200, { status: 200 }),
      ),
    );
    const { queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    const acceptButton = queryAllByTestId('accept')[0];
    expect(acceptButton).to.exist;

    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(global.window.location).to.eql(redirectUrl);
    });
  });

  it('should pass along `terms_code` to API', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=logingov`;
    const termsCode = '123456abc';
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&terms_code=${termsCode}`;

    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('terms_code')).to.eql(termsCode);
          return jsonResponse(touResponse200, { status: 200 });
        },
      ),
    );
    const { queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const acceptButton = queryAllByTestId('accept')[0];
      expect(acceptButton).to.exist;
      fireEvent.click(acceptButton);
      expect(global.window.location).to.not.eql(redirectUrl);
    });
  });

  it('should pass along `skip_mhv_account_creation` to API', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=logingov`;
    const skipMhvAccountCreation = true;
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&skip_mhv_account_creation=${skipMhvAccountCreation}`;

    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
      createPostHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        ({ request }) => {
          const url = new URL(request.url);
          expect(url.searchParams.get('skip_mhv_account_creation')).to.eql(
            String(skipMhvAccountCreation),
          );
          return jsonResponse(touResponse200, { status: 200 });
        },
      ),
    );
    const { queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const acceptButton = queryAllByTestId('accept')[0];
      expect(acceptButton).to.exist;
      fireEvent.click(acceptButton);
      expect(global.window.location).to.not.eql(redirectUrl);
    });
  });

  it('should close the Decline modal when Close or Go Back buttons are clicked', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        () => jsonResponse({}, { status: 200 }),
      ),
    );
    const { container, queryAllByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const declineButton = queryAllByTestId('decline')[0];
      expect(declineButton).to.exist;

      fireEvent.click(declineButton);

      // click close button on modal
      const openedModal = $('va-modal[visible="true"]', container);
      openedModal.__events.closeEvent();
      expect($('va-modal[visible="false"]', container)).to.be.exist;

      // open the modal again
      fireEvent.click(declineButton);
      expect(openedModal).to.exist;
      // click `Go back` button
      fireEvent.click($('[text="Go back"]', container));
      expect($('va-modal[visible="false"]', container)).to.be.exist;
    });
  });

  ['sis', 'ssoe'].forEach(authBroker => {
    it(`should use the proper logout for Auth Broker: ${authBroker}`, async () => {
      const touPage = `https://dev.va.gov/terms-of-use`;
      global.window.location = touPage;
      const authenticatedWithSiS = authBroker === 'sis';
      const mockStore = store({ authenticatedWithSiS });
      server.use(
        createGetHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
          () => jsonResponse({}, { status: 200 }),
        ),
        createPostHandler(
          `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
          () => jsonResponse(touResponse200, { status: 200 }),
        ),
      );
      const { container, queryAllByTestId } = render(
        <Provider store={mockStore}>
          <TermsOfUse />
        </Provider>,
      );

      await waitFor(() => {
        const declineButton = queryAllByTestId('decline')[0];
        expect(declineButton).to.exist;

        fireEvent.click(declineButton);

        // click close button on modal
        fireEvent.click($('[text="Decline and sign out"]', container));

        // should send them to logout
        expect(global.window.location.href).to.not.eql(touPage);
      });
    });
  });
});
