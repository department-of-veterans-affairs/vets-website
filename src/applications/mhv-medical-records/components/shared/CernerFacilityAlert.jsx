import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { getCernerURL } from 'platform/utilities/cerner';
import useAcceleratedData from '../../hooks/useAcceleratedData';

const CernerFacilityAlert = ({ linkPath, pageName }) => {
  const ehrDataByVhaId = useSelector(
    state => state?.drupalStaticData?.vamcEhrData?.data?.ehrDataByVhaId,
  );
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);

  const drupalCernerFacilities = useSelector(selectCernerFacilities);

  const { isAccelerating } = useAcceleratedData();

  const cernerFacilities = useMemo(() => {
    return userFacilities?.filter(facility =>
      drupalCernerFacilities?.some(
        f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
      ),
    );
  }, [userFacilities, drupalCernerFacilities]);

  const cernerFacilitiesNames = useMemo(() => {
    if (ehrDataByVhaId) {
      return cernerFacilities?.map(facility =>
        getVamcSystemNameFromVhaId(ehrDataByVhaId, facility.facilityId),
      );
    }
    return [];
  }, [cernerFacilities, ehrDataByVhaId]);

  if (isAccelerating) {
    return <></>;
  }

  return (
    <>
      {cernerFacilitiesNames?.length > 0 && (
        <va-alert
          className="vads-u-margin-bottom--2"
          status="warning"
          background-only
          close-btn-aria-label="Close notification"
          visible
          data-testid="cerner-facilities-alert"
        >
          <h2 className="vads-u-font-size--md">
            {`To get your ${pageName} from ${
              cernerFacilitiesNames.length > 1
                ? 'these facilities'
                : 'this facility'
            }, go to My VA Health`}
          </h2>
          <div>
            {cernerFacilitiesNames?.length > 1 && (
              <>
                <p>
                  {`Some of your medical records may be in a different portal. To
                  get your ${pageName} from these facilities, go to My VA Health:`}
                </p>
                <ul>
                  {cernerFacilitiesNames.map((facilityName, i) => (
                    <li data-testid="cerner-facility" key={i}>
                      {facilityName}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {cernerFacilitiesNames?.length === 1 && (
              <p data-testId="single-cerner-facility-text">
                {`Some of your medical records may be in a different portal. To
                get your ${pageName} from`}{' '}
                <strong>{cernerFacilitiesNames[0]}</strong>, go to My VA Health.
              </p>
            )}

            <a
              className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
              href={getCernerURL(linkPath, true)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to My VA Health (opens in new tab)
            </a>
            <p>
              <strong>Note:</strong> Having trouble opening up My VA Health? Try
              disabling your browser’s pop-up blocker or signing in to My VA
              Health with the same account you used to sign in to VA.gov.
            </p>
          </div>
        </va-alert>
      )}
    </>
  );
};

CernerFacilityAlert.propTypes = {
  cernerFacilities: PropTypes.arrayOf(PropTypes.object),
  linkPath: PropTypes.string,
  pageName: PropTypes.string,
};

export default CernerFacilityAlert;
