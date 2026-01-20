import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getLoginGovStateIncidents } from 'platform/monitoring/external-services/actions';
import { selectVAPResidentialAddress } from 'platform/user/selectors';
import { useToggleValue } from 'platform/utilities/feature-toggles/useFeatureToggle';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

/**
 * Determines if a user is affected by login.gov state-level incidents
 * @param {Array} incidents - Array of state incident objects
 * @param {String} userStateCode - User's state code (e.g., 'AR', 'CA')
 * @returns {Object|null} - Matching incident or null
 */
export const getAffectedIncident = (incidents, userStateCode) => {
  if (!incidents || !userStateCode) return null;
  
  return incidents.find(incident => {
    if (!incident.active || !incident.states) return false;
    return incident.states.includes(userStateCode);
  });
};

/**
 * Renders a state-specific login.gov downtime alert banner
 */
export default function LoginGovStateDowntimeBanner({ testMode = false }) {
  const dispatch = useDispatch();
  const isLocalhost = useMemo(() => environment.isLocalhost(), []);
  const featureEnabled = useToggleValue('loginGovStateDowntimeAlerts');
  
  const { loading, incidents, error } = useSelector(
    state => state.externalServiceStatuses?.loginGovStateIncidents || {},
  );
  
  const residentialAddress = useSelector(selectVAPResidentialAddress);
  const userStateCode = residentialAddress?.stateCode;

  // Fetch incidents on mount if feature is enabled
  useEffect(() => {
    if ((featureEnabled || testMode) && !loading && !isLocalhost) {
      dispatch(getLoginGovStateIncidents());
    }
  }, [featureEnabled, testMode, dispatch, loading, isLocalhost]);

  // Graceful degradation on error
  if (error || !featureEnabled) {
    return null;
  }

  const affectedIncident = getAffectedIncident(incidents, userStateCode);

  // Track banner display for analytics
  useEffect(() => {
    if (affectedIncident) {
      recordEvent({
        event: 'login-gov-state-downtime-alert-displayed',
        'downtime-state': userStateCode,
        'incident-id': affectedIncident.id,
        'incident-status': affectedIncident.status,
      });
    }
  }, [affectedIncident, userStateCode]);

  if (!affectedIncident) {
    return null;
  }

  const { title, message, status = 'warning' } = affectedIncident;

  return (
    <div className="state-downtime-notification row vads-u-margin-top--2">
      <div className="sign-in-wrapper">
        <div className="form-warning-banner fed-warning--v2 vads-u-margin-left--0">
          <va-alert visible status={status} uswds>
            <h2 slot="headline">{title}</h2>
            {message}
          </va-alert>
        </div>
      </div>
    </div>
  );
}

LoginGovStateDowntimeBanner.propTypes = {
  testMode: PropTypes.bool,
};
