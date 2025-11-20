import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { selectAvailableServices } from '~/platform/user/selectors';
import { Toggler } from '~/platform/utilities/feature-toggles';
import HealthCareContent from './HealthCareContent';
import HealthCareContentLegacy from './HealthCareContentLegacy';

const HealthCare = ({
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  isVAPatient,
  isLOA1,
}) => {
  const headerClassNames = shouldShowLoadingIndicator
    ? 'vads-u-margin-top--0 vads-u-margin-bottom--2'
    : '';

  return (
    <div
      className="health-care-wrapper"
      data-testid="dashboard-section-health-care"
    >
      <h2 data-testid="health-care-section-header" className={headerClassNames}>
        Health care
      </h2>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          {isLOA1 && (
            <div data-testid="no-health-care-notice">
              <p>We can’t find any VA health care for you.</p>
              <va-link text="Go to My HealtheVet" href="/my-health" />
            </div>
          )}
          {!isLOA1 && (
            <HealthCareContent
              dataLoadingDisabled={dataLoadingDisabled}
              isVAPatient={isVAPatient}
              isLOA1={isLOA1}
            />
          )}
        </Toggler.Enabled>
        <Toggler.Disabled>
          <HealthCareContentLegacy
            dataLoadingDisabled={dataLoadingDisabled}
            isVAPatient={isVAPatient}
            isLOA1={isLOA1}
          />
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
};

const mapStateToProps = state => {
  const shouldShowPrescriptions = selectAvailableServices(state).includes(
    backendServices.RX,
  );

  return {
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
    shouldShowPrescriptions,
  };
};

HealthCare.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  dataLoadingDisabled: PropTypes.bool,
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
  isLOA1: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  shouldShowLoadingIndicator: PropTypes.bool,
  shouldShowPrescriptions: PropTypes.bool,
};

export const UnconnectedHealthCare = HealthCare;

export default connect(mapStateToProps)(HealthCare);
