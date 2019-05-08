import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { fetchFacility } from './actions';

export default async function createFacilityDetailWidget(store) {
  const widget = document.querySelector(`[data-widget-type="facility-detail"]`);

  if (widget) {
    const {
      default: FacilityDetailWidget,
    } = await import(/* webpackChunkName: "facility-detail" */ './FacilityDetailWidget');

    // since these widgets are on content pages, we don't want to focus on them

    store.dispatch(fetchFacility(JSON.parse(widget.dataset.facility)));
    ReactDOM.render(
      <Provider store={store}>
        <FacilityDetailWidget />
      </Provider>,
      widget,
    );
  }
}
