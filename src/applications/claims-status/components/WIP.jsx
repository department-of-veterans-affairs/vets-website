import React from 'react';

const WIP = () => (
  <va-alert status="warning" uswds="false">
    <h2 slot="headline">
      Decision letters aren’t available to download right now.
    </h2>
    <p className="vads-u-margin-y--0">
      We’re fixing some problems with this tool. Check back later. If you need
      information about your decision letters now, call us at{' '}
      <va-telephone contact="8008271000" uswds="false" /> (TTY: 711). We’re here
      Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
  </va-alert>
);

export default WIP;
