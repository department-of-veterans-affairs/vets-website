import React from 'react';
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

import CardLayout from './CardLayout';
import HeaderLayout from './HeaderLayout';
import HeaderLayoutPreMilestone2 from './HeaderLayoutPreMilestone2';
import HubLinks from './HubLinks';
import NewsletterSignup from './NewsletterSignup';
import HelpdeskInfo from './HelpdeskInfo';
import Alerts from '../containers/Alerts';
import {
  isLOA3,
  isVAPatient,
  personalizationEnabled,
  isAuthenticatedWithSSOe,
} from '../selectors';
import manifest from '../manifest.json';

const LandingPage = ({ data = {} }) => {
  const { cards = [], hubs = [] } = data;
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const userVerified = useSelector(isLOA3);
  const vaPatient = useSelector(isVAPatient);
  const userRegistered = userVerified && vaPatient;
  const showWelcomeMessage = useSelector(personalizationEnabled);
  const { mhvMilestone2ChangesEnabled = false } = useSelector(
    state => state.featureToggles,
  );

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
          {mhvMilestone2ChangesEnabled ? (
            <HeaderLayout showWelcomeMessage={showWelcomeMessage} />
          ) : (
            <HeaderLayoutPreMilestone2
              showWelcomeMessage={showWelcomeMessage}
              ssoe={ssoe}
              showMhvGoBack={userRegistered}
            />
          )}
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
