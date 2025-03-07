import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import {
  useIdentityVerificationURL,
  useInternalTestingAuth,
  onVerifyClick,
} from '../../authentication/hooks';

describe('authentication - hooks', () => {
  describe('useIdentityVerificationURL', () => {
    context('SAML', () => {
      it('should return an ID.me (SAML-based) verify URL', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
          useIdentityVerificationURL({ policy: 'idme', useOAuth: false }),
        );

        await waitForNextUpdate();

        expect(result.current?.href).to.eql(
          'https://dev-api.va.gov/v1/sessions/idme_signup_verified/new',
        );
      });

      it('should return a Login.gov (SAML-based) verify URL', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
          useIdentityVerificationURL({
            policy: 'logingov',
            useOAuth: false,
          }),
        );

        await waitForNextUpdate();

        expect(result.current?.href).to.eql(
          'https://dev-api.va.gov/v1/sessions/logingov_signup_verified/new',
        );
      });
    });

    context('OAuth', () => {
      const globalCrypto = global.crypto;

      beforeEach(() => {
        window.crypto = mockCrypto;
      });

      afterEach(() => {
        window.crypto = globalCrypto;
      });
      it('should return an ID.me (OAuth-based) verify URL', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
          useIdentityVerificationURL({ policy: 'idme', useOAuth: true }),
        );

        await waitForNextUpdate();

        expect(result.current?.href).to.include(
          'https://dev-api.va.gov/v0/sign_in/authorize',
        );
        expect(result.current?.href).to.include('acr=loa3');
        expect(result.current?.href).to.include('type=idme');
        expect(result.current?.href).to.include('state=');
        expect(result.current?.href).to.include('code_challenge=');
      });

      it('should return an Login.gov (OAuth-based) verify URL', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
          useIdentityVerificationURL({ policy: 'logingov', useOAuth: true }),
        );

        await waitForNextUpdate();

        expect(result.current?.href).to.include(
          'https://dev-api.va.gov/v0/sign_in/authorize',
        );
        expect(result.current?.href).to.include('acr=ial2');
        expect(result.current?.href).to.include('type=logingov');
        expect(result.current?.href).to.include('state=');
        expect(result.current?.href).to.include('code_challenge=');
      });
    });
  });
  describe('onVerifyClick', () => {
    it('should NOT update state + code verifier when using SAML', () => {
      localStorage.clear();
      onVerifyClick({ useOAuth: false, policy: 'idme' });
      expect(localStorage.length).to.eql(0);
    });

    it('should update state + code verifier when using OAuth', () => {
      localStorage.setItem('logingov_signup_state', 'test_state');
      localStorage.setItem('logingov_signup_code_verifier', 'test_cv');
      expect(localStorage.getItem('state')).to.be.null;
      expect(localStorage.getItem('code_verifier')).to.be.null;
      onVerifyClick({ useOAuth: true, policy: 'logingov' });
      expect(localStorage.getItem('state')).to.eql('test_state');
      expect(localStorage.getItem('code_verifier')).to.eql('test_cv');
    });
  });
  describe('useInternalTestingAuth', () => {
    const oldLocation = global.window.location;

    afterEach(() => {
      global.window.location = oldLocation;
    });

    it('should return an href with vaoccmobile application', async () => {
      window.location = new URL(
        `https://dev.va.gov/sign-in/?application=vaoccmobile`,
      );

      const { result, waitForNextUpdate } = renderHook(() =>
        useInternalTestingAuth(),
      );

      await waitForNextUpdate();

      expect(result.current.href).to.include('application=vaoccmobile');
      expect(result.current.href).to.include(
        'operation=myhealthevet_test_account',
      );
    });
  });
});
