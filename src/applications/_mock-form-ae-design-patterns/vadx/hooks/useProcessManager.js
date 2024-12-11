// hooks/useProcessManager.js
import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/dates';

const API_BASE_URL = 'http://localhost:1337';

export const useProcessManager = () => {
  const [processes, setProcesses] = useState({});
  const [output, setOutput] = useState({});
  const eventSourcesRef = useRef({});

  // Move all the event source and process management logic here
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
      const { processes: processStatus } = await response.json();
      setProcesses(processStatus);

      // Setup or tear down event sources based on process status
      Object.keys(processStatus).forEach(processName => {
        if (
          processStatus[processName] &&
          !eventSourcesRef.current[processName]
        ) {
          eventSourcesRef.current[processName] = setupEventSource(processName);
        } else if (
          !processStatus[processName] &&
          eventSourcesRef.current[processName]
        ) {
          eventSourcesRef.current[processName].close();
          delete eventSourcesRef.current[processName];
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching status:', error);
    }
  };

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

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    const currentEventSources = eventSourcesRef.current;

    return () => {
      clearInterval(interval);
      Object.values(currentEventSources).forEach(es => es.close());
    };
  }, []);

  return {
    processes,
    output,
    startProcess,
    stopProcess,
  };
};
