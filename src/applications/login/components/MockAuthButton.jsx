import React, { useState } from 'react';
import environment from 'platform/utilities/environment';
import environments from 'site/constants/environments';
import { mockLogin } from 'platform/user/authentication/utilities';
import {
  CSP_IDS,
  SERVICE_PROVIDERS,
} from 'platform/user/authentication/constants';
import { Select } from '@department-of-veterans-affairs/component-library';

export default function MockAuthButton() {
  const [authType, setAuthType] = useState(CSP_IDS.LOGIN_GOV);
  const processTypeUndefined = typeof process === 'undefined';
  const environ = !processTypeUndefined
    ? process.env.BUILDTYPE
    : environment.BUILDTYPE;
  return environ === environments.LOCALHOST ||
    environ === environments.VAGOVDEV ? (
    <>
      {processTypeUndefined && (
        <Select
          label="Authentication Type"
          name="authType"
          includeBlankOption={false}
          value={{ value: authType }}
          onValueChange={({ value }) => setAuthType(value)}
          options={Object.values(SERVICE_PROVIDERS).map(provider => ({
            label: provider.label,
            value: provider.policy,
          }))}
        />
      )}
      <button
        type="button"
        aria-label="Mock Authentication"
        className="usa-button mauth-button vads-u-margin-y--1p5 vads-u-padding-y--2"
        onClick={async () => {
          await mockLogin({}, authType);
        }}
      >
        Mock Authentication
      </button>
    </>
  ) : (
    <></>
  );
}
