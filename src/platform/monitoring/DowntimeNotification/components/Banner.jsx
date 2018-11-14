import React from 'react';
import PropTypes from 'prop-types';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import DowntimeNotification, {
  externalServices,
  externalServiceStatus,
} from '../index';
import { DownMessaging } from './Down';

/**
 * A banner component for simple downtime messaging
 * @param {object} props appTitle, dependencies, children
 * @module platorm/monitoring/DowntimeNotification/Banner
 */
export default function DowntimeBanner({ appTitle, dependencies, children }) {
  return (
    <DowntimeNotification
      appTitle={appTitle}
      render={downtime => {
        if (downtime.status === externalServiceStatus.down) {
          if (children) return children;
          return (
            <AlertBox
              status="info"
              isVisible
              content={<DownMessaging appTitle={appTitle} {...downtime} />}
            />
          );
        }
        return <div />;
      }}
      loadingIndicator={<div />}
      dependencies={dependencies}
    />
  );
}

DowntimeBanner.propTypes = {
  appTitle: PropTypes.string,
  dependencies: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(externalServices)),
  ).isRequired,
  children: PropTypes.node,
};
