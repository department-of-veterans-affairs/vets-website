import React from 'react';
import { Tabs } from '../../../components/Tabs';

export const Servers = () => {
  return (
    <div className="vads-l-grid-container--full vads-u-padding--2">
      <h1 className="vads-u-font-size--h4">VADX - Servers</h1>
      <div className="vads-l-row">
        <div className="vads-l-col--12 vads-l-grid-container vads-u-padding--0">
          <Tabs
            tabs={[
              { label: 'Frontend Dev Server', content: 'FE server' },
              { label: 'Mock API Server', content: 'Mock API server' },
            ]}
            activeTab={0}
          />
        </div>
      </div>
    </div>
  );
};
