import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { getFacilitiesByIds } from '../../api/facilitiesApi';

const CernerFacilityAlert = props => {
  const { cernerFacilities } = props;
  const [facilities, setFacilities] = useState([]);

  const getFacilities = async ids => {
    return getFacilitiesByIds(ids);
  };

  useEffect(
    () => {
      if (cernerFacilities?.length > 0) {
        const ids = cernerFacilities.map(
          facility => `vha_${facility.facilityId}`,
        );
        getFacilities(ids).then(response => {
          setFacilities(response.data);
        });
      }
    },
    [cernerFacilities],
  );

  const cernerFacilitiesNames = useMemo(
    () => {
      return facilities?.map(facility => facility.attributes.name);
    },
    [facilities],
  );

  return (
    <>
      {facilities?.length > 0 && (
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
            {cernerFacilitiesNames?.length > 1 && (
              <>
                <p>
                  To manage appointments at these facilities, go to My VA
                  Health:
                </p>
                <ul>
                  {cernerFacilitiesNames.map((facilityName, i) => (
                    <li key={i}>{facilityName}</li>
                  ))}
                </ul>
              </>
            )}
            {cernerFacilitiesNames?.length === 1 && (
              <p>
                To manage appointments at{' '}
                <strong>{cernerFacilitiesNames[0]}</strong> go to My VA Health.
              </p>
            )}
            <Link
              className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
              to="/" // TODO: What is the correct path to My VA Health?
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
