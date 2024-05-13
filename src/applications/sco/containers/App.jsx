import React from 'react';
import MainContent from '../components/MainContent';
import HubRail from '../components/HubRail';

const App = () => {
  return (
    <div>
      <div className="row">
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row medium-screen:vads-u-margin-x--neg2p5">
            <MainContent />
            <HubRail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
