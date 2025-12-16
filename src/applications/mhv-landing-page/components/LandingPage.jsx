import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  renderMHVDowntime,
  MhvSecondaryNav,
} from '@department-of-veterans-affairs/mhv/exports';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { OH_TRANSITION_FACILITY_IDS } from 'platform/mhv/util/constants';

import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import HelpdeskInfo from './HelpdeskInfo';
import Alerts from '../containers/Alerts';
import {
  isCerner,
  isLOA3,
  isVAPatient,
  personalizationEnabled,
} from '../selectors';
import manifest from '../manifest.json';

const LandingPage = ({ data = {} }) => {
  const { cards = [], hubs = [] } = data;
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const userRegistered = userVerified && vaPatient;
  const showWelcomeMessage = useSelector(personalizationEnabled);
  const userHasCernerFacility = useSelector(isCerner);
  const mhvSecureMessagingOhTransitionAlert = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingOhTransitionAlert
      ],
  );
  const userFacilities = useSelector(state => state?.user?.profile?.facilities);

  // Check if user has a transitional facility (VHA_757)
  const hasTransitionalFacility = useMemo(
    () => {
      return userFacilities?.some(facility =>
        OH_TRANSITION_FACILITY_IDS.BLUE_ALERT.includes(facility.facilityId),
      );
    },
    [userFacilities],
  );

  // Show blue OH transition alert if feature flag is on AND user has transitional facility
  const showOhTransitionAlert =
    mhvSecureMessagingOhTransitionAlert && hasTransitionalFacility;

  return (
    <>
      {userRegistered && <MhvSecondaryNav />}
      <div
        className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--5"
        data-testid="landing-page-container"
      >
        <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
          <VaBreadcrumbs
            homeVeteransAffairs
            breadcrumbList={[
              { label: 'VA.gov home', href: '/' },
              { label: 'My HealtheVet', href: manifest.rootUrl },
            ]}
          />
          <DowntimeNotification
            appTitle={manifest.appName}
            dependencies={[externalServices.mhvPlatform]}
            render={renderMHVDowntime}
          />
          <HeaderLayout
            showWelcomeMessage={showWelcomeMessage}
            isCerner={userHasCernerFacility}
            showOhTransitionAlert={showOhTransitionAlert}
          />
          <Alerts />
          {userRegistered && <CardLayout data={cards} />}
        </div>
        {userRegistered && (
          <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
            <div className="vads-l-row vads-u-margin-top--3">
              <div className="vads-l-col medium-screen:vads-l-col--8">
                <HelpdeskInfo />
              </div>
            </div>
          </div>
        )}
        {userRegistered && <HubLinks hubs={hubs} />}
        {userRegistered && <NewsletterSignup />}
      </div>
    </>
  );
};

LandingPage.propTypes = {
  data: PropTypes.object,
};

export default LandingPage;
