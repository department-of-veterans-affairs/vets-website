import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';

const Welcome = ({ name }) => (
  <div
    className={classnames(
      'vads-u-display--flex',
      'vads-u-justify-content--flex-start',
      'vads-u-margin-bottom--1p5',
    )}
  >
    <h2
      className={classnames(
        'vads-u-font-size--h4',
        'medium-screen:vads-u-font-size--h3',
        'vads-u-margin-top--0',
        'vads-u-margin-bottom--0',
      )}
    >
      {!!name && (
        <>
          Welcome, <span data-dd-privacy="mask">{name}</span>
        </>
      )}
      {!name && <>Welcome</>}
    </h2>
    <div className="vads-u-display--flex vads-u-align-items--center">
      <span
        className={classnames(
          'vads-u-padding-left--4',
          'vads-u-padding-right--0p5',
          'vads-u-color--primary-dark',
        )}
      >
        <va-icon icon="account_circle" size={3} />
      </span>
      <a
        className="vads-u-font-size--md medium-screen:vads-u-font-size--lg"
        href="/profile"
        onClick={() => {
          datadogRum.addAction('Click on Landing Page: Welcome - Profile');
          recordEvent({
            event: 'nav-link-click',
            action: 'click',
            'link-label': 'Profile',
            'link-destination': '/profile',
            'link-origin': window.location.href,
          });
        }}
      >
        Profile
      </a>
    </div>
  </div>
);

Welcome.propTypes = {
  name: PropTypes.string,
};

export default Welcome;
