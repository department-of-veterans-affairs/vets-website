import React from 'react';
import { Tabs } from '../../../components/Tabs';
import DevPanel from '../DevPanel';
import { FrontendServer } from './FrontendServer';
import { MockServer } from './MockServer';

export const Servers = () => {
  return (
    <div className="vads-l-row">
      <div className="vads-l-col--12 vads-l-grid-container--full">
        <Tabs
          tabs={[
            { label: 'Dev Panel', content: <DevPanel /> },
            { label: 'Frontend Dev Server', content: <FrontendServer /> },
            { label: 'Mock API Server', content: <MockServer /> },
          ]}
          activeTab={0}
        />
      </div>
    </div>
  );
};
