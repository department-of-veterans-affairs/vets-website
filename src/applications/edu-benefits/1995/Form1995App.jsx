import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  selectShowEduBenefits1995Wizard,
  selectMeb1995Reroute,
} from './selectors/featureToggles';
import formConfig from './config/form';
import BreadcrumbFix from './components/BreadcrumbFix';

/**
 * Intercept beforeunload event listeners to allow suppression on specific pages.
 * This is used to prevent "Leave site?" alerts on questionnaire result pages,
 * which don't collect user input and have nothing to save.
 */
const originalAddEventListener = window.addEventListener.bind(window);
window.addEventListener = function wrappedAddEventListener(
  type,
  listener,
  options,
) {
  if (type === 'beforeunload' && typeof listener === 'function') {
    const wrappedListener = function wrappedBeforeunloadListener(e) {
      if (window.__suppressBeforeunload === true) {
        return null;
      }
      return listener.call(this, e);
    };
    return originalAddEventListener(type, wrappedListener, options);
  }
  return originalAddEventListener(type, listener, options);
};

/**
 * Main form wrapper for VA Form 22-1995 with support for multiple flows:
 *
 * Flows:
 * 1. Legacy: Traditional form pages (meb1995Reroute disabled)
 * 2. Questionnaire: Guided experience with branching logic (meb1995Reroute enabled)
 * 3. Rudisill: Legacy form for Rudisill reviews (meb1995Reroute enabled + ?rudisill=true)
 *
 * State Management:
 * - sessionStorage.isRudisillFlow: Set by IntroductionRouter when ?rudisill=true
 * - formData.isMeb1995Reroute: Indicates questionnaire flow
 * - formData.isRudisillFlow: Indicates Rudisill flow (persisted for save-in-progress)
 *
 * The component syncs formData with sessionStorage to handle flow transitions,
 * including returning to questionnaire from Rudisill flow.
 */
