import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { I18nextProvider } from 'react-i18next';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { DowntimeNotification } from 'platform/monitoring/DowntimeNotification';
import i18nDebtApp from '../i18n';
import formConfig from '../config/form';
import { fetchDebts } from '../actions';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function App({ children, location }) {
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const isVerified = useSelector(
    state => selectProfile(state)?.verified || false,
  );
  const { isDebtPending } = useSelector(state => state.availableDebts);
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoadingFeatures = useToggleLoadingValue();

  const formData = useSelector(state => state.form?.data);
  useDocumentTitle(location, formData);

  useEffect(() => {
    if (userLoggedIn && isVerified) {
      fetchDebts(dispatch);
    }
  }, [dispatch, userLoggedIn, isVerified]);

  // only need to show loading for debt pending if user is logged in
  if ((userLoggedIn && isDebtPending) || isLoadingFeatures) {
    return (
      <I18nextProvider i18n={i18nDebtApp}>
        <va-loading-indicator
          label={i18nDebtApp.t('loading-indicator.label')}
          message={i18nDebtApp.t('loading-indicator.message')}
          set-focus
        />
      </I18nextProvider>
    );
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      <I18nextProvider i18n={i18nDebtApp}>
        <DowntimeNotification
          appTitle={i18nDebtApp.t('downtime-notification-app-title')}
          dependencies={formConfig.downtime.dependencies}
        >
          {children}
        </DowntimeNotification>
      </I18nextProvider>
    </RoutedSavableApp>
  );
}

App.propTypes = {
  children: PropTypes.element,
  isDebtPending: PropTypes.bool,
  location: PropTypes.object,
};
