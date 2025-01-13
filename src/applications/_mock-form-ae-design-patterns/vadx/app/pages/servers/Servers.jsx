import React, { useEffect } from 'react';
import { FrontendServer } from './FrontendServer';
import { MockServer } from './MockServer';
import { useProcessManager } from '../../../context/processManager';

export const Servers = () => {
  const { fetchManifests, fetchStatus } = useProcessManager();

  useEffect(() => {
    fetchManifests();
    fetchStatus();
  }, []);

  return (
    <div className="vads-l-grid-container--full vads-u-padding-x--2">
      <div className="vads-l-row">
        <div className="vads-l-col--6 vads-l-grid-container vads-u-padding--0">
          <FrontendServer />
        </div>
        <div className="vads-l-col--6 vads-l-grid-container vads-u-padding--0">
          <MockServer />
        </div>
      </div>
    </div>
  );
};
