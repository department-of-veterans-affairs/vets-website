import React, { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://localhost:1337';

const DevPanel = () => {
  const [processes, setProcesses] = useState({});
  const [output, setOutput] = useState({});
  const eventSourcesRef = useRef({});

  const setupEventSource = processName => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/events/${processName}`,
    );

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      setOutput(prev => ({
        ...prev,
        [processName]: [...(prev[processName] || []), data],
      }));
    };

    eventSource.onerror = error => {
      // eslint-disable-next-line no-console
      console.error(`EventSource failed for ${processName}:`, error);
      eventSource.close();
      delete eventSourcesRef.current[processName];
    };

    return eventSource;
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const data = await response.json();
      setProcesses(data);

      // Setup or tear down event sources based on process status
      Object.keys(data).forEach(processName => {
        if (data[processName] && !eventSourcesRef.current[processName]) {
          eventSourcesRef.current[processName] = setupEventSource(processName);
        } else if (!data[processName] && eventSourcesRef.current[processName]) {
          eventSourcesRef.current[processName].close();
          delete eventSourcesRef.current[processName];
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    const currentEventSources = eventSourcesRef.current;
    return () => {
      clearInterval(interval);
      Object.values(currentEventSources).forEach(es => es.close());
    };
  }, []);

  const startProcess = async (processName, processConfig) => {
    try {
      const response = await fetch(`${API_BASE_URL}/start-${processName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processConfig),
      });
      await response.json();
      fetchStatus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error starting ${processName}:`, error);
    }
  };

  const stopProcess = async (processName, port) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port }),
      });
      await response.json();
      if (eventSourcesRef.current[processName]) {
        eventSourcesRef.current[processName].close();
        delete eventSourcesRef.current[processName];
      }
      fetchStatus();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error stopping process on port ${port}:`, error);
    }
  };

  const renderProcessColumn = (
    processName,
    displayName,
    startConfig,
    stopPort,
  ) => {
    return (
      <div className="vads-l-col--6">
        <h2 className="vads-u-font-size--h3">{displayName}</h2>
        <button
          className="usa-button"
          onClick={() => startProcess(processName, startConfig)}
        >
          Start {displayName}
        </button>
        <button
          className="usa-button usa-button-secondary"
          onClick={() => stopProcess(processName, stopPort)}
        >
          Stop {displayName}
        </button>
        <div className="vads-u-margin-top--2">
          Status: {processes[processName] ? 'Running' : 'Stopped'}
        </div>
        <div className="vads-u-margin-top--4">
          <h3 className="vads-u-font-size--h4">Process Output</h3>
          <div
            className="usa-textarea"
            style={{ height: '300px', overflowY: 'scroll' }}
          >
            {output[processName]?.map((msg, index) => (
              <div
                key={index}
                className={`vads-u-margin-bottom--1 ${
                  msg.type === 'stderr' ? 'vads-u-color--secondary' : ''
                }`}
              >
                {msg.type === 'cache' && msg.data.map(line => line)}
                {typeof msg.data === 'string' && msg.data}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vads-l-grid-container--full vads-u-padding--4">
      <h1 className="vads-u-font-size--h2">Dev Panel</h1>

      <div className="vads-l-row">
        {renderProcessColumn(
          'fe-dev-server',
          'Frontend Dev Server',
          {
            entry: 'mock-form-ae-design-patterns',
            api: 'http://localhost:3000',
          },
          3001,
        )}
        {renderProcessColumn(
          'mock-server',
          'Mock API Server',
          {
            debug: true,
            responsesPath:
              'src/applications/_mock-form-ae-design-patterns/mocks/server.js',
          },
          3000,
        )}
      </div>
    </div>
  );
};

export default DevPanel;
