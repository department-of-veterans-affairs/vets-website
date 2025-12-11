import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { getCernerURL } from 'platform/utilities/cerner';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import { submitLaunchMyVaHealthAal } from '../../api/SmApi';

const CernerFacilityAlert = ({ cernerFacilities }) => {
  const ehrDataByVhaId = useSelector(
    state => state.drupalStaticData.vamcEhrData.data.ehrDataByVhaId,
  );

  const cernerFacilitiesNames = useMemo(
    () => {
      if (ehrDataByVhaId) {
        return cernerFacilities?.map(facility =>
          getVamcSystemNameFromVhaId(ehrDataByVhaId, facility.facilityId),
        );
      }
      return [];
    },
    [cernerFacilities, ehrDataByVhaId],
  );

  const { isAalEnabled } = useFeatureToggles();

  const handleUrlClick = useCallback(
    () => {
      if (isAalEnabled) {
        submitLaunchMyVaHealthAal();
      }
    },
    [isAalEnabled],
  );

  const isMultipleFacilities = cernerFacilitiesNames.length > 1;
  const isOneFacility = cernerFacilitiesNames.length === 1;

  if (!cernerFacilitiesNames?.length) {
    return null;
  }

  const renderMultipleFacilities = () => (
    <>
      <p>
        Some of your secure messages may be in a different portal. To view or
        manage secure messages at these facilities, go to My VA Health:
      </p>
      <ul>
        {cernerFacilitiesNames.map((facilityName, i) => (
          <li data-testid="cerner-facility" key={i}>
            {facilityName}
          </li>
        ))}
      </ul>
    </>
  );

  const renderSingleFacility = () => (
    <p data-testid="single-cerner-facility-text">
      Some of your secure messages may be in a different portal. To send a
      secure message to a provider at{' '}
      <strong>{cernerFacilitiesNames[0]}</strong>, go to My VA Health.
    </p>
  );

  return (
    <>
      <va-alert
        class="vads-u-margin-bottom--3 vads-u-margin-top--2"
        status="warning"
        background-only
        close-btn-aria-label="Close notification"
        visible
        data-testid="cerner-facilities-alert"
      >
        <h2 className="vads-u-font-size--md">
          {`To send a secure message to a provider at ${
            isMultipleFacilities ? 'these facilities' : 'this facility'
          }, go to My VA Health`}
        </h2>
        <div>
          {isMultipleFacilities && renderMultipleFacilities()}
          {isOneFacility && renderSingleFacility()}

          <VaLinkAction
            data-testid="cerner-facility-action-link"
            href={getCernerURL('/pages/messaging/inbox', true)}
            type="secondary"
            onClick={handleUrlClick}
            text="Go to My VA Health"
          />

          <p>
            <strong>Note:</strong> Having trouble opening up My VA Health? Try
            disabling your browser’s pop-up blocker or signing in to My VA
            Health with the same account you used to sign in to VA.gov.
          </p>
        </div>
      </va-alert>
    </>
  );
};

CernerFacilityAlert.propTypes = {
  cernerFacilities: PropTypes.arrayOf(PropTypes.object),
};

export default CernerFacilityAlert;
