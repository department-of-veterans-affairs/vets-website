import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from '../widgetTypes';

export default async function createSituationUpdatesBanner(store) {
  const bannerWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.SITUATION_UPDATES_BANNER}"]`,
  );

  if (bannerWidget) {
    const situationUpdatesResponse = null; // Replace with API call to get situation updates
    const config = {
      id: situationUpdatesResponse?.id || '1',
      bundle: situationUpdatesResponse?.bundle || 'situation-updates',
      headline: situationUpdatesResponse?.headline || 'Situation update',
      alertType: situationUpdatesResponse?.alertType || 'info',
      content:
        situationUpdatesResponse?.content ||
        "We're having issues at this location. Please avoid this facility until further notice.",
      context: situationUpdatesResponse?.context || 'global',
      showClose: situationUpdatesResponse?.showClose !== 'false',
      operatingStatusCTA:
        situationUpdatesResponse?.operatingStatusCta === 'true' || false,
      emailUpdatesButton:
        situationUpdatesResponse?.emailUpdatesButton === 'true' || false,
      findFacilitiesCTA:
        situationUpdatesResponse?.findFacilitiesCta === 'true' || false,
      limitSubpageInheritance:
        situationUpdatesResponse?.limitSubpageInheritance === 'true',
    };

    const SituationUpdatesBanner = () => (
      <va-banner
        banner-id={config.id}
        type={config.alertType}
        headline={config.headline}
        show-close={config.showClose}
      >
        <div slot="content">
          <span>{config.content}</span>
        </div>
      </va-banner>
    );

    ReactDOM.render(
      <Provider store={store}>
        <SituationUpdatesBanner />
      </Provider>,
      bannerWidget,
    );
  }
}
