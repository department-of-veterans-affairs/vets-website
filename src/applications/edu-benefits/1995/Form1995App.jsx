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

  useEffect(
    () => {
      if (rerouteFlag === undefined || !formData) {
        return;
      }

      // Restore Rudisill flow state from saved formData (for save-in-progress resume)
      if (formData.isRudisillFlow === true) {
        sessionStorage.setItem('isRudisillFlow', 'true');
      }

      // Check if user is in Rudisill flow
      // Note: We use sessionStorage to persist flow state across form navigation
      const isRudisillFlow =
        sessionStorage.getItem('isRudisillFlow') === 'true';

      if (!rerouteFlag) {
        if (formData.isMeb1995Reroute || formData.isRudisillFlow) {
          const nextFormData = { ...formData };
          delete nextFormData.isMeb1995Reroute;
          delete nextFormData.currentBenefitType;
          delete nextFormData.isRudisillFlow;
          setFormData(nextFormData);
        }
        return;
      }

      // If in Rudisill flow, don't set isMeb1995Reroute
      if (isRudisillFlow) {
        // Only update if not already in correct state
        if (
          formData.isRudisillFlow !== true ||
          formData.isMeb1995Reroute !== undefined
        ) {
          const nextFormData = { ...formData };
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
        formData.isMeb1995Reroute !== rerouteFlag ||
        formData.currentBenefitType !== claimantCurrentBenefit;

      if (shouldUpdateFormData) {
        setFormData({
          ...formData,
          isMeb1995Reroute: rerouteFlag,
          currentBenefitType: claimantCurrentBenefit,
        });
      }
    },
    [claimantCurrentBenefit, formData, rerouteFlag, setFormData],
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
  const isRudisillFlow = sessionStorage.getItem('isRudisillFlow') === 'true';
  let formKey = 'legacy';
  if (isRudisillFlow) {
    formKey = 'rudisill';
  } else if (rerouteFlag) {
    formKey = 'reroute';
  }

  // Helper: Extract chapters excluding questionnaire for Rudisill flow
  const getChaptersForFlow = (isRudisill, chapters) => {
    if (!isRudisill) return chapters;

    return Object.keys(chapters).reduce((acc, key) => {
      if (key !== 'questionnaire') {
        acc[key] = chapters[key];
      }
      return acc;
    }, {});
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
