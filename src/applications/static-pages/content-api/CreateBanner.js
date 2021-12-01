import React from 'react';
import ReactDOM from 'react-dom';

// import { mockBanners } from './api/mocks/mockData';
import { apiRequest } from 'platform/utilities/api';

const CAPI_DOMAIN =
  'https://pr6811-d2ogupvg2fodkdfjyl95sjzwzinh2zev.ci.cms.va.gov';

export default function createBanner(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import('./Banner').then(module => {
      const bannerData = [];
      // This is messy and most likely needs to be refactored.
      const handleBannersSuccess = banners => {
        banners.data.forEach(item => bannerData.push(item.attributes));
        const Banner = module.default;
        ReactDOM.render(<Banner banners={bannerData} />, root);
      };
      const handleBannersError = error => {
        throw new Error(error);
      };
      apiRequest(
        `${CAPI_DOMAIN}/jsonapi/resource/banner-alerts?item-path=/family-member-benefits`,
      )
        .then(response => response.json())
        .then(handleBannersSuccess)
        .catch(handleBannersError);
    });
  }
}
