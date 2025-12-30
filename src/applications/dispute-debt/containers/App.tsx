import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { I18nextProvider } from 'react-i18next';

import { RoutedSavableApp, DowntimeNotification } from '../types/platform-components-typed';
import i18nDebtApp from '../i18n';
import formConfig from '../config/form';
import { fetchDebts } from '../actions';
import useDocumentTitle from '../hooks/useDocumentTitle';

import type { DisputeDebtState } from '../types/state';
import type { AppLocation } from '../../../../config/router-types.d';

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

  // only need to show loading for debt pending if user is logged in
  if ((userLoggedIn && isDebtPending) || isLoadingFeatures) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading application..."
        set-focus
      />
    );
  }

  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {/* @ts-expect-error - HOC-injected props provided automatically by connect() */}
      <DowntimeNotification
        appTitle="dispute debt system"
        dependencies={formConfig.downtime.dependencies}
      >
        <I18nextProvider i18n={i18nDebtApp}>{children}</I18nextProvider>
      </DowntimeNotification>
    </RoutedSavableApp>
  );
}
