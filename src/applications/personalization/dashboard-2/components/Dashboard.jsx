import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import '../sass/dashboard.scss';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

import { focusElement } from '~/platform/utilities/ui';
import {
  isLOA3 as isLOA3Selector,
  isLOA1 as isLOA1Selector,
  isVAPatient as isVAPatientSelector,
} from '~/platform/user/selectors';
import RequiredLoginView, {
  RequiredLoginLoader,
} from '~/platform/user/authorization/components/RequiredLoginView';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  DowntimeNotification,
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';

import NameTag from '~/applications/personalization/components/NameTag';
import IdentityNotVerified from '~/applications/personalization/components/IdentityNotVerified';
import { fetchTotalDisabilityRating as fetchTotalDisabilityRatingAction } from '~/applications/personalization/rated-disabilities/actions';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
} from '@@profile/actions';

import useDowntimeApproachingRenderMethod from '../useDowntimeApproachingRenderMethod';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';

const Dashboard = ({
  fetchFullName,
  fetchMilitaryInformation,
  fetchTotalDisabilityRating,
  isLOA3,
  showLoader,
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

              <h1
                id="dashboard-title"
                data-testid="dashboard-title"
                tabIndex="-1"
              >
                My VA
              </h1>

              {props.showValidateIdentityAlert && (
                <div className="vads-l-row">
                  <div className="vads-l-col--12 medium-screen:vads-l-col--8">
                    <IdentityNotVerified alertHeadline="Verify your identity to access more VA.gov tools and features" />
                  </div>
                </div>
              )}
              {props.showClaimsAndAppeals && <ClaimsAndAppeals />}
              {props.showHealthCare && <HealthCare />}
              <ApplyForBenefits />
            </div>
          </div>
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

const mapStateToProps = state => {
  const { isReady: hasLoadedScheduledDowntime } = state.scheduledDowntime;
  const isLOA3 = isLOA3Selector(state);
  const isLOA1 = isLOA1Selector(state);
  const isVAPatient = isVAPatientSelector(state);
  const hero = state.vaProfile?.hero;
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
  // TODO: expand on these flags depending on the contents of the user object.
  // eg, we will need to show claims and appeals if they have those services
  // available. And we will need to show the health care section if they are a
  // patient and/or have rx or msg services available
  const showClaimsAndAppeals = isLOA3;
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
    user: state.user,
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
