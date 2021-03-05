import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadPrescriptions as loadPrescriptionsAction } from '~/applications/personalization/dashboard/actions/prescriptions';

import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import Prescriptions from './Prescriptions';
import HealthCareCard from './HealthCareCard';

const HealthCare = ({
  loadPrescriptions,
  prescriptions,
  authenticatedWithSSOe,
  canAccessRx,
}) => {
  useEffect(
    () => {
      if (canAccessRx) {
        loadPrescriptions({
          active: true,
          sort: '-refill_submit_date',
        });
      }
    },
    [canAccessRx, loadPrescriptions],
  );

  return (
    <div className="health-care vads-u-margin-y--6">
      <h2 className="vads-u-margin-y--0">Health care</h2>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {/* Messages */}
        <HealthCareCard type="messages" />
        {/* Appointments */}
        <HealthCareCard type="appointments" />

        {/* Prescriptions */}
        {canAccessRx && (
          <Prescriptions
            prescriptions={prescriptions}
            authenticatedWithSSOe={authenticatedWithSSOe}
          />
        )}
      </div>

      <div className="vads-u-margin-top--4">
        <h3>Manage your health care benefits</h3>
        <hr
          aria-hidden="true"
          className="vads-u-background-color--primary vads-u-margin-bottom--2 vads-u-margin-top--0p5 vads-u-border--0"
        />

        <p>
          <a
            href={mhvUrl(isAuthenticatedWithSSOe, 'download-my-data')}
            rel="noreferrer noopener"
            target="_blank"
            className="vads-u-margin-bottom--2"
            // onClick={recordEvent()}
          >
            Get your lab and test results
          </a>
        </p>

        <p>
          <a
            href="/health-care/get-medical-records/"
            // onClick={recordDashboardClick('health-records')}
          >
            Get your VA medical records
          </a>
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const rxState = state.health.rx;
  const profileState = state.user.profile;
  const canAccessRx = profileState.services.includes('rx');
  const prescriptions = rxState.prescriptions?.items;

  return {
    prescriptions,
    canAccessRx,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

const mapDispatchToProps = {
  loadPrescriptions: loadPrescriptionsAction,
};

HealthCare.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  canAccessRx: PropTypes.bool.isRequired,
  prescriptions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        dispensedDate: PropTypes.string,
        expirationDate: PropTypes.string.isRequired,
        facilityName: PropTypes.string.isRequired,
        isRefillable: PropTypes.bool.isRequired,
        isTrackable: PropTypes.bool.isRequired,
        orderedDate: PropTypes.string.isRequired,
        prescriptionId: PropTypes.number.isRequired,
        prescriptionName: PropTypes.string.isRequired,
        prescriptionNumber: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        refillDate: PropTypes.string.isRequired,
        refillRemaining: PropTypes.number.isRequired,
        refillStatus: PropTypes.string.isRequired,
        refillSubmitDate: PropTypes.string,
        stationNumber: PropTypes.string.isRequired,
      }),
      id: PropTypes.string.isRequired,
    }),
  ),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCare);
export { HealthCare };
