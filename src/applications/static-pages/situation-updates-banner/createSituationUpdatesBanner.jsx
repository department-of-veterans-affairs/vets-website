import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BannerContainer } from './bannerContainer';

export default async function createSituationUpdatesBanner(store, widgetType) {
  const bannerWidget = document.querySelector(
    `[data-widget-type="${widgetType}"]`,
  );

  if (bannerWidget) {
    ReactDOM.render(
      <Provider store={store}>
        <BannerContainer />
      </Provider>,
      bannerWidget,
    );
  }
}
