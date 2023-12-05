import React, { useState } from 'react';

export const DevToolsLoader = ({
  devtoolsData = { error: 'no data provided to devtools instance' },
}) => {
  const [hovered, setHovered] = useState(false);

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

  return (
    <div
      className="devtools-container"
      onMouseEnter={handlers.panelOnMouseEnter}
      onMouseLeave={handlers.panelOnMouseLeave}
    >
      <button type="button">
        <i className="fas fa-code" />
      </button>
      <div className={hovered ? panelHoveredClasses : panelDefaultClasses}>
        <strong>panel</strong>
        <pre>{JSON.stringify(devtoolsData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DevToolsLoader;
