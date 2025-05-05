import React, { useEffect } from 'react';
import { FrontendServerColumn } from './FrontendServerColumn';
import { MockServerColumn } from './MockServerColumn';
import { useProcessManager } from '../../../context/processManager';

export const Servers = () => {
  const { fetchManifests, fetchStatus } = useProcessManager();

  useEffect(() => {
    fetchManifests();
    fetchStatus();
  }, [fetchManifests, fetchStatus]);

  return (
    <div className="vads-l-grid-container--full vads-u-padding-x--2">
      <div className="vads-l-row">
        <div className="vads-l-col--6 vads-l-grid-container vads-u-padding--0">
          <FrontendServerColumn />
        </div>
        <div className="vads-l-col--6 vads-l-grid-container vads-u-padding--0">
          <MockServerColumn />
        </div>
      </div>
    </div>
  );
};
