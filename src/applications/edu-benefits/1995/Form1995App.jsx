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
 * 1. Legacy flow: Traditional form (when meb1995Reroute is disabled)
 * 2. Questionnaire flow: New guided experience (when meb1995Reroute is enabled)
 * 3. Rudisill flow: Legacy form for Rudisill reviews (triggered by ?rudisill=true URL parameter)
 *
 * Note: meb1995Reroute feature flag controls both questionnaire and Rudisill flows.
 * The isRudisillFlow flag in sessionStorage distinguishes Rudisill from questionnaire users.
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

  // Initialize Rudisill flow flag synchronously if needed
  const currentFormData = formData || {};
  const isRudisillFlowSession =
    sessionStorage.getItem('isRudisillFlow') === 'true';

  useEffect(
    () => {
      if (rerouteFlag === undefined) {
        return;
      }

      // Restore Rudisill flow state from saved formData (for save-in-progress resume)
      if (currentFormData.isRudisillFlow === true) {
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
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
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

  // Helper: Extract chapters excluding questionnaire for Rudisill flow
  const getChaptersForFlow = (isRudisill, chapters) => {
    if (!isRudisill) return chapters;

    // Create a shallow copy without the questionnaire chapter
    const filteredChapters = { ...chapters };
    delete filteredChapters.questionnaire;
    return filteredChapters;
  };

  // Helper: Get modified chapters based on flow
  const getModifiedChapters = () => {
    if (isRudisillFlow) {
      return getChaptersForFlow(isRudisillFlow, formConfig.chapters);
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
