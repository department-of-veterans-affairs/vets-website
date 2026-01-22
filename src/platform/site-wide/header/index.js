import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './components/LogoRow/styles.scss';
import './components/OfficialGovtWebsite/styles.scss';
import './components/Search/styles.scss';
import './containers/Menu/styles.scss';
import App from './components/App';
import { createShouldShowMinimal } from './helpers';

const setupMinimalHeader = () => {
  // #header-minimal will not be in the DOM unless specified in content-build
  const headerMinimal = document.querySelector('#header-minimal');
  let excludePaths;
  let excludePathsString;
  let enabled = false;

  if (headerMinimal) {
    enabled = true;
    if (headerMinimal.dataset?.excludePaths) {
      excludePathsString = headerMinimal.dataset.excludePaths;
      excludePaths = JSON.parse(excludePathsString);

      // never show minimal header on /form-saved page
      if (
        Array.isArray(excludePaths) &&
        !excludePaths.some(path => path.endsWith('/form-saved'))
      ) {
        // check if this form-saved page is part of an app with dynamic routes
        const prefix = excludePaths.some(path => path.startsWith('*'))
          ? '*'
          : '';
        excludePaths.push(`${prefix}/form-saved`);
      }
    }
  }

  return createShouldShowMinimal({
    enabled,
    excludePaths,
  });
};

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
          showMinimalHeader={setupMinimalHeader()}
        />
      </Provider>,
      root,
    );
  }
};
