import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async function createVetCentersHours(store) {
  const nearByVetCentersWidget = document.querySelector(
    `[data-widget-type="near-by-vet-centers"]`,
  );

  if (nearByVetCentersWidget) {
    const { default: NearByVetCenters } = await import('./nearByVetCenters');
    ReactDOM.render(
      <Provider store={store}>
        <NearByVetCenters hours={window.fieldNearbyVetCenters} />
      </Provider>,
      nearByVetCentersWidget,
    );
  }
}

//                        <h2 class="vads-u-font-size--xl vads-u-margin-top--3 medium-screen:vads-u-margin-top--5 vads-u-margin-bottom--2p5
//                  medium-screen:vads-u-margin-bottom--3" id="other-near-locations">
//                             Other nearby Vet Centers
//                         </h2>
//                         {% for entityVetCenter in fieldNearbyVetCenters %}
//                             {% include "src/site/includes/vet_center_address_phone_image.liquid" with vetCenter = entityVetCenter.entity %}
//                         {% endfor %}
//                         {% for entityVetCenter in fieldNearbyMobileVetCenters %}
//                             {% include "src/site/includes/vet_center_address_phone_image.liquid" with vetCenter = entityVetCenter.entity %}
//                         {% endfor %}
