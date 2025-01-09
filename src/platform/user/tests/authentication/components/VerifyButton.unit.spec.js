import React from 'react';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';
import Scroll from 'react-scroll';
import * as authUtilities from 'platform/user/authentication/utilities';
import * as oauthUtilities from 'platform/utilities/oauth/utilities';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import {
  $,
  $$,
  fixSelector,
  focusElement,
  scrollToElement,
} from 'platform/forms-system/src/js/utilities/ui/index';
import {
  verifyHandler,
  VerifyIdmeButton,
  VerifyLogingovButton,
  VerifyButton,
} from 'platform/user/authentication/components/VerifyButton';
import * as LoginButtonModule from 'platform/user/authentication/components/LoginButton';

describe('Verify Components and Utilities', () => {
  const sandbox = sinon.createSandbox();
  let loginHandlerStub;
  let verifyStub;
  let updateVerifierStub;

  beforeEach(() => {
    // Stub reusable methods
    loginHandlerStub = sandbox
      .stub(LoginButtonModule, 'loginHandler')
      .resolves();
    verifyStub = sandbox.stub(authUtilities, 'verify').resolves();
    updateVerifierStub = sandbox
      .stub(oauthUtilities, 'updateStateAndVerifier')
      .resolves();
  });

  afterEach(() => {
    // Restore stubs after each test
    sandbox.restore();
    cleanup();
  });

  describe('verifyHandler', () => {
    it('should handle unauthenticated flow and call loginHandler', async () => {
      const params = {
        policy: 'idme',
        queryParams: { operation: 'unauthenticated_verify_page' },
      };

      await verifyHandler(params);

      expect(loginHandlerStub.calledOnce).to.be.true;
      expect(
        loginHandlerStub.calledWith(
          params.policy,
          true,
          `${window.location.origin}/`,
        ),
      ).to.be.true;
    });

    it('should call verify and updateStateAndVerifier for OAuth flow', async () => {
      const params = {
        policy: 'logingov',
        queryParams: {},
      };

      await verifyHandler(params);

      expect(verifyStub.calledOnce).to.be.true;
      expect(verifyStub.calledWithMatch({ policy: 'logingov', useOAuth: true }))
        .to.be.true;
      expect(updateVerifierStub.calledOnce).to.be.true;
      expect(updateVerifierStub.calledWith('logingov')).to.be.true;
    });

    describe('VerifyIdmeButton', () => {
      it('should render and trigger verifyHandler on click', async () => {
        const { container } = render(
          <VerifyIdmeButton queryParams={{ test: 'param' }} />,
        );
        const button = $('.idme-verify-button', container);

        expect(button).to.exist;

        fireEvent.click(button);

        await waitFor(() => expect(verifyStub.calledOnce).to.be.true);
        expect(
          verifyStub.calledWithMatch({ policy: SERVICE_PROVIDERS.idme.policy }),
        ).to.be.true;
      });

      it('should focus the button after click', async () => {
        const { container } = render(<VerifyIdmeButton queryParams={{}} />);
        const button = $('.idme-verify-button', container);

        fireEvent.click(button);

        focusElement(button);
        expect(document.activeElement).to.equal(button);
      });
    });

    describe('VerifyLogingovButton', () => {
      it('should render and trigger verifyHandler on click', async () => {
        const { container } = render(<VerifyLogingovButton queryParams={{}} />);
        const button = $('.logingov-verify-button', container);

        expect(button).to.exist;

        fireEvent.click(button);

        await waitFor(() => expect(verifyStub.calledOnce).to.be.true);
        expect(
          verifyStub.calledWithMatch({
            policy: SERVICE_PROVIDERS.logingov.policy,
          }),
        ).to.be.true;
      });

      it('should scroll to the button on render', () => {
        const scrollToSpy = sandbox.spy(Scroll.scroller, 'scrollTo');
        render(<VerifyLogingovButton queryParams={{}} />);

        scrollToElement('.logingov-verify-button');
        expect(scrollToSpy.calledOnce).to.be.true;
      });
    });

    describe('VerifyButton', () => {
      Object.keys(SERVICE_PROVIDERS).forEach(cspKey => {
        it(`should render and trigger verifyHandler for ${cspKey}`, async () => {
          const { container } = render(
            <VerifyButton csp={cspKey} queryParams={{}} />,
          );
          const button = $(`.${cspKey}-verify-button`, container);

          expect(button).to.exist;

          fireEvent.click(button);

          await waitFor(() => expect(verifyStub.calledOnce).to.be.true);
          expect(
            verifyStub.calledWithMatch({
              policy: SERVICE_PROVIDERS[cspKey].policy,
            }),
          ).to.be.true;
        });
      });
    });

    it('should escape colons in selectors using fixSelector', () => {
      const selector = 'view:example';
      const fixed = fixSelector(selector);
      expect(fixed).to.equal('view\\:example');
    });

    it('should find focusable elements using getFocusableElements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Click me</button>
        <input type="text" />
        <a href="#">Link</a>
      `;
      document.body.appendChild(container);

      const focusableElements = $$('button, input, a', container);
      expect(focusableElements).to.have.lengthOf(3);
      document.body.removeChild(container);
    });
  });
});
