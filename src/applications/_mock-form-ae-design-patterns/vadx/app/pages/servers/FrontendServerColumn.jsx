// components/servers/FrontendServer.jsx
import React, { useState } from 'react';
import { ServerProcessControls } from './ServerProcessControls';
import { ServerProcessConsole } from './ServerProcessConsole';
import { FrontendServerConfigurator } from './FrontendServerConfigurator';
import { useProcessManager } from '../../../context/processManager';
import { FRONTEND_PROCESS_NAME } from '../../../constants';

export const FrontendServerColumn = () => {
  const {
    processes,
    output,
    startProcess,
    stopProcess,
    fetchStatus,
  } = useProcessManager();
  const processName = FRONTEND_PROCESS_NAME;
  const [showStarter, setShowStarter] = useState(false);
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setShowStarter(true);
  };

  const handleStarterClose = () => {
    setShowStarter(false);
  };

  return (
    <div className="vads-l-col--12">
      <ServerProcessControls
        processName={processName}
        displayName="Frontend Dev Server"
        isRunning={!!processes[processName]}
        onStart={handleStart}
        onStop={stopProcess}
        startConfig={{
          entry: 'mock-form-ae-design-patterns',
          api: 'http://localhost:3000',
        }}
        stopPort={3001}
      />

      <ServerProcessConsole
        output={output[processName] || []}
        processName={processName}
      />

      <FrontendServerConfigurator
        onClose={handleStarterClose}
        onStart={async manifestsToStart => {
          setStarting(true);
          await startProcess(processName, {
            entries: manifestsToStart.map(m => m.entryName),
            api: 'http://localhost:3000',
          });
          fetchStatus();
          setStarting(false);
          setShowStarter(false);
        }}
        visible={showStarter}
        starting={starting}
      />
    </div>
  );
};
