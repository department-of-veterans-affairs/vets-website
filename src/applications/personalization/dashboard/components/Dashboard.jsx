import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import '../sass/dashboard.scss';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
} from '@@profile/actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
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
import useDowntimeApproachingRenderMethod from '../useDowntimeApproachingRenderMethod';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';
import CTALink from './CTALink';
import BenefitPaymentsAndDebt from './benefit-payments-and-debts/BenefitPaymentsAndDebt';
import DashboardWidgetWrapper from './DashboardWidgetWrapper';
import { getAllPayments } from '../actions/payments';
import Notifications from './notifications/Notifications';

const renderWidgetDowntimeNotification = (downtime, children) => {
  if (downtime.status === externalServiceStatus.down) {
    return (
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
          <va-alert status="error">
            <h2 slot="headline">
              We can’t access any claims or appeals information right now
            </h2>
            <div>
              <p>
                We’re sorry. We’re working to fix some problems with the claims
                or appeals tool right now and cannot display your information on
                this page. Please check back after{' '}
                {downtime.endTime.format('MMMM D [at] LT')}
              </p>
            </div>
          </va-alert>
        </div>
      </div>
    );
  }
  return children;
};

const DashboardHeader = ({ showNotifications, paymentsError }) => {
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
      {paymentsError && (
        <DashboardWidgetWrapper>
          <div
            className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-top--2p5"
            data-testid="payments-error"
          >
            <va-alert status="error" show-icon className="vads-u-margin-top--0">
              We’re sorry. We can’t access some of your financial information
              right now. We’re working to fix this problem. Please check back
              later.
            </va-alert>
          </div>
        </DashboardWidgetWrapper>
      )}
      {showNotifications && <Notifications />}
    </div>
  );
};

DashboardHeader.propTypes = {
  paymentsError: PropTypes.bool,
  showNotifications: PropTypes.bool,
};

const Dashboard = ({
  fetchFullName,
  fetchMilitaryInformation,
  fetchTotalDisabilityRating,
  getPayments,
  isLOA3,
  payments,
  paymentsError,
  showLoader,
  showMPIConnectionError,
  showNameTag,
  showNotInMPIError,
  showBenefitPaymentsAndDebt,
  showNotifications,
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

  // fetch data when we determine they are LOA3
  useEffect(
    () => {
      if (showBenefitPaymentsAndDebt) {
        getPayments();
      }
    },
    [getPayments, showBenefitPaymentsAndDebt],
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
              <DashboardHeader
                paymentsError={paymentsError}
                showNotifications={showNotifications}
              />

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

              {showBenefitPaymentsAndDebt ? (
                <BenefitPaymentsAndDebt
                  payments={payments}
                  showNotifications={showNotifications}
                />
              ) : null}

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
  const showBenefitPaymentsAndDebt =
    !showMPIConnectionError && !showNotInMPIError && isLOA3;

  const hasNotificationFeature = toggleValues(state)[
    FEATURE_FLAG_NAMES.showDashboardNotifications
  ];

  const showNotifications =
    !!hasNotificationFeature &&
    !showMPIConnectionError &&
    !showNotInMPIError &&
    isLOA3;

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
    showBenefitPaymentsAndDebt,
    showNotifications,
    payments: state.allPayments.payments?.payments || [],
    paymentsError: state.allPayments.error,
  };
};

Dashboard.propTypes = {
  fetchFullName: PropTypes.func,
  fetchMilitaryInformation: PropTypes.func,
  fetchTotalDisabilityRating: PropTypes.func,
  getPayments: PropTypes.func,
  isLOA3: PropTypes.bool,
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      payCheckAmount: PropTypes.string.isRequired,
      payCheckDt: PropTypes.string.isRequired,
      payCheckId: PropTypes.string.isRequired,
      payCheckReturnFiche: PropTypes.string.isRequired,
      payCheckType: PropTypes.string.isRequired,
      paymentMethod: PropTypes.string.isRequired,
      bankName: PropTypes.string.isRequired,
      accountNumber: PropTypes.string.isRequired,
    }),
  ),
  paymentsError: PropTypes.bool,
  showBenefitPaymentsAndDebt: PropTypes.bool,
  showClaimsAndAppeals: PropTypes.bool,
  showHealthCare: PropTypes.bool,
  showLoader: PropTypes.bool,
  showMPIConnectionError: PropTypes.bool,
  showNameTag: PropTypes.bool,
  showNotInMPIError: PropTypes.bool,
  showNotifications: PropTypes.bool,
  showValidateIdentityAlert: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
  user: PropTypes.object,
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchTotalDisabilityRating: fetchTotalDisabilityRatingAction,
  getPayments: getAllPayments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
