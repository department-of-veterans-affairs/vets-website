import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { format, parseISO } from 'date-fns';
import { ApplicationSelector } from './ApplicationSelector';

const API_BASE_URL = 'http://localhost:1337';

const formatDate = dateString => {
  try {
    const date = parseISO(dateString);
    return format(date, 'HH:mm:ss:aaaaa');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing date:', error);
    return dateString; // Return original string if parsing fails
  }
};

const DevPanelLineItem = ({ line }) => {
  return (
    <div
      className="vads-u-margin-bottom--0p25"
      style={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        transition: 'opacity 200ms ease-in',
      }}
    >
      {line}
    </div>
  );
};

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
        [processName]: [
          {
            id: Date.now(),
            friendlyDate: formatDate(new Date().toISOString()),
            ...data,
          },
          ...(prev[processName] || []),
        ],
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
      <div className="vads-l-col--5 vads-l-grid-container--full vads-u-padding--0">
        <div className="vads-l-row vads-u-align-items--center">
          <h2 className="vads-u-font-size--h4 vads-u-margin-y--0 vads-u-font-family--sans vads-u-font-weight--bold">
            {displayName}
          </h2>
          {processes[processName] ? (
            <>
              <div className="vads-u-padding-x--1 vads-u-font-style--italic">
                Status: Running 🍏
              </div>
              <va-button
                className="usa-button usa-button-secondary"
                onClick={() => stopProcess(processName, stopPort)}
                text="stop process"
                secondary
              />
            </>
          ) : (
            <>
              <div className="vads-u-padding-x--1 vads-u-font-style--italic">
                Status: Stopped 🍎
              </div>
              <va-button
                className="usa-button"
                onClick={() => startProcess(processName, startConfig)}
                text="start process"
                secondary
              />
            </>
          )}
        </div>

        <div className="vads-u-padding--1 vads-u-border--1px vads-u-margin--0p5">
          <h3 className="vads-u-font-size--h4 vads-u-margin--0 vads-u-margin-bottom--0p25">
            Process Output
          </h3>
          <div
            className="usa-textarea"
            style={{ height: '50vh', overflowY: 'scroll' }}
          >
            <TransitionGroup>
              {output[processName]?.flatMap((msg, index) => {
                if (msg.type === 'cache') {
                  return msg.data.map((line, cacheIndex) => (
                    <DevPanelLineItem
                      line={line}
                      key={`${processName}-cache-${index}-${cacheIndex}`}
                    />
                  ));
                }
                return (
                  <CSSTransition
                    key={msg.id || `${processName}-${index}`}
                    timeout={200}
                    classNames="fade"
                  >
                    <DevPanelLineItem
                      line={`[${msg.friendlyDate}] ${msg.data}`}
                      key={`${processName}-${index}`}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vads-l-grid-container--full vads-u-padding--2">
      <h1 className="vads-u-font-size--h5">VADX - Servers</h1>

      <div className="vads-l-row">
        <div className="vads-l-col--2 vads-l-grid-container vads-u-padding--0">
          <ApplicationSelector />
        </div>
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
