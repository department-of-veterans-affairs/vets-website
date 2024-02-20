import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const DevToolsLoader = lazy(() => import('./DevToolsLoader'));

const ChildrenRenderer = ({ children, shouldRender }) => {
  return shouldRender ? children : null;
};

export const DevTools = ({
  devToolsData,
  alwaysShowChildren = true,
  showIcon = true,
  panel = false,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  if (!window?.showDevTools) {
    window.showDevTools = () => {
      document.dispatchEvent(
        new CustomEvent('devToolsActivate', { detail: true }),
      );
    };
  }

  if (!window?.hideDevTools) {
    window.hideDevTools = () => {
      document.dispatchEvent(
        new CustomEvent('devToolsActivate', { detail: false }),
      );
    };
  }

  document.addEventListener('devToolsActivate', event => {
    if (event.detail === true) {
      setVisible(true);
      return;
    }

    setVisible(false);
  });

  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();
  const loading = useToggleLoadingValue();
  const devToolsShouldLoad = useToggleValue(
    TOGGLE_NAMES.profileUseExperimental,
  );

  const devToolsRef = useRef(null);

  useEffect(
    () => {
      if (!loading && devToolsShouldLoad) {
        setVisible(true);
      }
    },
    [loading, devToolsShouldLoad],
  );

  return !loading && devToolsShouldLoad && visible ? (
    <div className={showIcon && 'devtools-show-icon'} ref={devToolsRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <DevToolsLoader devToolsData={devToolsData} panel={panel}>
          {children}
        </DevToolsLoader>
        {children}
      </Suspense>
    </div>
  ) : (
    <ChildrenRenderer shouldRender={alwaysShowChildren}>
      {children}
    </ChildrenRenderer>
  );
};

DevTools.propTypes = {
  children: PropTypes.node,
  devToolsData: PropTypes.object,
  showChildren: PropTypes.bool,
  showHighlight: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default {
  DevTools,
};
