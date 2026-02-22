import React, { useState } from 'react';
import environment from 'platform/utilities/environment';
import environments from 'site/constants/environments';
import { mockLogin } from 'platform/user/authentication/utilities';
import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from 'platform/user/authentication/constants';
import { VaSelect } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

export default function MockAuthButton() {
  const [authType, setAuthType] = useState(CSP_IDS.LOGIN_GOV);
  const [mockLoginError, setMockLoginError] = useState('');
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const ial2Enforcement = useToggleValue(
    TOGGLE_NAMES.identityIal2FullEnforcement,
  );
  return [environments.LOCALHOST, environments.VAGOVDEV].includes(
    environment.getRawBuildtype(),
  ) ? (
    <>
      <VaSelect
        label="Credential Service Provider"
        name="authType"
        error={mockLoginError}
        value={authType}
        onVaSelect={({ detail: { value } }) => setAuthType(value)}
      >
        {Object.values(SERVICE_PROVIDERS)
          .filter(
            provider =>
              provider.policy === 'idme' || provider.policy === 'logingov',
          )
          .map(provider => (
            <option key={provider.policy} value={provider.policy}>
              {provider.label}
            </option>
          ))}
      </VaSelect>
      <va-button
        aria-label="Mock Authentication"
        className="mauth-button vads-u-margin-y--1p5 vads-u-padding-y--2"
        text="Sign in with mocked authentication"
        onClick={async () => {
          try {
            await mockLogin({ type: authType, ial2Enforcement });
          } catch (error) {
            setMockLoginError(error.toString());
          }
        }}
      />
    </>
  ) : null;
}
