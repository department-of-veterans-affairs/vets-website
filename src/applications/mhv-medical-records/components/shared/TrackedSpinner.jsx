import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import * as rumActions from '../../util/rumConstants';

/**
 * A wrapper around the `<va-loading-indicator>` that automatically measures how long the spinner
 * remains mounted and reports that duration to Datadog RUM.
 */
const TrackedSpinner = ({ id, ...rest }) => {
  const startRef = useRef(Date.now());

  // NOTE: "NAVIGATE" is impossible to distinguish from "UNMOUNT" in React-Rouer v5, but it may be
  // possible in React-Rouer v6.
  const reasons = useMemo(
    () => ({
      UNLOAD: 'unload', // Page is unloaded (browser refresh, tab/browser closed, navigation to external page)
      NAVIGATE: 'navigate', // User navigates to another page within the SPA (no reload)
      UNMOUNT: 'unmount', // Component is otherwise unmounted (e.g. spinner turned off when records load)
    }),
    [],
  );

  useEffect(
    () => {
      const addDatadogAction = reason => {
        const elapsedTime = Date.now() - startRef.current;
        const duration = Math.max(0, elapsedTime / 1000); // Ensure non-negative duration, convert to seconds
        datadogRum.addAction(rumActions.SPINNER_DURATION, {
          id,
          duration,
          reason,
        });
      };

      const handleBeforeUnload = () => {
        addDatadogAction(reasons.UNLOAD);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        addDatadogAction(reasons.UNMOUNT);
      };
    },
    [id, reasons],
  );

  return <va-loading-indicator {...rest} />;
};

TrackedSpinner.propTypes = {
  id: PropTypes.string.isRequired,
};

export default TrackedSpinner;
