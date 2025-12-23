import React from 'react';

import useSkipLinkFix from '../hooks/useSkipLinkFix';
import Chatbox from './Chatbox';
import Disclaimer from './Disclaimer/Disclaimer';

export default function StickyBot() {
  useSkipLinkFix();

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          <Chatbox />
        </div>
      </div>
    </div>
  );
}
