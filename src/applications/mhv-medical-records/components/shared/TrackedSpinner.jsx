import React, { useEffect, useRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import * as rumActions from '../../util/rumConstants';
import TimeoutAlertBox from './TimeoutAlertBox';
import { TRACKED_SPINNER_DURATION } from '../../util/constants';

/**
 * Default timeout duration (in ms) before the spinner is considered stuck.
 * Matches TRACKED_SPINNER_DURATION (180 seconds / 3 minutes).
 */
const DEFAULT_TIMEOUT = TRACKED_SPINNER_DURATION;

/**
 * A wrapper around the `<va-loading-indicator>` that automatically measures how long the spinner
 * remains mounted and reports that duration to Datadog RUM.
 *
 * If the spinner remains mounted for longer than `timeout` milliseconds (default: 120s),
 * it replaces itself with an error alert, acting as a safety net against infinite loading
 * caused by any upstream failure (feature toggles, profile fetch, Drupal data, etc.).
 */
const TrackedSpinner = ({
  id,
  enableTimeout = false,
  timeout = DEFAULT_TIMEOUT,
  ...rest
}) => {
  const startRef = useRef(Date.now());
  const [timedOut, setTimedOut] = useState(false);

  // NOTE: "NAVIGATE" is impossible to distinguish from "UNMOUNT" in React-Rouer v5, but it may be
  // possible in React-Rouer v6.
  const reasons = useMemo(
    () => ({
      UNLOAD: 'unload', // Page is unloaded (browser refresh, tab/browser closed, navigation to external page)
      NAVIGATE: 'navigate', // User navigates to another page within the SPA (no reload)
      UNMOUNT: 'unmount', // Component is otherwise unmounted (e.g. spinner turned off when records load)
      TIMEOUT: 'timeout', // Spinner exceeded the maximum allowed duration
    }),
    [],
  );

  // Timeout detection — switch to error alert after `timeout` ms
  useEffect(
    () => {
      if (!enableTimeout || !timeout || timeout <= 0) return undefined;

      const timer = setTimeout(() => {
        const elapsedTime = Date.now() - startRef.current;
        const duration = Math.max(0, elapsedTime / 1000);
        datadogRum.addAction(rumActions.SPINNER_DURATION, {
          id,
          duration,
          reason: reasons.TIMEOUT,
        });
        setTimedOut(true);
      }, timeout);

      return () => clearTimeout(timer);
    },
    [enableTimeout, timeout, id, reasons],
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

  if (timedOut) {
    return <TimeoutAlertBox testId={`${id}-timeout-alert`} />;
  }

  return <va-loading-indicator {...rest} />;
};

TrackedSpinner.propTypes = {
  id: PropTypes.string.isRequired,
  enableTimeout: PropTypes.bool,
  timeout: PropTypes.number,
};

export default TrackedSpinner;
