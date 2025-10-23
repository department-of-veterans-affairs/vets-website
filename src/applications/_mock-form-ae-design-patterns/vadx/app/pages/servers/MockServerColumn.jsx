import React from 'react';
import ServerControls from './ServerControls';
import ProcessOutput from './ProcessOutput';
import { useProcessManager } from '../../../context/processManager';

export const MockServerColumn = () => {
  const { processes, output, startProcess, stopProcess } = useProcessManager();
  const processName = 'mock-server';

  return (
    <div className="vads-l-col--12">
      <ServerControls
        processName={processName}
        displayName="Mock API Server"
        isRunning={!!processes[processName]}
        onStart={startProcess}
        onStop={stopProcess}
        startConfig={{
          debug: true,
          responsesPath:
            'src/applications/_mock-form-ae-design-patterns/mocks/server.js',
        }}
        stopPort={3000}
      />
      <ProcessOutput
        output={output[processName] || []}
        processName={processName}
      />
    </div>
  );
};
