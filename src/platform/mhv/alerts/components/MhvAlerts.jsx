import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  AlertMhvBasicAccount,
  AlertMhvRegistration,
  AlertUnregistered,
  AlertVerifyAndRegister,
} from './alerts';

import {
  showAlertMhvBasicAccount,
  showAlertVerifyAndRegister,
  showAlertUnregistered,
  showAlertMhvRegistration,
  signInServiceName,
  isAuthenticatedWithSSOe,
  isProfileLoading,
} from '../selectors';

const Loading = () => (
  <div className="vads-u-margin--5" data-testid="mhv-alert--loading">
    <VaLoadingIndicator message="Please wait..." />
  </div>
);

/**
 * Renders the relevant <VaAlert /> web component for the My HealtheVet Portal
 *   on VA.gov based on properties of state.user.profile.
 *   When no alerting condtions are present, children are rendered.
 * @param {object} props
 * @param {Node} props.children
 * @returns {JSX.Element}
 * @example
 * import MhvAlerts from '@department-of-veterans-affairs/mhv/exports';
 * <MhvAlerts>{content}<MhvAlerts /> // Render alerts or content
 * <MhvAlerts /> // Render alerts, if any
 */
const MhvAlerts = ({ children }) => {
  const loading = useSelector(isProfileLoading);
  const cspId = useSelector(signInServiceName);
  const ssoe = useSelector(isAuthenticatedWithSSOe);

  const renderAlertMhvBasicAccount = useSelector(showAlertMhvBasicAccount);
  const renderAlertVerifyAndRegister = useSelector(showAlertVerifyAndRegister);
  const renderAlertUnregistered = useSelector(showAlertUnregistered);
  const renderAlertMhvRegsitration = useSelector(showAlertMhvRegistration);

  if (loading) {
    return <Loading />;
  }

  if (renderAlertMhvBasicAccount) {
    return <AlertMhvBasicAccount ssoe={ssoe} />;
  }

  if (renderAlertVerifyAndRegister) {
    return <AlertVerifyAndRegister cspId={cspId} />;
  }

  if (renderAlertUnregistered) {
    return <AlertUnregistered />;
  }

  if (renderAlertMhvRegsitration) {
    return <AlertMhvRegistration ssoe={ssoe} />;
  }

  return children;
};

MhvAlerts.defaultProps = {
  children: false,
};

MhvAlerts.propTypes = {
  children: PropTypes.node,
};

export default MhvAlerts;
