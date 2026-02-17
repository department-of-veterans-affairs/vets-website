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
  useEffect(() => {
    if (rudisillFlag !== undefined) {
      sessionStorage.setItem('isRudisill1995', JSON.stringify(rudisillFlag));
    }
  }, [rudisillFlag]);

  useEffect(() => {
    if (rerouteFlag === undefined || !formData) {
      return;
    }

    if (!rerouteFlag) {
      if (formData.isMeb1995Reroute) {
        const nextFormData = { ...formData };
        delete nextFormData.isMeb1995Reroute;
        delete nextFormData.currentBenefitType;
        setFormData(nextFormData);
      }
      return;
    }

    // Only update if the values have actually changed
    if (
      formData.isMeb1995Reroute !== rerouteFlag ||
      formData.currentBenefitType !== claimantCurrentBenefit
    ) {
      setFormData({
        ...formData,
        isMeb1995Reroute: rerouteFlag,
        currentBenefitType: claimantCurrentBenefit,
      });
    }
  }, [claimantCurrentBenefit, formData, rerouteFlag, setFormData]);

  if (isLoadingToggles || rerouteFlag === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  const formKey = rerouteFlag ? 'reroute' : 'legacy';

  const modifiedConfig = {
    ...formConfig,
    chapters: {
      ...formConfig.chapters,
      questionnaire: {
        ...formConfig.chapters.questionnaire,
        hideFormNavProgress: rerouteFlag === true,
      },
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(Form1995Entry);
