import React, { useEffect, useState } from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

export const CutoverAlert = location => {
  const [showAlertOnThisPage, setshowAlertOnThisPage] = useState(false);
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const isLoadingFeatureFlags = useToggleLoadingValue();
  const cutoverAvailable = useToggleValue(TOGGLE_NAMES.vreCutoverNotice);
  const isCutOverEnabled =
    isLoadingFeatureFlags === false && cutoverAvailable === true;

  useEffect(
    () => {
      if (
        location.location.pathname !== `/introduction` &&
        location.location.pathname !== `/confirmation`
      ) {
        setshowAlertOnThisPage(true);
      }
    },
    [location],
  );

  return showAlertOnThisPage && isCutOverEnabled ? (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
      data-testid="cutover-alert"
    >
      <>
        <p className="vads-u-margin-y--0">
          This form is scheduled to be updated on August 4th, 2025. If you do
          not complete it by then, all of your saved progress will be lost.
        </p>
      </>
    </va-alert>
  ) : null;
};
