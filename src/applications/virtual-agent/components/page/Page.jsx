import React from 'react';
import Disclaimer from './Disclaimer';
import App from '../app/App';

export default function Page(props) {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
          <App {...props} />
        </div>
      </div>
    </div>
  );
}
