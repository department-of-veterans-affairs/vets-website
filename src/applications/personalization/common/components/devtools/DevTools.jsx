import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const DevToolsLoader = lazy(() => import('./DevToolsLoader'));

const ChildrenRenderer = ({ children, shouldRender }) => {
  return shouldRender ? children : null;
};

export const DevTools = ({
  devtoolsData = { error: 'no data provided to devtools instance' },
  showChildren = true,
  showHighlight = false,
  showIcon = true,
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
        const classList = classNames({
          'devtools-active': visible && showHighlight,
          'devtools-show-icon': showIcon,
        });

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
    <ChildrenRenderer shouldRender={showChildren}>{children}</ChildrenRenderer>
  );
};

DevTools.propTypes = {
  children: PropTypes.node,
  devtoolsData: PropTypes.object,
  showChildren: PropTypes.bool,
  showHighlight: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default {
  DevTools,
};
