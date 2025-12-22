import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectCernerFacilities } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { getCernerURL } from 'platform/utilities/cerner';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  headline, // e.g. 'To get your medical records reports from' or 'To send a secure message to a provider at'
  bodyIntro, // Optional custom intro text (overrides default "Some of your {domain} may be in a different portal.")
  bodyActionSingle, // Optional custom action text for single facility (overrides default "To get your {pageName} from")
  bodyActionMultiple, // Optional custom action text for multiple facilities (overrides default "To get your {pageName} from these facilities")
  forceHideInfoAlert = false,
  infoAlertActionPhrase = 'manage your health care',
  infoAlertHeadline,
  infoAlertText = '',
}) => {
  const userProfile = useSelector(state => state.user.profile);

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

  // Don't render anything if flag is false
  if (!userProfile.userAtPretransitionedOhFacility) {
    return null;
  }

  // Render blue info alert if flag is true and it's not overridden
  if (userProfile.userFacilityReadyForInfoAlert && !forceHideInfoAlert) {
    // use infoAlertHeadline if provided; otherwise compose from infoAlertActionPhrase
    // using a single template.
    const infoAlertComposedHeadline =
      infoAlertHeadline ||
      `You can now ${infoAlertActionPhrase} for all VA facilities right here`;
    const infoAlertComposedText = `We've brought all your VA health care data together so you can manage your care in one place.${
      infoAlertText ? ` ${infoAlertText}` : ''
    }`;
    return (
      <va-alert-expandable
        // Some usages might need extra top margin if there's an API error message above
        class={`vads-u-margin-bottom--2p5 ${className} ${
          apiError ? 'vads-u-margin-top--2' : ''
        }`}
        data-testid="cerner-facilities-info-alert"
        status="info"
        trigger={infoAlertComposedHeadline}
      >
        <div data-testid="cerner-facility-info-text">
          <p>{infoAlertComposedText}</p>
          <p>Still want to use My VA Health for now?</p>
          <va-link
            data-testid="cerner-info-alert-link"
            href={getCernerURL(linkPath, true)}
            text="Go to My VA Health"
          />
        </div>
      </va-alert-expandable>
    );
  }

  // Do not render the yellow alert on the MHV Landing Page
  if (domain === 'mhv-landing-page') {
    return null;
  }

  const isMultipleFacilities = cernerFacilitiesNames.length > 1;
  const isOneFacility = cernerFacilitiesNames.length === 1;

  // Generate default headline
  const defaultHeadline = `${headline} ${
    isMultipleFacilities ? ' these facilities' : ' this facility'
  }, go to My VA Health`;

  // Generate default body intro
  const defaultBodyIntro = `Some of your ${domain} may be in a different portal.`;

  // Generate default action text
  const defaultBodyActionSingle = bodyActionSingle || `${headline} from`;
  const defaultBodyActionMultiple =
    bodyActionMultiple || `${headline} from these facilities`;

  return (
    <va-alert
      // Some usages might need extra top margin if there's an API error message above
      class={`vads-u-margin-bottom--2p5 ${className} ${
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
        <VaLinkAction
          data-testid="cerner-facility-action-link"
          href={getCernerURL(linkPath, true)}
          type="secondary"
          onClick={handleLinkClick}
          text="Go to My VA Health"
          rel="noopener noreferrer"
        />
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
  domain: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  linkPath: PropTypes.string.isRequired,
  apiError: PropTypes.bool,
  bodyActionMultiple: PropTypes.string,
  bodyActionSingle: PropTypes.string,
  bodyIntro: PropTypes.string,
  className: PropTypes.string,
  forceHideInfoAlert: PropTypes.bool,
  infoAlertActionPhrase: PropTypes.string,
  infoAlertHeadline: PropTypes.string,
  infoAlertText: PropTypes.string,
  onLinkClick: PropTypes.func,
};

export default CernerFacilityAlert;
