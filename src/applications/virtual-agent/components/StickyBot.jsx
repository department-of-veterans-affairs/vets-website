import React from 'react';

import Chatbox from './Chatbox';
import Disclaimer from './Disclaimer/Disclaimer';

// Update the "Skip to content" link to point to the chatbot header for accessibility
// https://github.com/department-of-veterans-affairs/va-virtual-agent/issues/2769
const updateSkipToContentLink = () => {
  const skipToContentLink = document.querySelector(
    'a.show-on-focus[href="#content"]',
  );
  if (skipToContentLink) {
    skipToContentLink.removeAttribute('onclick');
    skipToContentLink.innerHTML = 'Skip to chatbot';
    skipToContentLink.setAttribute('href', '#chatbot-header');
  }
};

export default function StickyBot() {
  React.useEffect(() => {
    updateSkipToContentLink();
  }, []);
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
