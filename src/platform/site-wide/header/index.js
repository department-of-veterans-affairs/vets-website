// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

export default async (store, megaMenuData) => {
  // Derive the widget and its data properties for props.
  const root = document.querySelector(`[data-widget-type="header"]`);
  const props = root?.dataset;

  // Connect feature toggles.
  connectFeatureToggle(store.dispatch);

  // Render the widget.
  if (root) {
    const {
      default: App,
    } = await import(/* header-widget */ './components/App');
    ReactDOM.render(
      <Provider store={store}>
        <App
          megaMenuData={megaMenuData}
          show={props.show !== 'false'}
          showMegaMenu={props.showMegaMenu !== 'false'}
          showNavLogin={props.showNavLogin !== 'false'}
        />
      </Provider>,
      root,
    );
  }
};
