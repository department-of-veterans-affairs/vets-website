import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import sessionStorage from 'platform/utilities/storage/sessionStorage';
import { DEMO_MODE_ACKNOWLEDGED } from '../constants';

export default function App({ children }) {
  const pathname = window.location.pathname.replace(/\/$/, '');
  const isIndexRoute = pathname === '/demo-mode';
  const isAcknowledged = sessionStorage.getItem(DEMO_MODE_ACKNOWLEDGED);

  useEffect(
    () => {
      if (!isAcknowledged && !isIndexRoute) {
        window.location.replace('/demo-mode');
      }
    },
    [isAcknowledged, isIndexRoute],
  );

  if (!isAcknowledged && !isIndexRoute) {
    return null;
  }

  return <>{children}</>;
}

App.propTypes = {
  children: PropTypes.node,
};
