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
  children = null,
}) => {
  const [visible, setVisible] = useState(false);

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
  alwaysShowChildren: PropTypes.bool,
  children: PropTypes.node,
  devToolsData: PropTypes.object,
  open: PropTypes.bool,
  panel: PropTypes.bool,
  showChildren: PropTypes.bool,
  showHighlight: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default {
  DevTools,
};
