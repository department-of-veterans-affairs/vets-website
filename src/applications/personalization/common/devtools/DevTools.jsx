import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const DevToolsLoader = lazy(() => import('./DevToolsLoader'));

const ChildrenRenderer = ({ children, shouldRender }) => {
  return shouldRender ? children : null;
};

export const DevTools = ({
  devtoolsData = { error: 'no data provided to devtools instance' },
  shouldAlwaysRenderChildren = true,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  if (!window?.showDevTools) {
    window.showDevTools = () => {
      setVisible(true);
    };
  }

  if (!window?.hideDevTools) {
    window.hideDevTools = () => {
      setVisible(false);
    };
  }

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

  useEffect(
    () => {
      if (devToolsRef?.current) {
        const classList = visible ? 'devtools-active' : '';
        devToolsRef.current.parentNode.classList = [classList];
      }
    },
    [visible, devToolsRef],
  );

  return !loading && devToolsShouldLoad ? (
    <div className="devtools-root" ref={devToolsRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <DevToolsLoader devtoolsData={devtoolsData} />
        {children}
      </Suspense>
    </div>
  ) : (
    <ChildrenRenderer shouldRender={shouldAlwaysRenderChildren}>
      {children}
    </ChildrenRenderer>
  );
};

export default {
  DevTools,
};
