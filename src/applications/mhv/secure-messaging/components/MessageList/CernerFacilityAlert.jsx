import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { getCernerURL } from 'platform/utilities/cerner';

const CernerFacilityAlert = () => {
  const cernerFacilities = useSelector(
    state => state.sm.facilities.cernerFacilities,
  );

  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData.vamcEhrData.data.ehrDataByVhaId,
  );

  const cernerFacilitiesNames = useMemo(
    () => {
      return cernerFacilities?.map(facility =>
        getVamcSystemNameFromVhaId(ehrDataByVhaId, facility.uniqueId),
      );
    },
    [cernerFacilities, ehrDataByVhaId],
  );

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

            <a
              className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
              href={getCernerURL('/pages/messaging/inbox', true)}
            >
              Go to My VA Health
            </a>

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
