import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import * as rumActions from '../../util/rumConstants';

const TrackedSpinner = ({ id, ...rest }) => {
  useEffect(() => {
    const reasons = {
      UNLOAD: 'unload', // Page is unloaded (browser refresh, tab/browser closed, navigation to external page)
      NAVIGATE: 'navigate', // User navigates to another page within the SPA (no reload)
      UNMOUNT: 'unmount', // Component is otherwise unmounted (e.g. spinner turned off when records load)
    };

    const start = Date.now();

    const handleBeforeUnload = () => {
      const elapsedTime = Date.now() - start;
      datadogRum.addAction(rumActions.SPINNER_DURATION, {
        id,
        duration: elapsedTime,
        reason: reasons.UNLOAD,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      const elapsedTime = Date.now() - start;
      datadogRum.addAction(rumActions.SPINNER_DURATION, {
        id,
        duration: elapsedTime,
        reason: reasons.UNMOUNT,
      });
    };
  }, [id]);

  return <va-loading-indicator {...rest} />;
};

export default TrackedSpinner;

TrackedSpinner.propTypes = {
  id: PropTypes.string,
};
