import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useStore } from 'react-redux';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import environment from 'platform/utilities/environment';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { generateCoe } from '../../shared/actions';
import formConfig from '../config/form';
import newFormConfig from '../config/newForm';
import { isLoadingFeatures, showCoeFeature } from '../../shared/utils/helpers';
import { WIP } from '../../shared/components/WIP';
import { formReducerV2 } from '../../shared/reducers';

function App({
  children,
  getCoe,
  getCoeMock,
  isLoading,
  location,
  canApply,
  showCoe,
}) {
  const store = useStore();
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  const togglesLoading = useToggleLoadingValue();

  const useCoeV2 = useToggleValue(TOGGLE_NAMES.vreCutoverNotice);

  useEffect(
    () => {
      if (useCoeV2) {
        store.injectReducer('form', formReducerV2);
      }
    },
    [useCoeV2, store],
  );

  useEffect(
    () => {
      if (showCoe) {
        if (typeof getCoeMock === 'function' && !environment.isProduction()) {
          getCoeMock(!canApply);
        } else {
          getCoe(!canApply);
        }
      }
    },
    [showCoe, getCoe, getCoeMock, canApply],
  );

  if (isLoading) {
    return <va-loading-indicator message="Loading application..." />;
  }

  if (togglesLoading) {
    return <va-loading-indicator message="Loading..." />;
  }

  const formConfigToUse = useCoeV2 ? newFormConfig : formConfig;

  // Show WIP alert if the feature flag isn't set
  return showCoe ? (
    <article
      id="form-26-1880"
      data-location={`${location?.pathname?.slice(1)}`}
    >
      <RoutedSavableApp
        formConfig={formConfigToUse}
        currentLocation={location}
        key={useCoeV2 ? 'v2' : 'v1'}
      >
        <DowntimeNotification
          appTitle="Certificate of Eligibility Form"
          dependencies={[externalServices.coe]}
        >
          {children}
        </DowntimeNotification>
      </RoutedSavableApp>
    </article>
  ) : (
    <WIP />
  );
}

const mapDispatchToProps = {
  getCoe: generateCoe,
};

const mapStateToProps = state => ({
  isLoading: isLoadingFeatures(state),
  canApply: isLoggedIn(state) && selectProfile(state).claims?.coe,
  showCoe: showCoeFeature(state),
});

App.propTypes = {
  children: PropTypes.node.isRequired,
  getCoe: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  canApply: PropTypes.bool,
  getCoeMock: PropTypes.func,
  isLoading: PropTypes.bool,
  showCoe: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
