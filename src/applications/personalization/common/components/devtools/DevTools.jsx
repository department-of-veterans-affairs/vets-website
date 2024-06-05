import React, { useRef, lazy, Suspense, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const DevToolsLoader = lazy(() => import('./DevToolsLoader'));

export const DevTools = ({
  devToolsData,
  showIcon = true,
  panel = true,
  children = null,
}) => {
  const {
    TOGGLE_NAMES,
    useToggleLoadingValue,
    useToggleValue,
  } = useFeatureToggle();
  const loading = useToggleLoadingValue();
  const profileUseExperimental = useToggleValue(
    TOGGLE_NAMES.profileUseExperimental,
  );

  const shouldRender = useMemo(() => !loading && profileUseExperimental, [
    loading,
    profileUseExperimental,
  ]);

  const devToolsRef = useRef(null);

  return shouldRender ? (
    <div
      className={showIcon ? 'devtools-show-icon' : undefined}
      ref={devToolsRef}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <DevToolsLoader
          devToolsData={devToolsData}
          panel={panel}
          showIcon={showIcon}
        />
      </Suspense>
      {children}
    </div>
  ) : null;
};

DevTools.propTypes = {
  children: PropTypes.node,
  devToolsData: PropTypes.object,
  open: PropTypes.bool,
  panel: PropTypes.bool,
  showHighlight: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default {
  DevTools,
};
