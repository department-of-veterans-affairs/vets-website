import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export default function AppInitLoader({ children }) {
  const downtimeLoading = useSelector(
    state => !state.scheduledDowntime.isReady,
  );

  useEffect(
    () => {
      if (!downtimeLoading) {
        document.querySelector('h1')?.focus();
      }
    },
    [downtimeLoading],
  );

  if (downtimeLoading) {
    return (
      <div className="claims-init-loader">
        <va-loading-indicator set-focus message="Loading VA Claim Status..." />
      </div>
    );
  }

  return children;
}

AppInitLoader.propTypes = {
  children: PropTypes.node.isRequired,
};
