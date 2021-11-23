import React from 'react';
import ReactDOM from 'react-dom';
import { CAPI_DOMAIN, PITTSBURGH_FACILITY_BANNER } from './constants';
import { apiRequest } from 'platform/utilities/api';

export default async function createFullWidthBannerAlert(store, widgetType) {
  const pathname = window.location.pathname;
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (!root) {
    return;
  }
  try {
    const response = await apiRequest(
      `${CAPI_DOMAIN}${PITTSBURGH_FACILITY_BANNER}`,
      null,
    );
    const { data } = await response.json();
    const { default: FullwidthBannerAlert } = await import(
      './components/FullwidthBannerAlert'
    );
    const banner = data.attributes;
    if (pathname.includes('/pittsburgh')) {
      ReactDOM.render(
        <FullwidthBannerAlert banners={banner} store={store} />,
        root,
      );
    }
  } catch (error) {
    throw new Error(error);
  }
}
