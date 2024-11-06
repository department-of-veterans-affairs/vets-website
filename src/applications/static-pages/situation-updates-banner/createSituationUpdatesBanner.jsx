import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import widgetTypes from '../widgetTypes';
import SituationUpdateBanner from './situationUpdateBanner';

export default function createSituationUpdatesBanner(store) {
  const BannerComponent = () => {
    const {
      TOGGLE_NAMES,
      useToggleValue,
      useToggleLoadingValue,
    } = useFeatureToggle();
    const alternativeBannersEnabled = useToggleValue(
      TOGGLE_NAMES.bannerUseAlternativeBanners,
    );
    const isLoadingFeatureFlags = useToggleLoadingValue();

    if (isLoadingFeatureFlags || !alternativeBannersEnabled) {
      return null;
    }

    const defaultProps = {
      id: '1',
      bundle: 'situation-updates',
      headline: 'Situation update',
      alertType: 'warning',
      content:
        "We're having issues at this location. Please avoid this facility until further notice.",
      context: 'global',
      showClose: true,
      operatingStatusCTA: false,
      emailUpdatesButton: false,
      findFacilitiesCTA: false,
      limitSubpageInheritance: false,
    };
    const bannerProps = { ...defaultProps }; // add `, ...situationUpdatesResponse` after `defaultProps` to include the response

    return (
      <Provider store={store}>
        <SituationUpdateBanner {...bannerProps} />
      </Provider>
    );
  };

  const bannerWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.SITUATION_UPDATES_BANNER}"]`,
  );

  if (bannerWidget) {
    ReactDOM.render(<BannerComponent />, bannerWidget);
  }
}
