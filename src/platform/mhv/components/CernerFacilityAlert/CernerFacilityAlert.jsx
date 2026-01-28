import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getCernerURL } from 'platform/utilities/cerner';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MigratingFacilitiesAlerts from './MigratingFacilitiesAlerts';
import {
  CernerAlertContent,
  PretransitionedFacilitiesByVhaId,
} from './constants';

/**
 * Shared Cerner Facility Alert component for MHV applications
 *
 * Usage Examples:
 *
 * import CernerFacilityAlert from 'platform/mhv/components/CernerFacilityAlert/CernerFacilityAlert';
 *
 * // Medical Records:
 * <CernerFacilityAlert
 *   healthTool={"MEDICAL_RECORDS"}
 * />
 *
 * // Medications (with additional props):
 * <CernerFacilityAlert
 *   healthTool="MEDICATIONS"
 *   apiError={prescriptionsApiError}
 *   className="custom-class"
 * />
 *
 * // Secure Messaging (with AAL tracking):
 * <CernerFacilityAlert
 *   healthTool="SECURE_MESSAGING"
 *   onLinkClick={() => submitLaunchMyVaHealthAal()}
 *   className="vads-u-margin-bottom--3 vads-u-margin-top--2"
 * />
 *
 * // Display only migration alerts (hide pretransitioned and info alerts):
 * <CernerFacilityAlert
 *   healthTool="MEDICATIONS"
 *   forceHidePretransitionedAlert={true}
 *   forceHideInfoAlert={true}
 * />
 *
 */
const CernerFacilityAlert = ({
  apiError,
  healthTool,
  onLinkClick,
  className = '',
  forceHidePretransitionedAlert = false,
  forceHideInfoAlert = false,
  forceHideTransitionAlert = false,
}) => {
  const userProfile = useSelector(state => state.user.profile);

  const userFacilities = useSelector(state => state?.user?.profile?.facilities);

  //  This is only used for the yellow "Go to My VA Health" alert
  const cernerFacilitiesNames = useMemo(
    () => {
      return userFacilities
        ?.map(facility => {
          const facilityData =
            PretransitionedFacilitiesByVhaId[facility.facilityId];
          return facilityData?.vamcSystemName;
        })
        .filter(Boolean);
    },
    [userFacilities],
  );

  if (!CernerAlertContent[healthTool]) {
    return null;
  }

  const {
    pageName,
    linkPath,
    headline,
    bodyIntro,
    bodyActionSingle,
    bodyActionMultiple,
    infoAlertActionPhrase = 'manage your health care',
    infoAlertHeadline,
    infoAlertText = '',
  } = CernerAlertContent[healthTool];

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  // Don't render anything if flags are false
  if (
    !userProfile.userAtPretransitionedOhFacility &&
    !userProfile.userFacilityMigratingToOh
  ) {
    return null;
  }

  if (userProfile.userFacilityMigratingToOh && !forceHideTransitionAlert) {
    const migratingFacilities =
      userProfile.migrationSchedules.length > 0
        ? userProfile.migrationSchedules
        : [];

    return (
      <MigratingFacilitiesAlerts
        healthTool={healthTool}
        migratingFacilities={migratingFacilities}
        className={className}
      />
    );
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
            href={
              linkPath ? getCernerURL(linkPath, true) : getCernerURL('/', true)
            }
            text="Go to My VA Health"
          />
        </div>
      </va-alert-expandable>
    );
  }

  if (
    userProfile.userAtPretransitionedOhFacility &&
    !forceHidePretransitionedAlert
  ) {
    const isMultipleFacilities = cernerFacilitiesNames.length > 1;
    const isOneFacility = cernerFacilitiesNames.length === 1;

    // Generate default headline
    const defaultHeadline = `${headline} ${
      isMultipleFacilities ? ' these facilities' : ' this facility'
    }, go to My VA Health`;

    // Generate default body intro
    const defaultBodyIntro = `Some of your ${pageName} may be in a different portal.`;

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
                {bodyIntro || defaultBodyIntro} {defaultBodyActionMultiple}, go
                to My VA Health:
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
            disabling your browser’s pop-up blocker or signing in to My VA
            Health with the same account you used to sign in to VA.gov.
          </p>
        </div>
      </va-alert>
    );
  }

  return null;
};

CernerFacilityAlert.propTypes = {
  apiError: PropTypes.bool,
  className: PropTypes.string,
  forceHidePretransitionedAlert: PropTypes.bool,
  forceHideInfoAlert: PropTypes.bool,
  forceHideTransitionAlert: PropTypes.bool,
  healthTool: PropTypes.string,
  onLinkClick: PropTypes.func,
};

export default CernerFacilityAlert;
