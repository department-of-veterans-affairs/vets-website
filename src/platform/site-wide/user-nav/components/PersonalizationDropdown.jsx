import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  isAuthenticatedWithSSOe,
  signInServiceName,
} from 'platform/user/authentication/selectors';
import { logoutUrl } from 'platform/user/authentication/utilities';
import { logout as SISLogout } from 'platform/utilities/oauth/utilities';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import recordEvent from 'platform/monitoring/record-event';

const recordNavUserEvent = section => () => {
  recordEvent({ event: 'nav-user', 'nav-user-section': section });
};

const recordMyVaEvent = recordNavUserEvent('my-va');
const recordMyHealthEvent = recordNavUserEvent('my-health');
const recordProfileEvent = recordNavUserEvent('profile');

export function PersonalizationDropdown(props) {
  const { isSSOe, csp } = props;

  const createSignout = useCallback(
    () => {
      const label = 'Sign Out';
      return isSSOe ? (
        <a href={logoutUrl()}>{label}</a>
      ) : (
        <button
          type="button"
          className="button-styled-as-link"
          onClick={() => {
            SISLogout({
              signInServiceName: csp,
              storedLocation: window.location.href,
            });
          }}
        >
          {label}
        </button>
      );
    },
    [isSSOe, csp],
  );

  return (
    <ul>
      <li>
        <a href="/my-va/" onClick={recordMyVaEvent}>
          My VA
        </a>
      </li>
      <li>
        <a href={mhvUrl(isSSOe, 'home')} onClick={recordMyHealthEvent}>
          My Health
        </a>
      </li>
      <li>
        <a href="/profile" onClick={recordProfileEvent}>
          Profile
        </a>
      </li>
      <li>{createSignout()}</li>
    </ul>
  );
}

PersonalizationDropdown.propTypes = {
  csp: PropTypes.oneOf(['idme', 'logingov', 'dslogon', 'mhv']),
  isSSOe: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSSOe: isAuthenticatedWithSSOe(state),
  csp: signInServiceName(state),
});

export default connect(mapStateToProps)(PersonalizationDropdown);
