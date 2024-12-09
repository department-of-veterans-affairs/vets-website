import React from 'react';
import PropTypes from 'prop-types';
import { VerifyButton } from '~/platform/user/exportsFile';
import { maskEmail } from '../helpers';

const CspDisplay = ({ csp, email, name }) => {
  return (
    <>
      <p>
        We found an existing <strong>{name}</strong> account for your email
        address: <strong>{maskEmail(email, `${csp}email`)}</strong>
      </p>
      <VerifyButton
        csp={csp}
        data-testid={csp}
        queryParam={{ operation: 'interstitial_verify' }}
      />
    </>
  );
};
export default function AccountSwitch({ userEmails }) {
  const userHasIdme = userEmails.idme;
  const userHasLogingov = userEmails.logingov;
  const userHasBoth = userHasIdme && userHasLogingov;
  const cspText = userHasLogingov ? 'Login.gov' : 'ID.me';
  const headingText = `Start using your ${
    userHasBoth ? 'Login.gov or ID.me' : cspText
  } account now`;
  return (
    <div>
      <h2 className="vads-u-margin-y--0" id="accountSwitchH2">
        {headingText}
      </h2>
      {userHasLogingov && (
        <CspDisplay
          csp="logingov"
          email={userEmails.logingov}
          name="Login.gov"
          id="logingovButton"
        />
      )}
      {userHasIdme && (
        <CspDisplay
          csp="idme"
          email={userEmails.idme}
          name="ID.me"
          id="idmeButton"
        />
      )}
    </div>
  );
}

AccountSwitch.propTypes = {
  userEmails: PropTypes.object,
};

CspDisplay.propTypes = {
  csp: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string,
};
