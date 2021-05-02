import React from 'react';
import Disclaimer from './Disclaimer';
import App from '../app/App';

export default function Page() {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-bottom--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5">
          <App />
        </div>
      </div>
    </div>
  );
}