function Form1995Entry({
  children,
  claimantCurrentBenefit,
  formData,
  location,
  rerouteFlag,
  rudisillFlag,
  setFormData,
}) {
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoadingToggles = useToggleLoadingValue();

  // Store Rudisill flag in sessionStorage for helpers.jsx usage
  useEffect(
    () => {
      if (rudisillFlag !== undefined) {
        sessionStorage.setItem('isRudisill1995', JSON.stringify(rudisillFlag));
      }
    },
    [rudisillFlag],
  );

  // Check sessionStorage for Rudisill flow state
  // On intro page, URL is source of truth (sessionStorage may be stale from previous flow)
  const isOnIntroPage = window.location.pathname.endsWith('/introduction');
  const urlParams = new URLSearchParams(window.location.search);
  const isRudisillFromUrl = urlParams.get('rudisill') === 'true';

  let isRudisillFlowSession;
  if (isOnIntroPage) {
    // On intro page, use URL as source of truth
    isRudisillFlowSession = isRudisillFromUrl;
  } else {
    // On form pages, use sessionStorage
    isRudisillFlowSession = sessionStorage.getItem('isRudisillFlow') === 'true';
  }

  useEffect(
    () => {
      const currentFormData = formData || {};

      if (rerouteFlag === undefined) {
        return;
      }

      // Sync formData with sessionStorage state
      // If sessionStorage says NOT Rudisill but formData says Rudisill, clear formData
      // This handles returning to questionnaire from Rudisill flow
      if (!isRudisillFlowSession && currentFormData.isRudisillFlow === true) {
        const nextFormData = { ...currentFormData };
        delete nextFormData.isRudisillFlow;
        setFormData({
          ...nextFormData,
          isMeb1995Reroute: rerouteFlag,
          currentBenefitType: claimantCurrentBenefit,
        });
        return;
      }

      // Restore Rudisill flow state from saved formData (for save-in-progress resume)
      // Only do this if sessionStorage isn't already cleared (user didn't return to questionnaire)
      if (isRudisillFlowSession && currentFormData.isRudisillFlow === true) {
        sessionStorage.setItem('isRudisillFlow', 'true');
      }

      if (!rerouteFlag) {
        if (
          currentFormData.isMeb1995Reroute ||
          currentFormData.isRudisillFlow
        ) {
          const nextFormData = { ...currentFormData };
          delete nextFormData.isMeb1995Reroute;
          delete nextFormData.currentBenefitType;
          delete nextFormData.isRudisillFlow;
          setFormData(nextFormData);
        }
        return;
      }

      // If in Rudisill flow, ensure formData has the flag set
      if (isRudisillFlowSession) {
        // Always set isRudisillFlow if sessionStorage indicates Rudisill flow
        // and formData doesn't have it yet or has incorrect state
        if (
          currentFormData.isRudisillFlow !== true ||
          currentFormData.isMeb1995Reroute !== undefined
        ) {
          const nextFormData = { ...currentFormData };
          delete nextFormData.isMeb1995Reroute;
          delete nextFormData.currentBenefitType;
          setFormData({
            ...nextFormData,
            isRudisillFlow: true,
          });
        }
        return;
      }

      // Normal reroute flow
      const shouldUpdateFormData =
        currentFormData.isMeb1995Reroute !== rerouteFlag ||
        currentFormData.currentBenefitType !== claimantCurrentBenefit;

      if (shouldUpdateFormData) {
        setFormData({
          ...currentFormData,
          isMeb1995Reroute: rerouteFlag,
          currentBenefitType: claimantCurrentBenefit,
        });
      }
    },
    [
      claimantCurrentBenefit,
      formData,
      isRudisillFlowSession,
      rerouteFlag,
      setFormData,
    ],
  );

  if (isLoadingToggles || rerouteFlag === undefined) {
    return <va-loading-indicator label="Loading" message="Loading..." />;
  }

  // Check if Rudisill flow to determine form key
  // Note: sessionStorage flag is set by IntroductionRouter when ?rudisill=true parameter is detected
  const isRudisillFlow = isRudisillFlowSession;
  let formKey = 'legacy';
  if (isRudisillFlow) {
    formKey = 'rudisill';
  } else if (rerouteFlag) {
    formKey = 'reroute';
  }

  const getModifiedChapters = () => {
    if (isRudisillFlow) {
      // Destructure to exclude questionnaire chapter; eslint flags unused var
      // eslint-disable-next-line no-unused-vars
      const { questionnaire, ...filteredChapters } = formConfig.chapters;
      return filteredChapters;
    }

    return {
      ...formConfig.chapters,
      questionnaire: {
        ...formConfig.chapters.questionnaire,
        hideFormNavProgress: rerouteFlag === true,
      },
    };
  };

  const modifiedConfig = {
    ...formConfig,
    // Enable save for Rudisill flow even when reroute is enabled
    disableSave: isRudisillFlow ? false : formConfig.disableSave,
    chapters: getModifiedChapters(),
  };
  return (
    <RoutedSavableApp
      key={formKey}
      formConfig={modifiedConfig}
      currentLocation={location}
    >
      {rerouteFlag && <BreadcrumbFix />}
      {children}
    </RoutedSavableApp>
  );
}

Form1995Entry.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  setFormData: PropTypes.func.isRequired,
  claimantCurrentBenefit: PropTypes.string,
  formData: PropTypes.object,
  location: PropTypes.object,
  rerouteFlag: PropTypes.bool,
  rudisillFlag: PropTypes.bool,
};

const mapStateToProps = state => ({
  claimantCurrentBenefit:
    state.data?.claimantInfo?.data?.attributes?.claimant?.currentBenefitType,
  formData: state.form?.data || {},
  rerouteFlag: selectMeb1995Reroute(state),
  rudisillFlag: selectShowEduBenefits1995Wizard(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form1995Entry);
