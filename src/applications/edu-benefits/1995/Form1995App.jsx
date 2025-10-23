import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import {
  selectMerge1995And5490,
  selectShowEduBenefits1995Wizard,
  selectMeb1995Reroute,
} from './selectors/featureToggles';
import { useSetToggleParam } from '../hooks/useSetToggleParam';
import { buildFormConfig } from './config/form';

export default function Form1995Entry({ location, children }) {
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoadingToggles = useToggleLoadingValue();
  const mergeFlag = useSelector(selectMerge1995And5490);
  const rudisillFlag = useSelector(selectShowEduBenefits1995Wizard);
  const rerouteFlag = useSelector(selectMeb1995Reroute);

  useSetToggleParam(mergeFlag, rudisillFlag);

  if (isLoadingToggles || rerouteFlag === undefined) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading feature settings..."
      />
    );
  }

  const dynamicFormConfig = buildFormConfig(rerouteFlag);

  const formKey = rerouteFlag ? 'reroute' : 'legacy';

  return (
    <RoutedSavableApp
      key={formKey}
      formConfig={dynamicFormConfig}
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
  location: PropTypes.object,
};
