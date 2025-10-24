import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  selectMerge1995And5490,
  selectShowEduBenefits1995Wizard,
  selectMeb1995Reroute,
} from './selectors/featureToggles';
import { useSetToggleParam } from '../hooks/useSetToggleParam';
import formConfig from './config/form';

function Form1995Entry({
  children,
  formData,
  location,
  mergeFlag,
  rerouteFlag,
  rudisillFlag,
  setFormData,
}) {
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoadingToggles = useToggleLoadingValue();

  useSetToggleParam(mergeFlag, rudisillFlag);

  useEffect(
    () => {
      if (rerouteFlag === undefined || !formData) {
        return;
      }

      if (formData.isMeb1995Reroute === rerouteFlag) {
        return;
      }

      setFormData({
        ...formData,
        isMeb1995Reroute: rerouteFlag,
      });
    },
    [formData, rerouteFlag, setFormData],
  );

  if (isLoadingToggles || rerouteFlag === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  const formKey = rerouteFlag ? 'reroute' : 'legacy';

  return (
    <RoutedSavableApp
      key={formKey}
      formConfig={formConfig}
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
  formData: PropTypes.object,
  location: PropTypes.object,
  mergeFlag: PropTypes.bool,
  rerouteFlag: PropTypes.bool,
  rudisillFlag: PropTypes.bool,
  setFormData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  mergeFlag: selectMerge1995And5490(state),
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
