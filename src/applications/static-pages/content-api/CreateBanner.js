import React from 'react';
import ReactDOM from 'react-dom';
import { CAPI_DOMAIN, BANNER_PATH } from './constants/';
import { apiRequest } from 'platform/utilities/api';

export default async function createBanner(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (!root) {
    return;
  }
  try {
    const pathname = window.location.pathname;
    const response = await apiRequest(
      `${CAPI_DOMAIN}${BANNER_PATH}${pathname}`,
      null,
    );
    const { data } = await response.json();
    const { default: Banner } = await import('./components/Banner');
    const banners = data.map(banner => banner.attributes);
    ReactDOM.render(<Banner banners={banners} store={store} />, root);
  } catch (error) {
    throw new Error(error);
  }
}
