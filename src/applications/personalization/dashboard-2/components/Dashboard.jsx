import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import '../sass/dashboard.scss';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import { focusElement } from '~/platform/utilities/ui';
import {
  createIsServiceAvailableSelector,
  isLOA3 as isLOA3Selector,
  isLOA1 as isLOA1Selector,
  isVAPatient as isVAPatientSelector,
  hasMPIConnectionError,
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
import HealthCareLoadError from './health-care/HealthCareLoadError';
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

const Dashboard = ({
  fetchFullName,
  fetchMilitaryInformation,
  fetchTotalDisabilityRating,
  isLOA3,
  showLoader,
  showHealthCareError,
  ...props
}) => {
  const downtimeApproachingRenderMethod = useDowntimeApproachingRenderMethod();

  // focus on the header when we are done loading
  useEffect(
    () => {
      if (!showLoader) {
        focusElement('#dashboard-title');
      }
    },
    [showLoader],
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
            {props.showNameTag && (
              <NameTag
                showUpdatedNameTag
                totalDisabilityRating={props.totalDisabilityRating}
                totalDisabilityRatingServerError={
                  props.totalDisabilityRatingServerError
                }
              />
            )}
            <div className="vads-l-grid-container vads-u-padding-bottom--3 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--4 small-desktop-screen:vads-u-padding-x--0">
              <Breadcrumbs className="vads-u-padding-x--0 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0">
                <a href="/" key="home">
                  Home
                </a>
                <span className="vads-u-color--black" key="dashboard">
                  <strong>My VA</strong>
                </span>
              </Breadcrumbs>

              <div className="medium-screen:vads-u-display--flex medium-screen:vads-u-justify-content--space-between medium-screen:vads-u-align-items--center">
                <h1
                  id="dashboard-title"
                  data-testid="dashboard-title"
                  tabIndex="-1"
                  className="vads-u-margin--0"
                >
                  My VA
                </h1>
                <CTALink
                  href="/profile"
                  text="Go to your profile"
                  className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--0"
                />
              </div>

              {showHealthCareError ? (
                <div className="vads-l-row">
                  <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
                    <HealthCareLoadError />
                  </div>
                </div>
              ) : null}

              {props.showValidateIdentityAlert ? (
                <div className="vads-l-row">
                  <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
                    <IdentityNotVerified alertHeadline="Verify your identity to access more VA.gov tools and features" />
                  </div>
                </div>
              ) : null}
              {props.showClaimsAndAppeals && (
                <DowntimeNotification
                  dependencies={[
                    externalServices.mhv,
                    externalServices.appeals,
                  ]}
                  render={renderWidgetDowntimeNotification}
                >
                  <ClaimsAndAppeals />
                </DowntimeNotification>
              )}
              {props.showHealthCare && !showHealthCareError && <HealthCare />}
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
  const showClaimsAndAppeals = isLOA3 && hasClaimsOrAppealsService;
  const showHealthCare = isLOA3 && isVAPatient;

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
    // TODO: possibly revise this to block both the health care and the claims
    // and appeals content if hasMPIConnectionError() is true. If we do that, we
    // will also have to update the error we show to be more generic.
    //
    // More info in this issue comment:
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/22568#issuecomment-817992382
    showHealthCareError: hasMPIConnectionError(state),
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
