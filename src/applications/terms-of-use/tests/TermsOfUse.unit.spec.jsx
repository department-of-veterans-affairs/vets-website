import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import {
  createGetHandler,
  createPostHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import TermsOfUse from '../containers/TermsOfUse';

const store = ({ authenticatedWithSiS = false } = {}) => ({
  getState: () => ({
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
  const oldLocation = window.location;
  const touResponse200 = { termsOfUseAgreement: { 'some-key': 'some-value' } };

  afterEach(() => {
    window.location = oldLocation;
    cleanup();
  });

  it('should render', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );
    expect(container.querySelector('h1', container).textContent).to.eql(
      'VA online services terms of use',
    );
    expect(container.querySelector('va-accordion', container)).to.exist;
    expect(container.querySelector('va-alert', container)).to.exist;
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
      expect(container.querySelectorAll('va-button', container).length).to.eql(
        4,
      ); // modal
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
      expect(container.querySelectorAll('va-button', container).length).to.eql(
        2,
      ); // modal
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
      expect(container.querySelectorAll('va-button', container).length).to.eql(
        2,
      ); // modal
    });
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
    const startingLocation = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&terms_code=${termsCode}`;
    if (Window.prototype.href) {
      window.location.href = startingLocation;
    } else {
      window.location = startingLocation;
    }

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

      const modal = container.querySelector('va-modal', container);
      expect(modal).to.exist;
      expect(modal).to.have.attribute('visible', 'true');

      // // click the Decline and sign out button
      fireEvent.click(
        container.querySelector('[text="Decline and sign out"]', container),
      );
    });
  });

  it('should redirect to the `redirect_url`', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=idme`;
    const startingLocation = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}`;
    if (Window.prototype.href) {
      window.location.href = startingLocation;
    } else {
      window.location = startingLocation;
    }

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
      const location = window.location.href || window.location;
      expect(location).to.eql(redirectUrl);
    });
  });

  it('should redirect to sessionStorage rather than the `redirect_url`', async () => {
    const redirectUrl = `https://dev.va.gov/?next=loginModal`;
    const startingLocation = `https://dev.va.gov/terms-of-use/`;
    if (Window.prototype.href) {
      window.location.href = startingLocation;
    } else {
      window.location = startingLocation;
    }
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
      const location = window.location.href || window.location;
      expect(location).to.not.eql(redirectUrl);
      expect(location).to.be.oneOf([
        'https://dev.va.gov',
        'https://dev.va.gov/',
      ]);
    });
  });

  it('should redirect to the `ssoeTarget`', async () => {
    const redirectUrl = `https://int.eauth.va.gov/isam/sps/auth?PartnerId=https://staging-patientportal.myhealth.va.gov/session-api/protocol/saml2/metadata`;
    const startingLocation = `https://dev.va.gov/terms-of-use/?ssoeTarget=https%3A%2F%2Fint.eauth.va.gov%2Fisam%2Fsps%2Fauth%3FPartnerId%3Dhttps%3A%2F%2Fstaging-patientportal.myhealth.va.gov%2Fsession-api%2Fprotocol%2Fsaml2%2Fmetadata`;
    if (Window.prototype.href) {
      window.location.href = startingLocation;
    } else {
      window.location = startingLocation;
    }
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
      const location = window.location.href || window.location;
      expect(location).to.eql(redirectUrl);
    });
  });

  it('should pass along `terms_code` to API', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=logingov`;
    const termsCode = '123456abc';
    const startingLocation = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&terms_code=${termsCode}`;
    if (Window.prototype.href) {
      window.location.href = startingLocation;
    } else {
      window.location = startingLocation;
    }

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
      const location = window.location.href || window.location;
      expect(location).to.not.eql(redirectUrl);
    });
  });

  it('should pass along `skip_mhv_account_creation` to API', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=logingov`;
    const skipMhvAccountCreation = true;
    const startingLocation = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&skip_mhv_account_creation=${skipMhvAccountCreation}`;
    if (Window.prototype.href) {
      window.location.href = startingLocation;
    } else {
      window.location = startingLocation;
    }

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
      const location = window.location.href || window.location;
      expect(location).to.not.eql(redirectUrl);
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
      const openedModal = container.querySelector(
        'va-modal[visible="true"]',
        container,
      );
      openedModal.__events.closeEvent();
      expect(container.querySelector('va-modal[visible="false"]', container)).to
        .be.exist;

      // open the modal again
      fireEvent.click(declineButton);
      expect(openedModal).to.exist;
      // click `Go back` button
      fireEvent.click(container.querySelector('[text="Go back"]', container));
      expect(container.querySelector('va-modal[visible="false"]', container)).to
        .be.exist;
    });
  });

  ['sis', 'ssoe'].forEach(authBroker => {
    it(`should use the proper logout for Auth Broker: ${authBroker}`, async () => {
      const touPage = `https://dev.va.gov/terms-of-use`;
      if (Window.prototype.href) {
        window.location.href = touPage;
      } else {
        window.location = touPage;
      }
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
        fireEvent.click(
          container.querySelector('[text="Decline and sign out"]', container),
        );

        // should send them to logout
        expect(window.location.href).to.not.eql(touPage);
      });
    });
  });
});
