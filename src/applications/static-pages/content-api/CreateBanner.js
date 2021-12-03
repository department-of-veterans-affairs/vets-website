import React from 'react';
import ReactDOM from 'react-dom';
import { CAPI_DOMAIN } from './constants/';
import { apiRequest } from 'platform/utilities/api';

const path =
  '/jsonapi/resource/banner-alerts?item-path=/family-member-benefits';

export default async function createBanner(widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (!root) {
    return;
  }
  try {
    const module = await import('./components/Banner');
    const response = await apiRequest(`${CAPI_DOMAIN}${path}`, null);
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
