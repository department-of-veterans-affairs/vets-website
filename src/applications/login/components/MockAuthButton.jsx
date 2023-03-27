import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';

export default function MockAuthButton() {
  return (
    <button
      type="button"
      aria-label="Mock Authentication"
      className="usa-button mauth-button vads-u-margin-y--1p5 vads-u-padding-y--2"
      onClick={() => {
        const environ =
          typeof process !== 'undefined'
            ? process.env.BUILDTYPE
            : environment.BUILDTYPE;
        window.location = `${
          ENVIRONMENT_CONFIGURATIONS[environ].API_URL
        }/v0/sign_in/authorize?client_id=vamock`;
      }}
    >
      Mock Authentication
    </button>
  );
}
