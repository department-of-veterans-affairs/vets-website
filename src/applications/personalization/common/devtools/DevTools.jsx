import React, { useEffect, createRef, useState } from 'react';
import './sass/DevTools.scss';

export const DevTools = ({
  devtoolsData = { error: 'no data provided to devtools instance' },
}) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const handlers = {
    panelOnMouseEnter: () => {
      setHovered(true);
    },
    panelOnMouseLeave: () => {
      setHovered(false);
    },
  };

  const panelDefaultClasses = 'devtools-panel devtools-panel--hidden';
  const panelHoveredClasses = 'devtools-panel devtools-panel--hovered';

  const devToolsRef = createRef();

  useEffect(
    () => {
      if (visible) {
        devToolsRef.current.parentNode.classList.add('devtools-active');
      } else {
        devToolsRef.current.parentNode.classList = [''];
      }
    },
    [visible, devToolsRef],
  );

  useEffect(() => {
    setVisible(true);
    // console.log(devToolsRef.current.parentNode);
  }, []);

  return (
    <div
      className="devtools-container"
      ref={devToolsRef}
      onMouseEnter={handlers.panelOnMouseEnter}
      onMouseLeave={handlers.panelOnMouseLeave}
    >
      <i className="fas fa-code" />
      <div className={hovered ? panelHoveredClasses : panelDefaultClasses}>
        <strong>panel</strong>
        <pre>{JSON.stringify(devtoolsData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default {
  DevTools,
};
