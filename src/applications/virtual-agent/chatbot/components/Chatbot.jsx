import React from 'react';

import Disclaimer from '../../shared/components/Disclaimer/Disclaimer';
import useSkipLinkFix from '../../shared/hooks/useSkipLinkFix';

export const Chatbot = () => {
  useSkipLinkFix();

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          <h3>V2 Chatbot Placeholder</h3>
          <p className="vads-u-font-style--italic">Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};
