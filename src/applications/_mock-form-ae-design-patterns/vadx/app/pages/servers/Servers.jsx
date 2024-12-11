import React from 'react';
import { Tabs } from '../../../components/Tabs';
import DevPanel from '../DevPanel';

export const Servers = () => {
  return (
    <div className="vads-l-row">
      <div className="vads-l-col--12 vads-l-grid-container--full">
        <Tabs
          tabs={[
            { label: 'Dev Panel', content: <DevPanel /> },
            { label: 'Frontend Dev Server', content: 'FE server' },
            { label: 'Mock API Server', content: 'Mock API server' },
          ]}
          activeTab={0}
        />
      </div>
    </div>
  );
};
