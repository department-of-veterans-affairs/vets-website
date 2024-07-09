import React from 'react';
import AskQuestions from './AskQuestions';
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
        <AskQuestions />
        <ConnectWithUs />
      </va-accordion>
    </div>
  );
};

export default HubRail;
