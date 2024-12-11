// components/servers/FrontendServer.jsx
import React from 'react';
import ServerControls from './ServerControls';
import ProcessOutput from './ProcessOutput';
import { useProcessManager } from '../../../hooks/useProcessManager';

export const FrontendServer = () => {
  const { processes, output, startProcess, stopProcess } = useProcessManager();
  const processName = 'fe-dev-server';

  return (
    <div className="vads-l-col--12">
      <ServerControls
        processName={processName}
        displayName="Frontend Dev Server"
        isRunning={!!processes[processName]}
        onStart={startProcess}
        onStop={stopProcess}
        startConfig={{
          entry: 'mock-form-ae-design-patterns',
          api: 'http://localhost:3000',
        }}
        stopPort={3001}
      />
      <ProcessOutput
        output={output[processName] || []}
        processName={processName}
      />
    </div>
  );
};
