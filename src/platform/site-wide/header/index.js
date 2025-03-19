import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './components/LogoRow/styles.scss';
import './components/OfficialGovtWebsite/styles.scss';
import './components/Search/styles.scss';
import './containers/Menu/styles.scss';
import App from './components/App';

export default (store, megaMenuData) => {
  const root = document.querySelector(`[data-widget-type="header"]`);
  const props = root?.dataset;

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
