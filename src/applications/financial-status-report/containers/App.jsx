import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { connect, useDispatch } from 'react-redux';
import { selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';

import { setData } from 'platform/forms-system/src/js/actions';
import {
  WIZARD_STATUS_NOT_STARTED,
  WIZARD_STATUS_COMPLETE,
  WIZARD_STATUS_RESTARTED,
  restartShouldRedirect,
} from 'platform/site-wide/wizard';

import formConfig from '../config/form';
import { fetchFormStatus } from '../actions';
import { ErrorAlert } from '../components/alerts/Alerts';
import WizardContainer from '../wizard/WizardContainer';
import { WIZARD_STATUS } from '../wizard/constants';
import {
  fsrLegacyWizardFeatureToggle,
  fsrFeatureToggle,
  reviewPageNavigationFeatureToggle,
} from '../utils/helpers';
import user from '../mocks/user.json';
import useDetectFieldChanges from '../hooks/useDetectFieldChanges';
import useDocumentTitle from '../hooks/useDocumentTitle';

const App = ({
  children,
  formData,
  getFormStatus,
  isError,
  isLoadingFeatures,
  isLoggedIn,
  isStartingOver,
  location,
  pending,
  profile,
  router,
  setFormData,
  showFSR,
  showReviewPageNavigationFeature,
  showLegacyWizard,
}) => {
  const dispatch = useDispatch();
  const { shouldShowReviewButton } = useDetectFieldChanges(formData);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showUpdatedExpensePages = useToggleValue(
    TOGGLE_NAMES.financialStatusReportExpensesUpdate,
  );
  const showStreamlinedWaiver = useToggleValue(
    TOGGLE_NAMES.showFinancialStatusReportStreamlinedWaiver,
  );
  const showStaticWizard = useToggleValue(TOGGLE_NAMES.fsrWizard);

  // Set the document title based on the current page
  useDocumentTitle(location);

  useEffect(
    () => {
      if (formData?.reviewNavigation) {
        dispatch(
          setFormData({
            ...formData,
            reviewNavigation: shouldShowReviewButton,
          }),
        );
      }
    },
    // Do not add formData to the dependency array, as it will cause an infinite loop. Linter warning will go away when feature flag is deprecated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldShowReviewButton, setFormData, formData?.reviewNavigation, dispatch],
  );
  // vapContactInfo is an empty object locally, so mock it
  const contactData = environment.isLocalhost()
    ? user.data.attributes.vet360ContactInformation
    : profile?.vapContactInfo || {};

  const { email = {}, mobilePhone = {}, mailingAddress = {} } = contactData;

  const [wizardState, setWizardState] = useState(
    sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED,
  );

  const setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    setWizardState(value);
  };

  const hasRestarted = () => {
    setWizardStatus(WIZARD_STATUS_RESTARTED);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_RESTARTED);
    router.push('/');
  };

  // Contact information data
  useEffect(
    () => {
      if (isLoggedIn) {
        const { personalData = {} } = formData || {};
        const { veteranContactInformation = {} } = personalData;

        if (
          email?.emailAddress !== veteranContactInformation.email ||
          mobilePhone?.updatedAt !==
            veteranContactInformation.mobilePhone?.updatedAt ||
          mailingAddress?.updatedAt !==
            veteranContactInformation.address?.updatedAt
        ) {
          setFormData({
            ...formData,
            personalData: {
              ...personalData,
              veteranContactInformation: {
                email: email?.emailAddress,
                mobilePhone,
                address: mailingAddress,
              },
            },
          });
        }
      }
    },
    [email, formData, isLoggedIn, mobilePhone, mailingAddress, setFormData],
  );

  useEffect(() => {
    if (restartShouldRedirect(WIZARD_STATUS)) {
      hasRestarted();
    }
  });

  useEffect(
    () => {
      if (showFSR === false) {
        setWizardStatus(WIZARD_STATUS_NOT_STARTED);
      }
    },
    [showFSR],
  );

  useEffect(
    () => {
      getFormStatus();
    },
    [getFormStatus],
  );

  useEffect(
    () => {
      setFormData({
        ...formData,
        'view:enhancedFinancialStatusReport': true,
        'view:streamlinedWaiver': showStreamlinedWaiver,
        'view:streamlinedWaiverAssetUpdate': true,
        'view:reviewPageNavigationToggle': showReviewPageNavigationFeature,
        'view:showUpdatedExpensePages': showUpdatedExpensePages,
      });
    },
    // Do not add formData to the dependency array, as it will cause an infinite loop. Linter warning will go away when feature flag is deprecated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isStartingOver,
      setFormData,
      showReviewPageNavigationFeature,
      showStreamlinedWaiver,
      showUpdatedExpensePages,
    ],
  );

  if (pending) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your information..."
        set-focus
      />
    );
  }

  if (isLoadingFeatures) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading features..."
        set-focus
      />
    );
  }

  if (isLoggedIn && isError) {
    return <ErrorAlert />;
  }

  if (
    !showStaticWizard &&
    showLegacyWizard &&
    wizardState !== WIZARD_STATUS_COMPLETE
  ) {
    return (
      <WizardContainer setWizardStatus={setWizardStatus} showFSR={showFSR} />
    );
  }

  return showFSR ? (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <MetaTags>
        {/* TODO: used to prevent staging form being indexed remove once merged to prod */}
        <meta name="robots" content="noindex" />
        <meta
          name="keywords"
          content="repay debt, debt, debt letters, FSR, financial status report, debt forgiveness, compromise, waiver, monthly offsets, education loans repayment"
        />
      </MetaTags>

      {children}
    </RoutedSavableApp>
  ) : null;
};

App.propTypes = {
  children: PropTypes.object,
  formData: PropTypes.object,
  getFormStatus: PropTypes.func,
  isError: PropTypes.bool,
  isLoadingFeatures: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  isStartingOver: PropTypes.bool,
  location: PropTypes.object,
  pending: PropTypes.bool,
  profile: PropTypes.shape({
    vapContactInfo: PropTypes.shape({}),
  }),
  router: PropTypes.object,
  setFormData: PropTypes.func,
  showFSR: PropTypes.bool,
  showReviewPageNavigationFeature: PropTypes.bool,
  showLegacyWizard: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: state.user.login.currentlyLoggedIn,
  isError: state.fsr.isError,
  pending: state.fsr.pending,
  profile: selectProfile(state) || {},
  showLegacyWizard: fsrLegacyWizardFeatureToggle(state),
  showFSR: fsrFeatureToggle(state),
  showReviewPageNavigationFeature: reviewPageNavigationFeatureToggle(state),
  isLoadingFeatures: toggleValues(state).loading,
  isStartingOver: state.form.isStartingOver,
});

const mapDispatchToProps = dispatch => ({
  getFormStatus: () => dispatch(fetchFormStatus()),
  setFormData: data => dispatch(setData(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
