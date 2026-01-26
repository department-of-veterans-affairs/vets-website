/// <reference path="../types/component-library-fix.d.ts" />
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { I18nextProvider } from 'react-i18next';

import { RoutedSavableApp, DowntimeNotification } from '../../../../config/globalTypes/platform-components-typed';
import i18nDebtApp from '../i18n';
import formConfig from '../config/form';
import { fetchDebts } from '../actions';
import useDocumentTitle from '../hooks/useDocumentTitle';

import type { DisputeDebtState } from '../types/state';
import type { AppLocation } from '../../../../config/globalTypes/router-types.d';

interface DisputeDebtProps extends React.PropsWithChildren {
  location: AppLocation;
}

export const App = ({ children, location }: DisputeDebtProps) => {
  const dispatch = useDispatch();

  const userLoggedIn = useSelector((state: DisputeDebtState) => isLoggedIn(state));
  const isVerified = useSelector(
    (state: DisputeDebtState) => selectProfile(state)?.verified || false,
  );
  const { isDebtPending } = useSelector((state: DisputeDebtState) => state.availableDebts);
  const { useToggleLoadingValue } = useFeatureToggle();
  const isLoadingFeatures = useToggleLoadingValue();

  const formData = useSelector((state: DisputeDebtState) => state.form?.data);
  useDocumentTitle(location, formData);

  useEffect(
    () => {
      if (userLoggedIn && isVerified) {
        fetchDebts(dispatch);
      }
    },
    [dispatch, userLoggedIn, isVerified],
  );

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

export default App;
