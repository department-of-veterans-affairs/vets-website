import React from 'react';

export const PowerToolsFloatingButton = ({
  showPowerTools,
  setShowPowerTools,
}) => {
  return (
    <button
      onClick={() => setShowPowerTools(!showPowerTools)}
      className="power-tools-show-hide"
      type="button"
    >
      <va-icon icon="build" size={3} />
    </button>
  );
};
