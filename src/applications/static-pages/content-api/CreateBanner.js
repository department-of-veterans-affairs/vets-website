import React from 'react';
import ReactDOM from 'react-dom';
import { CAPI_DOMAIN, BANNER_SOURCE } from './constants/';
import { apiRequest } from 'platform/utilities/api';

export default async function createBanner(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  // If root is not found, do nothing.
  if (!root) {
    return;
  }
  try {
    const module = await import('./components/Banner');
    const response = await apiRequest(`${CAPI_DOMAIN}${BANNER_SOURCE}`, null);
    const { data } = await response.json();
    const parsedData = data.map(banner => banner.attributes);
    const Banner = module.default;
    if (root) {
      ReactDOM.render(<Banner banners={parsedData} />, root);
    }
  } catch (error) {
    throw new Error(error);
  }
}
