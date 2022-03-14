// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Relative imports.
import './components/LogoRow/styles.scss';
import './components/OfficialGovtWebsite/styles.scss';
import './components/Search/styles.scss';
import './containers/Menu/styles.scss';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import App from './components/App';

export default (store, megaMenuData) => {
  // Derive the widget and its data properties for props.
  const root = document.querySelector(`[data-widget-type="header"]`);
  const props = root?.dataset;

  // Connect feature toggles.
  connectFeatureToggle(store.dispatch);

  // Render the widget.
  if (root) {
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
