import React, { useEffect, useState } from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import SituationUpdateBanner from './situationUpdateBanner';
import { getDataForPath } from './helpers/getDataForPath';
import { getOperatingStatusPage } from './helpers/getOperatingStatusPage';

export const BannerContainer = () => {
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const alternativeBannersEnabled = useToggleValue(
    TOGGLE_NAMES.bannerUseAlternativeBanners,
  );
  const isLoadingFeatureFlags = useToggleLoadingValue();

  const [bannerState, setBannerState] = useState(null);

  useEffect(() => {
    let pathForSituationUpdate = window.location.pathname;
    pathForSituationUpdate = pathForSituationUpdate.replace(/\/$/, '');
    if (
      pathForSituationUpdate.includes('health-care') ||
      pathForSituationUpdate.includes('manila-va-clinic')
    ) {
      getDataForPath(pathForSituationUpdate)
        .then(data => {
          setBannerState(data?.banners?.[0] || {});
        })
        .catch(_ => {
          setBannerState(null);
        });
    }
  }, []);

  if (isLoadingFeatureFlags || !alternativeBannersEnabled) {
    return null;
  }

  if (!bannerState?.id) {
    return null;
  }

  const operatingStatusPage = getOperatingStatusPage(
    bannerState?.context?.[0]?.entity?.entityUrl?.path,
  );

  return (
    <SituationUpdateBanner
      {...bannerState}
      operatingStatusPage={operatingStatusPage}
    />
  );
};
