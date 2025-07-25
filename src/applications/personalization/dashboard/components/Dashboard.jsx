import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
} from '@@profile/actions';
import {
  VaAlert,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import { connectDrupalSourceOfTruthCerner } from '~/platform/utilities/cerner/dsot';
import recordEvent from '~/platform/monitoring/record-event';
import { focusElement } from '~/platform/utilities/ui';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import {
  createIsServiceAvailableSelector,
  isLOA3 as isLOA3Selector,
  isLOA1 as isLOA1Selector,
  isVAPatient as isVAPatientSelector,
  hasMPIConnectionError,
  isNotInMPI,
} from '~/platform/user/selectors';
import {
  RequiredLoginView,
  RequiredLoginLoader,
} from '~/platform/user/authorization/components/RequiredLoginView';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  DowntimeNotification,
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';

import NameTag from '~/applications/personalization/components/NameTag';
import MPIConnectionError from '~/applications/personalization/components/MPIConnectionError';
import NotInMPIError from '~/applications/personalization/components/NotInMPIError';
import IdentityNotVerified from '~/platform/user/authorization/components/IdentityNotVerified';
import { fetchTotalDisabilityRating as fetchTotalDisabilityRatingAction } from '../../common/actions/ratedDisabilities';
import { hasTotalDisabilityError } from '../../common/selectors/ratedDisabilities';
import { API_NAMES } from '../../common/constants';
import useDowntimeApproachingRenderMethod from '../useDowntimeApproachingRenderMethod';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';
import CTALink from './CTALink';
import BenefitPaymentsLegacy from './benefit-payments/BenefitPaymentsLegacy';
import Debts from './debts/Debts';
import { getAllPayments } from '../actions/payments';
import Notifications from './notifications/Notifications';
import { canAccess } from '../../common/selectors';
import RenderClaimsWidgetDowntimeNotification from './RenderClaimsWidgetDowntimeNotification';
import BenefitApplications from './benefit-application-drafts/BenefitApplications';
import EducationAndTraining from './education-and-training/EducationAndTraining';
import { ContactInfoNeeded } from '../../profile/components/alerts/ContactInfoNeeded';
import FormsAndApplications from './benefit-application-drafts/FormsAndApplications';
import PaymentsAndDebts from './benefit-payments/PaymentsAndDebts';

const DashboardHeader = ({ isLOA3, showNotifications, user }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const hideNotificationsSection = useToggleValue(
    TOGGLE_NAMES.myVaHideNotificationsSection,
  );
  const displayOnboardingInformation = useToggleValue(
    TOGGLE_NAMES.veteranOnboardingBetaFlow,
  );

  return (
    <div>
      {displayOnboardingInformation && (
        <VaAlert status="info" visible className="vads-u-margin-top--4">
          <h2> Welcome to VA, {user.profile.userFullName.first}</h2>
          <p>
            We understand that transitioning out of the military can be a
            daunting experience, which is why we offer a range of resources to
            help you discover and apply for the benefits you deserve.
          </p>
          <div className="vads-l-row">
            <div className="vads-l-col--4">
              <a
                className="vads-c-action-link--green"
                href="/profile/contact-information"
              >
                Add your contact information
              </a>
            </div>
            <div className="vads-l-col--8">
              <a
                className="vads-c-action-link--green"
                href="/get-help-from-accredited-representative/find-rep"
              >
                Find a representative
              </a>
            </div>
          </div>
        </VaAlert>
      )}

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
      {isLOA3 && <ContactInfoNeeded />}
      {showNotifications && !hideNotificationsSection && <Notifications />}
    </div>
  );
};

const LOA1Content = ({
  isLOA1,
  isVAPatient,
  welcomeModalVisible,
  dismissWelcomeModal,
  user,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showWelcomeToMyVaMessage = useToggleValue(
    TOGGLE_NAMES.veteranOnboardingShowWelcomeMessageToNewUsers,
  );

  const userCreationTime = new Date(user.profile.initialSignIn);
  const oneDayLater = new Date(
    userCreationTime.getTime() + 24 * 60 * 60 * 1000,
  );
  const currentDate = new Date();
  const userIsNew =
    currentDate.getTime() > userCreationTime.getTime() &&
    currentDate.getTime() < oneDayLater.getTime();

  return (
    <>
      <div className="vads-l-row">
        <div className="small-screen:vads-l-col--12 medium-screen:vads-l-col--10">
          <IdentityNotVerified />
        </div>
      </div>

      <ClaimsAndAppeals isLOA1={isLOA1} />

      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Disabled>
          <HealthCare isVAPatient={isVAPatient} isLOA1={isLOA1} />
        </Toggler.Disabled>
      </Toggler>

      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Disabled>
          <EducationAndTraining isLOA1={isLOA1} />
        </Toggler.Disabled>
      </Toggler>

      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Disabled>
          <BenefitApplications />
        </Toggler.Disabled>
        <Toggler.Enabled>
          <FormsAndApplications />
        </Toggler.Enabled>
      </Toggler>

      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          <HealthCare isVAPatient={isVAPatient} isLOA1={isLOA1} />
        </Toggler.Enabled>
      </Toggler>

      {showWelcomeToMyVaMessage &&
        userIsNew && (
          <VaModal
            large
            modalTitle="Welcome to My VA"
            onCloseEvent={dismissWelcomeModal}
            onPrimaryButtonClick={dismissWelcomeModal}
            primaryButtonText="Continue"
            visible={welcomeModalVisible}
            data-testid="welcome-modal"
          >
            <p>
              We’ll help you get started managing your benefits and information
              online, as well as help you find resources and support. Once you
              have applications or claims in process, you’ll be able to check
              status here at My VA.
            </p>
          </VaModal>
        )}
    </>
  );
};

DashboardHeader.propTypes = {
  isLOA3: PropTypes.bool,
  showNotifications: PropTypes.bool,
  user: PropTypes.object,
};

LOA1Content.propTypes = {
  dismissWelcomeModal: PropTypes.func,
  isLOA1: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  user: PropTypes.object,
  welcomeModalVisible: PropTypes.bool,
};

const Dashboard = ({
  canAccessMilitaryHistory,
  canAccessPaymentHistory,
  canAccessRatingInfo,
  fetchFullName,
  fetchMilitaryInformation,
  fetchTotalDisabilityRating,
  getPayments,
  isLOA3,
  isLOA1,
  payments,
  showLoader,
  showMPIConnectionError,
  showNameTag,
  showNotInMPIError,
  showNotifications,
  isVAPatient,
  user,
  ...props
}) => {
  const downtimeApproachingRenderMethod = useDowntimeApproachingRenderMethod();
  const dispatch = useDispatch();

  const [welcomeModalVisible, setWelcomeModalVisible] = useState(
    !localStorage.getItem('welcomeToMyVAModalIsDismissed'),
  );
  const dismissWelcomeModal = () => {
    setWelcomeModalVisible(false);
    localStorage.setItem('welcomeToMyVAModalIsDismissed', 'true');
  };

  useEffect(
    () => {
      // use Drupal based Cerner facility data
      connectDrupalSourceOfTruthCerner(dispatch);
    },
    [dispatch],
  );

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
        if (canAccessMilitaryHistory) {
          fetchMilitaryInformation();
        }
        if (canAccessRatingInfo) {
          fetchTotalDisabilityRating();
        }
      }
    },
    [
      canAccessMilitaryHistory,
      canAccessRatingInfo,
      isLOA3,
      fetchFullName,
      fetchMilitaryInformation,
      fetchTotalDisabilityRating,
    ],
  );

  // fetch data when we determine they are LOA3
  useEffect(
    () => {
      if (canAccessPaymentHistory) {
        getPayments();
      }
    },
    [canAccessPaymentHistory, getPayments],
  );

  return (
    <RequiredLoginView
      serviceRequired={[backendServices.USER_PROFILE]}
      user={user}
      showProfileErrorMessage
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
            <Toggler
              toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
            >
              <Toggler.Disabled>
                {showNameTag && (
                  <div id="name-tag">
                    <NameTag
                      totalDisabilityRating={props.totalDisabilityRating}
                      totalDisabilityRatingError={
                        props.totalDisabilityRatingError
                      }
                    />
                  </div>
                )}
              </Toggler.Disabled>
            </Toggler>
            <div className="vads-l-grid-container vads-u-padding-x--1 vads-u-padding-bottom--3 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--4">
              <DashboardHeader
                isLOA3={isLOA3}
                showNotifications={showNotifications}
                user={props.user}
              />

              {showMPIConnectionError && (
                <div className="vads-l-row">
                  <MPIConnectionError className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3 vads-u-margin-top--3" />
                </div>
              )}

              {showNotInMPIError && (
                <div className="vads-l-row">
                  <NotInMPIError
                    className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3 vads-u-margin-top--3"
                    level={2}
                  />
                </div>
              )}

              {/* LOA1 user experience */}
              {isLOA1 && (
                <LOA1Content
                  isLOA1={isLOA1}
                  isVAPatient={isVAPatient}
                  welcomeModalVisible={welcomeModalVisible}
                  dismissWelcomeModal={dismissWelcomeModal}
                  user={user}
                />
              )}

              {/* LOA3 user experience */}
              {props.showClaimsAndAppeals && (
                <DowntimeNotification
                  dependencies={[
                    externalServices.mhv,
                    externalServices.appeals,
                  ]}
                  render={RenderClaimsWidgetDowntimeNotification}
                >
                  <ClaimsAndAppeals />
                </DowntimeNotification>
              )}
              {isLOA3 && (
                <Toggler
                  toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
                >
                  <Toggler.Disabled>
                    <HealthCare isVAPatient={isVAPatient} />
                    <Debts />
                    <BenefitPaymentsLegacy
                      payments={payments}
                      showNotifications={showNotifications}
                    />
                    <EducationAndTraining />
                    <BenefitApplications />
                  </Toggler.Disabled>
                  <Toggler.Enabled>
                    <FormsAndApplications />
                    <HealthCare isVAPatient={isVAPatient} />
                    <PaymentsAndDebts
                      payments={payments}
                      showNotifications={showNotifications}
                    />
                  </Toggler.Enabled>
                </Toggler>
              )}

              <Toggler
                toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
              >
                <Toggler.Enabled>
                  <div className="vads-u-margin-top--6 vads-u-padding-y--1 vads-u-padding-x--3">
                    <h2 className="vads-u-font-size--h3 vads-u-margin--0 vads-u-margin-bottom--1 vads-u-padding-top--1 vads-u-padding-bottom--0p5 vads-u-border-bottom--2px vads-u-border-color--primary">
                      Common tasks
                    </h2>
                    <ul className="usa-unstyled-list">
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/records/download-va-letters/letters"
                          text="Download your VA letters and documents (including DD 214)"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/health-care/file-travel-pay-reimbursement"
                          text="File for travel reimbursement"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/education/gi-bill/post-9-11/ch-33-benefit/status"
                          text="Check your Post-9/11 GI Bill benefits"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/view-change-dependents/view"
                          text="View or change VA dependents"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/family-and-caregiver-benefits/education-and-careers/dependents-education-assistance/rates"
                          text="Get current Chapter 35 rates for survivors and dependents"
                        />
                      </li>
                    </ul>
                  </div>

                  <div className="vads-u-margin-top--6 vads-u-padding-y--1 vads-u-padding-x--3 vads-u-background-color--gray-lightest">
                    <h2 className="vads-u-font-size--h3 vads-u-margin--0 vads-u-margin-bottom--1 vads-u-padding-top--1 vads-u-padding-bottom--0p5 vads-u-border-bottom--1px vads-u-border-color--gray-light">
                      Get Help
                    </h2>
                    <ul className="usa-unstyled-list">
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/resources/helpful-va-phone-numbers"
                          text="Find helpful VA phone numbers"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/contact-us/ask-va/introduction"
                          text="Ask VA"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/get-help-from-accredited-representative"
                          text="Get help from a VA accredited representative or VSO"
                        />
                      </li>
                      <li className="vads-u-padding-y--1">
                        <va-link
                          href="/find-locations"
                          text="Find a VA location"
                        />
                      </li>
                    </ul>
                  </div>
                </Toggler.Enabled>
              </Toggler>
            </div>
          </div>
        )}
      </DowntimeNotification>
    </RequiredLoginView>
  );
};

const isClaimsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.LIGHTHOUSE,
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
  const hasMHVAccount = ['OK', 'MULTIPLE'].includes(
    state.user?.profile?.mhvAccountState,
  );
  const hasLoadedFullName = !!hero;

  const canAccessPaymentHistory = canAccess(state)[API_NAMES.PAYMENT_HISTORY];
  const canAccessRatingInfo = canAccess(state)[API_NAMES.RATING_INFO];
  const canAccessMilitaryHistory = canAccess(state)[API_NAMES.MILITARY_HISTORY];

  const hasLoadedDisabilityRating = canAccessRatingInfo
    ? state.totalRating?.loading === false
    : true;

  const hasLoadedMilitaryInformation = canAccessMilitaryHistory
    ? state.vaProfile?.militaryInformation
    : true;

  const hasLoadedAllData =
    // we do not need to fetch additional data if they are only LOA1
    isLOA1 ||
    (hasLoadedMilitaryInformation &&
      hasLoadedFullName &&
      hasLoadedDisabilityRating);

  const togglesAreLoaded = !toggleValues(state)?.loading;

  const showLoader =
    !hasLoadedScheduledDowntime || !hasLoadedAllData || !togglesAreLoaded;
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
    hasMHVAccount &&
    !showMPIConnectionError &&
    !showNotInMPIError &&
    isLOA3 &&
    isVAPatient;

  const showNotifications =
    !showMPIConnectionError && !showNotInMPIError && isLOA3;

  return {
    canAccessMilitaryHistory,
    canAccessPaymentHistory,
    canAccessRatingInfo,
    isLOA3,
    isLOA1,
    showLoader,
    showValidateIdentityAlert,
    showClaimsAndAppeals,
    showHealthCare,
    isVAPatient,
    showNameTag,
    hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
    totalDisabilityRatingError: hasTotalDisabilityError(state),
    user: state.user,
    showMPIConnectionError,
    showNotInMPIError,
    showNotifications,
    payments: state.allPayments?.payments || [],
  };
};

Dashboard.propTypes = {
  canAccessMilitaryHistory: PropTypes.bool,
  canAccessPaymentHistory: PropTypes.bool,
  canAccessRatingInfo: PropTypes.bool,
  fetchFullName: PropTypes.func,
  fetchMilitaryInformation: PropTypes.func,
  fetchTotalDisabilityRating: PropTypes.func,
  getPayments: PropTypes.func,
  isLOA1: PropTypes.bool,
  isLOA3: PropTypes.bool,
  isVAPatient: PropTypes.bool,
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
  showClaimsAndAppeals: PropTypes.bool,
  showHealthCare: PropTypes.bool,
  showLoader: PropTypes.bool,
  showMPIConnectionError: PropTypes.bool,
  showNameTag: PropTypes.bool,
  showNotInMPIError: PropTypes.bool,
  showNotifications: PropTypes.bool,
  showValidateIdentityAlert: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingError: PropTypes.bool,
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
