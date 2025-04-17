import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { getCernerURL } from 'platform/utilities/cerner';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import PropTypes from 'prop-types';

const CernerFacilityAlert = ({ className = '' }) => {
  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData?.vamcEhrData?.data?.ehrDataByVhaId,
  );
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);
  const drupalCernerFacilities = useSelector(selectCernerFacilities);
  const prescriptionsApiError = useSelector(
    state => state.rx.prescriptions?.apiError,
  );
  const cernerFacilities = useMemo(() => {
    return userFacilities?.filter(facility =>
      drupalCernerFacilities.some(
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
  const detailsText = () => {
    if (!cernerFacilitiesNames) return '';
    if (cernerFacilitiesNames?.length > 1) return 'these facilities';
    return cernerFacilitiesNames[0];
  };
  return (
    <va-alert
      class={`${className} ${
        cernerFacilitiesNames?.length > 0
          ? `vads-u-margin-bottom--2p5 ${
              // Need extra padding if both alerts appear
              prescriptionsApiError ? 'vads-u-margin-top--2' : ''
            }`
          : ''
      }`}
      status="warning"
      visible={cernerFacilitiesNames?.length > 0}
      data-testid="cerner-facilities-alert"
    >
      <h2 className="vads-u-font-size--md">
        To manage medications at{' '}
        {cernerFacilitiesNames?.length > 1
          ? 'these facilities'
          : 'this facility'}
        , go to My VA Health
      </h2>
      <div>
        <p data-testid="single-cerner-facility-text">
          Some of your medications may be in a different portal. To view or
          manage medications at{' '}
          <span
            className={
              cernerFacilitiesNames?.length === 1
                ? 'vads-u-font-weight--bold'
                : ''
            }
          >
            {detailsText()}
          </span>
          , go to My VA Health
          {cernerFacilitiesNames?.length > 1 ? ':' : '.'}
        </p>
        {cernerFacilitiesNames?.length > 1 && (
          <ul>
            {cernerFacilitiesNames.map((facilityName, i) => (
              <li data-testid="cerner-facility" key={i}>
                {facilityName}
              </li>
            ))}
          </ul>
        )}
        <a
          className="vads-c-action-link--blue"
          href={getCernerURL('/pages/medications/current', true)}
        >
          Go to My VA Health (opens in new tab)
        </a>
        <p className="vads-u-margin-bottom--0">
          <strong>Note:</strong> Having trouble opening up My VA Health? Try
          disabling your browser’s pop-up blocker or signing in to My VA Health
          with the same account you used to sign in to VA.gov.
        </p>
      </div>
    </va-alert>
  );
};

CernerFacilityAlert.propTypes = {
  className: PropTypes.string,
};

export default CernerFacilityAlert;
