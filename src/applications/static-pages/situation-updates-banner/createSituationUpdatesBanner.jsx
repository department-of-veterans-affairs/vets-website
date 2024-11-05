import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from '../widgetTypes';
import SituationUpdateBanner from './situationUpdateBanner';

export default async function createSituationUpdatesBanner(store) {
  const bannerWidget = document.querySelector(
    `[data-widget-type="${widgetTypes.SITUATION_UPDATES_BANNER}"]`,
  );

  if (bannerWidget) {
    const defaultProps = {
      id: '1',
      bundle: 'situation-updates',
      headline: 'Situation update',
      alertType: 'info',
      content:
        "We're having issues at this location. Please avoid this facility until further notice.",
      context: 'global',
      showClose: true,
      operatingStatusCTA: false,
      emailUpdatesButton: false,
      findFacilitiesCTA: false,
      limitSubpageInheritance: false,
    };
    const props = { ...defaultProps }; // add `, ...situationUpdatesResponse` after `defaults` to include the response

    ReactDOM.render(
      <Provider store={store}>
        <SituationUpdateBanner {...props} />
      </Provider>,
      bannerWidget,
    );
  }
}
