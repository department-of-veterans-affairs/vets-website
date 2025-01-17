import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './components/LogoRow/styles.scss';
import './components/OfficialGovtWebsite/styles.scss';
import './components/Search/styles.scss';
import './containers/Menu/styles.scss';
import App from './components/App';
import {
  MINIMAL_HEADER_APPLICABLE,
  MINIMAL_HEADER_EXCLUDE_PATHS,
} from './constants';

const setSessionStorage = (headerMinimal, excludePathsString) => {
  if (headerMinimal) {
    sessionStorage.setItem(MINIMAL_HEADER_APPLICABLE, 'true');
  } else {
    sessionStorage.removeItem(MINIMAL_HEADER_APPLICABLE);
  }

  if (excludePathsString) {
    sessionStorage.setItem(MINIMAL_HEADER_EXCLUDE_PATHS, excludePathsString);
  } else {
    sessionStorage.removeItem(MINIMAL_HEADER_EXCLUDE_PATHS);
  }
};

const setupMinimalHeader = () => {
  let showMinimalHeader;
  // #header-minimal will not be in the DOM unless specified in content-build
  const headerMinimal = document.querySelector('#header-minimal');
  let excludePathsString;

  if (headerMinimal) {
    showMinimalHeader = () => true;
    if (headerMinimal.dataset?.excludePaths) {
      excludePathsString = headerMinimal.dataset.excludePaths;
      const excludePaths = JSON.parse(excludePathsString);
      // Remove the data attribute from the DOM since it's no longer needed
      headerMinimal.removeAttribute('data-exclude-paths');
      showMinimalHeader = path => path != null && !excludePaths.includes(path);
    }
  }

  setSessionStorage(headerMinimal, excludePathsString);

  return showMinimalHeader;
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
