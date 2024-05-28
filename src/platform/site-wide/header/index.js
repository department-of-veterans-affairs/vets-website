import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './components/LogoRow/styles.scss';
import './components/OfficialGovtWebsite/styles.scss';
import './components/Search/styles.scss';
import './containers/Menu/styles.scss';
import App from './components/App';

const setupMinimalHeader = () => {
  let showMinimalHeader;
  // #header-minimal will not be in the DOM unless specified in content-build
  const headerMinimal = document.querySelector('#header-minimal');

  if (headerMinimal) {
    showMinimalHeader = () => true;
    if (headerMinimal.dataset?.excludePaths) {
      const excludePathsString = headerMinimal.dataset.excludePaths;
      const excludePaths = JSON.parse(excludePathsString);
      // Remove the data attribute from the DOM since it's no longer needed
      headerMinimal.removeAttribute('data-exclude-paths');
      showMinimalHeader = path => path != null && !excludePaths.includes(path);
    }
  }

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
