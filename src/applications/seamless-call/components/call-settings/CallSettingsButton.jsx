import React, { useState } from 'react';
import CallSettingsDialog from './CallSettingsDialog';

const CallSettingsButton = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <va-button
        text="Settings"
        onClick={() => setShowSettings(true)}
        className="hover:cursor-pointer hover:text-gray-cool-40"
        data-testid="call-settings-button"
        secondary
      />
      {showSettings && (
        <CallSettingsDialog onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};

export default CallSettingsButton;
