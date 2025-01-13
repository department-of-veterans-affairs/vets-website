import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/dates';
import { API_BASE_URL } from '../constants';

const ProcessManagerContext = createContext(null);

export const ProcessManagerProvider = ({ children }) => {
  const [processes, setProcesses] = useState({});
  const [activeApps, setActiveApps] = useState({});
  const [output, setOutput] = useState({});
  const eventSourcesRef = useRef({});
  const [manifests, setManifests] = useState([]);

  const handleSSEMessage = useCallback((processName, event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'status') {
      if (data.data === 'stopped') {
        // remove the process from the output
        setOutput(prev => {
          // eslint-disable-next-line no-unused-vars
          const { [processName]: _, ...rest } = prev;
          return rest;
        });
        return;
      }
      setProcesses(prev => ({
        ...prev,
        [processName]: {
          ...prev[processName],
          status: data.data.status,
          lastUpdate: data.data.timestamp,
          metadata: data.data.metadata,
        },
      }));
      return;
    }

    if (data.type === 'stdout' || data.type === 'stderr') {
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
    }

    if (data.type === 'cache') {
      setOutput(prev => ({
        ...prev,
        [processName]: [
          ...(prev[processName] || []),
          ...data.data.map((line, index) => ({
            id: `${processName}-cache-${index}`,
            friendlyDate: formatDate(new Date().toISOString()),
            data: line,
          })),
        ],
      }));
    }
  }, []);

  // Move all the event source and process management logic here
  const setupEventSource = processName => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/events/${processName}`,
    );

    eventSource.onmessage = event => {
      handleSSEMessage(processName, event);
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
      const { processes: processStatus, apps } = await response.json();
      setProcesses(processStatus);
      setActiveApps(apps);

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

  const fetchManifests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/manifests`);
      const data = await response.json();
      setManifests(data.manifests);
      return data.manifests;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching manifests:', error);
      return [];
    }
  };

  const startProcess = async (processName, processConfig) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${API_BASE_URL}/start-${processName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processConfig),
        signal: controller.signal,
      });

      // eslint-disable-next-line no-console
      console.log('response', response);

      const data = await response.json();

      // eslint-disable-next-line no-console
      console.log('data', data);

      clearTimeout(timeoutId);

      if (response.ok) {
        delete eventSourcesRef.current[processName];
        fetchStatus();
        return true;
      }

      throw new Error('Failed to start process');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      if (error.name === 'AbortError') {
        // remove process from event sources
        delete eventSourcesRef.current[processName];
        fetchStatus();
        return true;
      }
      // eslint-disable-next-line no-console
      console.error(`Error starting ${processName}:`, error);
      return false;
    }
  };

  const stopProcess = async (processName, port) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${API_BASE_URL}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ port }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        if (eventSourcesRef.current[processName]) {
          eventSourcesRef.current[processName].close();
          delete eventSourcesRef.current[processName];
        }
        fetchStatus();
        return true;
      }

      throw new Error('Failed to stop process');
    } catch (error) {
      if (error.name === 'AbortError') {
        // This is expected when server restarts
        fetchStatus();
        return true;
      }
      // eslint-disable-next-line no-console
      console.error(`Error stopping process on port ${port}:`, error);
      return false;
    }
  };

  const value = {
    processes,
    output,
    startProcess,
    stopProcess,
    fetchStatus,
    setupEventSource,
    manifests,
    fetchManifests,
    activeApps: useMemo(() => activeApps, [activeApps]),
    setOutput,
  };

  return (
    <ProcessManagerContext.Provider value={value}>
      {children}
    </ProcessManagerContext.Provider>
  );
};

ProcessManagerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useProcessManager = () => {
  const context = useContext(ProcessManagerContext);
  if (!context) {
    throw new Error(
      'useProcessManager must be used within a ProcessManagerProvider',
    );
  }
  return context;
};
