import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import '../sass/dashboard.scss';

import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import recordEvent from '~/platform/monitoring/record-event';
import { focusElement } from '~/platform/utilities/ui';
import {
  createIsServiceAvailableSelector,
  isLOA3 as isLOA3Selector,
  isLOA1 as isLOA1Selector,
  isVAPatient as isVAPatientSelector,
  hasMPIConnectionError,
  isNotInMPI,
} from '~/platform/user/selectors';
import RequiredLoginView, {
  RequiredLoginLoader,
} from '~/platform/user/authorization/components/RequiredLoginView';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  DowntimeNotification,
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import externalServiceStatus from '~/platform/monitoring/DowntimeNotification/config/externalServiceStatus';

import NameTag from '~/applications/personalization/components/NameTag';
import MPIConnectionError from '~/applications/personalization/components/MPIConnectionError';
import NotInMPIError from '~/applications/personalization/components/NotInMPIError';
import IdentityNotVerified from '~/applications/personalization/components/IdentityNotVerified';
import { fetchTotalDisabilityRating as fetchTotalDisabilityRatingAction } from '~/applications/personalization/rated-disabilities/actions';
import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
} from '@@profile/actions';

import useDowntimeApproachingRenderMethod from '../useDowntimeApproachingRenderMethod';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';
import CTALink from './CTALink';

const renderWidgetDowntimeNotification = (downtime, children) => {
  if (downtime.status === externalServiceStatus.down) {
    return (
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
          <AlertBox
            status={ALERT_TYPE.ERROR}
            headline="We can’t access any claims or appeals information right now"
          >
            We’re sorry. We’re working to fix some problems with the claims or
            appeals tool right now and cannot display your information on this
            page. Please check back after{' '}
            {downtime.endTime.format('MMMM D [at] LT')}
          </AlertBox>
        </div>
      </div>
    );
  }
  return children;
};

const DashboardHeader = () => {
  return (
    <div>
      <h1
        id="dashboard-title"
        data-testid="dashboard-title"
        tabIndex="-1"
        className="vads-u-margin--0 vads-u-margin-top--2 medium-screen:vads-u-margin-top--3"
      >
        My VA
      </h1>
      <CTALink
        href="/profile"
        text="Go to your profile"
        className="vads-u-margin-top--2"
        onClick={() => {
          recordEvent({
            event: 'dashboard-navigation',
            'dashboard-action': 'view-link',
            'dashboard-product': 'view-your-profile',
          });
        }}
      />
    </div>
  );
};

const Dashboard = ({
  fetchFullName,
  fetchMilitaryInformation,
  fetchTotalDisabilityRating,
  isLOA3,
  showLoader,
  showMPIConnectionError,
  showNameTag,
  showNotInMPIError,
  ...props
}) => {
  const downtimeApproachingRenderMethod = useDowntimeApproachingRenderMethod();

  // TODO: remove this after My VA v2 is rolled out to 100% of users and My VA
  // v1 is retired
  useEffect(() => {
    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'My VA v2',
    });
  }, []);

  // focus on the name tag or the header when we are done loading
  useEffect(
    () => {
      if (!showLoader) {
        if (showNameTag) {
          focusElement('#name-tag');
        } else {
          focusElement('#dashboard-title');
        }
      }
    },
    [showLoader, showNameTag],
  );

  // fetch data when we determine they are LOA3
  useEffect(
    () => {
      if (isLOA3) {
        fetchFullName();
        fetchMilitaryInformation();
        fetchTotalDisabilityRating();
      }
    },
    [
      isLOA3,
      fetchFullName,
      fetchMilitaryInformation,
      fetchTotalDisabilityRating,
    ],
  );

  return (
    <RequiredLoginView
      serviceRequired={[backendServices.USER_PROFILE]}
      user={props.user}
    >
      <DowntimeNotification
        appTitle="user dashboard"
        loadingIndicator={<RequiredLoginLoader />}
        dependencies={[
          externalServices.mvi,
          externalServices.mhv,
          externalServices.appeals,
        ]}
        render={downtimeApproachingRenderMethod}
      >
        {showLoader && <RequiredLoginLoader />}
        {!showLoader && (
          <div className="dashboard">
            {showNameTag && (
              <div id="name-tag">
                <NameTag
                  totalDisabilityRating={props.totalDisabilityRating}
                  totalDisabilityRatingServerError={
                    props.totalDisabilityRatingServerError
                  }
                />
              </div>
            )}
            <div className="vads-l-grid-container vads-u-padding-x--1 vads-u-padding-bottom--3 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--4">
              <DashboardHeader />

              {showMPIConnectionError ? (
                <div className="vads-l-row">
                  <MPIConnectionError
                    className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3"
                    level={2}
                  />
                </div>
              ) : null}

              {showNotInMPIError ? (
                <div className="vads-l-row">
                  <NotInMPIError
                    className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3"
                    level={2}
                  />
                </div>
              ) : null}

              {props.showValidateIdentityAlert ? (
                <div className="vads-l-row">
                  <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
                    <IdentityNotVerified
                      alertHeadline="Verify your identity to access more VA.gov tools and features"
                      level={2}
                    />
                  </div>
                </div>
              ) : null}

              {props.showClaimsAndAppeals ? (
                <DowntimeNotification
                  dependencies={[
                    externalServices.mhv,
                    externalServices.appeals,
                  ]}
                  render={renderWidgetDowntimeNotification}
                >
                  <ClaimsAndAppeals />
                </DowntimeNotification>
              ) : null}

              {props.showHealthCare ? <HealthCare /> : null}

              <ApplyForBenefits />
            </div>
          </div>
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

const isClaimsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);
const isAppealsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.APPEALS_STATUS,
);

const mapStateToProps = state => {
  const { isReady: hasLoadedScheduledDowntime } = state.scheduledDowntime;
  const isLOA3 = isLOA3Selector(state);
  const isLOA1 = isLOA1Selector(state);
  const isVAPatient = isVAPatientSelector(state);
  const hero = state.vaProfile?.hero;
  const hasClaimsOrAppealsService =
    isAppealsAvailableSelector(state) || isClaimsAvailableSelector(state);
  const hasLoadedMilitaryInformation = state.vaProfile?.militaryInformation;
  const hasLoadedFullName = !!hero;

  const hasLoadedDisabilityRating = state.totalRating?.loading === false;

  const hasLoadedAllData =
    // we do not need to fetch additional data if they are only LOA1
    isLOA1 ||
    (hasLoadedMilitaryInformation &&
      hasLoadedFullName &&
      hasLoadedDisabilityRating);

  const showLoader = !hasLoadedScheduledDowntime || !hasLoadedAllData;
  const showValidateIdentityAlert = isLOA1;
  const showNameTag = isLOA3 && isEmpty(hero?.errors);
  const showMPIConnectionError = hasMPIConnectionError(state);
  const showNotInMPIError = isNotInMPI(state);
  const showClaimsAndAppeals =
    !showMPIConnectionError &&
    !showNotInMPIError &&
    isLOA3 &&
    hasClaimsOrAppealsService;
  const showHealthCare =
    !showMPIConnectionError && !showNotInMPIError && isLOA3 && isVAPatient;

  return {
    isLOA3,
    showLoader,
    showValidateIdentityAlert,
    showClaimsAndAppeals,
    showHealthCare,
    showNameTag,
    hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
    user: state.user,
    showMPIConnectionError,
    showNotInMPIError,
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchTotalDisabilityRating: fetchTotalDisabilityRatingAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
