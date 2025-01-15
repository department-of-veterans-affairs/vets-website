import React, { useState } from 'react';
import { ServerProcessControls } from './ServerProcessControls';
import { ServerProcessConsole } from './ServerProcessConsole';
import { useProcessManager } from '../../../context/processManager';
import { MockServerConfigurator } from './MockServerConfigurator';

export const MockServerColumn = () => {
  const {
    processes,
    output,
    startProcess,
    stopProcess,
    fetchStatus,
  } = useProcessManager();
  const processName = 'mock-server';
  const [showStarter, setShowStarter] = useState(true);
  const [starting, setStarting] = useState(false);

  const handleStarterClose = () => {
    setShowStarter(false);
  };

  const handleStart = () => {
    setShowStarter(true);
  };

  return (
    <div className="vads-l-col--12">
      <ServerProcessControls
        processName={processName}
        displayName="Mock API Server"
        isRunning={!!processes[processName]}
        onStart={handleStart}
        onStop={stopProcess}
        startConfig={{
          debug: true,
          responsesPath:
            'src/applications/_mock-form-ae-design-patterns/mocks/server.js',
        }}
        stopPort={3000}
      />
      <ServerProcessConsole
        output={output[processName] || []}
        processName={processName}
      />

      <MockServerConfigurator
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
