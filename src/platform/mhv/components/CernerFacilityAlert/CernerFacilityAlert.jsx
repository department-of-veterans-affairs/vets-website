import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { getCernerURL } from 'platform/utilities/cerner';

/**
 * Shared Cerner Facility Alert component for MHV applications
 *
 * Usage Examples:
 *
 * // Medical Records (using constants - recommended):
 * import { CernerAlertContent } from 'platform/mhv/components/CernerFacilityAlert/constants';
 *
 * <CernerFacilityAlert
 *   {...CernerAlertContent.LABS_AND_TESTS}
 * />
 *
 * // Medications (using constants with additional props):
 * <CernerFacilityAlert
 *   {...CernerAlertContent.MEDICATIONS}
 *   apiError={prescriptionsApiError}
 *   className="custom-class"
 * />
 *
 * // Secure Messaging (using constants with AAL tracking):
 * <CernerFacilityAlert
 *   {...CernerAlertContent.SECURE_MESSAGING}
 *   onLinkClick={() => submitLaunchMyVaHealthAal()}
 *   className="vads-u-margin-bottom--3 vads-u-margin-top--2"
 * />
 *
 * // Custom implementation (not using constants):
 * <CernerFacilityAlert
 *   domain="medical records"
 *   pageName="custom page name"
 *   linkPath="/pages/custom/path"
 *   headlineAction="manage"
 *   bodyIntro="Custom intro text."
 * />
 */
const CernerFacilityAlert = ({
  domain,
  linkPath,
  apiError,
  className = '',
  // Optional callback for when user clicks the link (e.g., for AAL tracking in secure messaging)
  onLinkClick,
  // Optional text customization props for different contexts
  headlineAction = 'To get your medical records reports from', // e.g. 'send a secure message to a provider at'
  bodyIntro, // Optional custom intro text (overrides default "Some of your {domain} may be in a different portal.")
  bodyActionSingle, // Optional custom action text for single facility (overrides default "To get your {pageName} from")
  bodyActionMultiple, // Optional custom action text for multiple facilities (overrides default "To get your {pageName} from these facilities")
}) => {
  const ehrDataByVhaId = useSelector(
    state => state?.drupalStaticData?.vamcEhrData?.data?.ehrDataByVhaId,
  );
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);

  const drupalCernerFacilities = useSelector(selectCernerFacilities);

  const cernerFacilities = useMemo(
    () => {
      return userFacilities?.filter(facility =>
        drupalCernerFacilities?.some(
          f => f.vhaId === facility.facilityId && f.ehr === 'cerner',
        ),
      );
    },
    [userFacilities, drupalCernerFacilities],
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

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  // Don't render if no Cerner facilities
  if (!cernerFacilitiesNames?.length) {
    return null;
  }

  const isMultipleFacilities = cernerFacilitiesNames.length > 1;
  const isOneFacility = cernerFacilitiesNames.length === 1;

  // Generate default headline
  const defaultHeadline = `${headlineAction} ${
    isMultipleFacilities ? ' these facilities' : ' this facility'
  }, go to My VA Health`;

  // Generate default body intro
  const defaultBodyIntro = `Some of your ${domain} may be in a different portal.`;

  // Generate default action text
  const defaultBodyActionSingle = bodyActionSingle || `${headlineAction} from`;
  const defaultBodyActionMultiple =
    bodyActionMultiple || `${headlineAction} from these facilities`;

  return (
    <va-alert
      // Some usages might need extra top margin if there's an API error message above
      className={`vads-u-margin-bottom--2p5 ${className} ${
        apiError ? 'vads-u-margin-top--2' : ''
      }`}
      status="warning"
      background-only
      close-btn-aria-label="Close notification"
      visible
      data-testid="cerner-facilities-alert"
    >
      <h2 className="vads-u-font-size--md" slot="headline">
        {defaultHeadline}
      </h2>
      <div>
        {isMultipleFacilities && (
          <>
            <p>
              {bodyIntro || defaultBodyIntro} {defaultBodyActionMultiple}, go to
              My VA Health:
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
        {isOneFacility && (
          <p data-testid="single-cerner-facility-text">
            {bodyIntro || defaultBodyIntro} {defaultBodyActionSingle}{' '}
            <strong>{cernerFacilitiesNames[0]}</strong>, go to My VA Health.
          </p>
        )}
        <a
          className="vads-c-action-link--blue vads-u-margin-bottom--0p5"
          href={getCernerURL(linkPath, true)}
          onClick={() => handleLinkClick()}
          rel="noopener noreferrer"
        >
          Go to My VA Health
        </a>
        <p>
          <strong>Note:</strong> Having trouble opening up My VA Health? Try
          disabling your browser’s pop-up blocker or signing in to My VA Health
          with the same account you used to sign in to VA.gov.
        </p>
      </div>
    </va-alert>
  );
};

CernerFacilityAlert.propTypes = {
  apiError: PropTypes.bool,
  bodyActionMultiple: PropTypes.string,
  bodyActionSingle: PropTypes.string,
  bodyIntro: PropTypes.string,
  className: PropTypes.string,
  domain: PropTypes.string,
  headlineAction: PropTypes.string,
  linkPath: PropTypes.string,
  onLinkClick: PropTypes.func,
};

export default CernerFacilityAlert;
