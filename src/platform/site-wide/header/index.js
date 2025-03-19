import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import environment from 'platform/utilities/environment';
import './components/LogoRow/styles.scss';
import './components/OfficialGovtWebsite/styles.scss';
import './components/Search/styles.scss';
import './containers/Menu/styles.scss';
import App from './components/App';
import { createShouldShowMinimal } from './helpers';

const setSessionStorage = (headerMinimal, excludePathsString) => {
  if (!environment.isUnitTest()) {
    // Set this manually if you want to unit test it - otherwise session
    // storage could potentially leak to other tests
    if (headerMinimal) {
      sessionStorage.setItem('MINIMAL_HEADER_APPLICABLE', 'true');
    } else {
      sessionStorage.removeItem('MINIMAL_HEADER_APPLICABLE');
    }

    if (excludePathsString) {
      sessionStorage.setItem(
        'MINIMAL_HEADER_EXCLUDE_PATHS',
        excludePathsString,
      );
    } else {
      sessionStorage.removeItem('MINIMAL_HEADER_EXCLUDE_PATHS');
    }
  }
};

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
    }
  }

  setSessionStorage(enabled, excludePathsString);

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
          setupMinimalHeader={setupMinimalHeader}
        />
      </Provider>,
      root,
    );
  }
};
