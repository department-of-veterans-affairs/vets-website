import React from 'react';
import AskAQuestion from './AskAQuestion';
import AverageProcessingTime from './AverageProcessingTime';
import ConnectWithUs from './ConnectWithUs';
import SchoolCertifyingOfficialHandbook from './SchoolCertifyingOfficialHandbook';

const HubRail = () => {
  return (
    <div
      className="vads-l-col--12 medium-screen:vads-u-padding-x--2p5 medium-screen:vads-l-col--4"
      id="hub-rail"
    >
      <SchoolCertifyingOfficialHandbook />
      <va-accordion bordered="" multi="" className="social hydrated">
        <template shadowrootmode="closed">
          <button
            className="va-accordion__button"
            aria-label="Collapse all accordions"
            aria-controls="  "
            aria-expanded="true"
          >
            Collapse all -
          </button>
          <slot />
        </template>
        <AskAQuestion />
        <AverageProcessingTime />
        <ConnectWithUs />
      </va-accordion>
    </div>
  );
};

export default HubRail;
