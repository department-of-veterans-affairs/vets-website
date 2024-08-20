import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { useIdentityVerificationURL } from '../../authentication/hooks';

describe('authentication - hooks', () => {
  describe('useIdentityVerificationURL', () => {
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
        useIdentityVerificationURL({ policy: 'logingov', useOAuth: false }),
      );

      await waitForNextUpdate();

      expect(result.current?.href).to.eql(
        'https://dev-api.va.gov/v1/sessions/logingov_signup_verified/new',
      );
    });

    it('should return an ID.me (OAuth-based) verify URL', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useIdentityVerificationURL({ policy: 'idme', useOAuth: true }),
      );

      await waitForNextUpdate();

      expect(result.current?.href).to.eql(
        'https://dev-api.va.gov/v0/sign_in/authorize',
      );
    });

    // it('should return a SAML-based verify URL', async () => {
    //   const { result, waitForNextUpdate } = renderHook(() =>
    //     useIdentityVerificationURL({ policy: 'logingov', useOAuth: true }),
    //   );

    //   await waitForNextUpdate();

    //   expect(result.current?.href).to.eql(
    //     'https://dev-api.va.gov/v1/sessions/idme_verified/new?op=signup',
    //   );
    // });
  });
});
