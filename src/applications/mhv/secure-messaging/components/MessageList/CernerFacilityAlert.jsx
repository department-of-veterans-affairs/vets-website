import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const CernerFacilityAlert = props => {
  const { cernerFacilities } = props;

  return (
    <>
      {cernerFacilities?.length > 0 && (
        <va-alert
          className="vads-u-margin-bottom--2"
          status="warning"
          background-only
          close-btn-aria-label="Close notification"
          visible
        >
          <h2 className="vads-u-font-size--md">
            Make sure you’re in the right health portal
          </h2>
          <div>
            <p>
              To manage appointments at <strong>Cerner Facility,</strong> go to
              My VA Health.
            </p>
            <Link
              className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
              to="/"
            >
              Go to My VA Health
            </Link>

            <va-additional-info
              trigger="Having trouble opening My VA Health?"
              uswds
            >
              <div>Try these steps:</div>
              <ul>
                <li>Disable your browser’s pop-up blocker</li>
                <li>
                  Sign in to My VA Health with the same account you used to sign
                  in to VA.gov
                </li>
              </ul>
            </va-additional-info>
          </div>
        </va-alert>
      )}
    </>
  );
};

CernerFacilityAlert.propTypes = {
  cernerFacilities: PropTypes.arrayOf(PropTypes.object),
};

export default CernerFacilityAlert;
