import React from 'react';
import PropTypes from 'prop-types';
import { VerifyButton } from '~/platform/user/exportsFile';
import { maskEmail } from '../helpers';

const CspDisplay = ({ csp, email, name }) => {
  return (
    <>
      <p>
        We found an existing <strong>{name}</strong> account for your email
        address: <span data-testid="email-mask">{maskEmail(email)}</span>
      </p>
      {/* change line below */}
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
  const headingText = userHasLogingov ? 'Login.gov' : 'ID.me';
  return (
    <div>
      <h2 className="vads-u-margin-y--0" id="accountSwitchH2">
        Start using your{' '}
        <strong>{userHasBoth ? 'Login.gov or ID.me' : headingText}</strong>{' '}
        account now
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
