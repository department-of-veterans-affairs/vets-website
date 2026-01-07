import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  isAuthenticatedWithSSOe,
  signInServiceName,
} from 'platform/user/authentication/selectors';
import { logoutEvent } from 'platform/utilities/oauth/utilities';
import recordEvent from 'platform/monitoring/record-event';

import MyHealthLink from './MyHealthLink';

const recordNavUserEvent = section => () => {
  recordEvent({ event: 'nav-user', 'nav-user-section': section });
};

const recordMyVaEvent = recordNavUserEvent('my-va');
const recordProfileEvent = recordNavUserEvent('profile');
const recordDependentsEvent = recordNavUserEvent('dependents');
const recordLettersEvent = recordNavUserEvent('letters');

const handleHatClick = e => {
  e.preventDefault();

  // Check if we're on a GitHub Codespace (github.dev URL)
  const isGitHubCodespace = window.location.hostname.includes('app.github.dev');

  if (isGitHubCodespace) {
    // In Codespaces, port is part of hostname (e.g., -3001.app.github.dev or -3002.app.github.dev)
    // Replace the port number in hostname with 3002
    const newHostname = window.location.hostname.replace(
      /-\d+\.app\.github\.dev$/,
      '-3002.app.github.dev',
    );
    // Construct full URL with / path
    window.location.href = `${window.location.protocol}//${newHostname}/`;
  } else {
    // Regular localhost or other environments
    window.location.href = '/';
  }
};

export function PersonalizationDropdown(props) {
  const { isSSOe, csp } = props;

  const createSignout = useCallback(
    () => (
      <a
        href="/"
        onClick={
          (() => logoutEvent(csp, { shouldWait: !isSSOe, duration: 350 }),
          handleHatClick)
        }
      >
        Sign Out
      </a>
    ),
    [isSSOe, csp],
  );

  return (
    <ul>
      <li>
        <a href="/my-va/" onClick={recordMyVaEvent}>
          My VA
        </a>
      </li>
      <MyHealthLink recordNavUserEvent={recordNavUserEvent} isSSOe={isSSOe} />
      <li>
        <a href="/profile" onClick={recordProfileEvent}>
          Profile
        </a>
      </li>
      <li>
        <a href="/view-change-dependents/view" onClick={recordDependentsEvent}>
          Dependents
        </a>
      </li>
      <li className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-padding-bottom--1">
        <a
          href="/records/download-va-letters/letters"
          onClick={recordLettersEvent}
        >
          Letters
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
