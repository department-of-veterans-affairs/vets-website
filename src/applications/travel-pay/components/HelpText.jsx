import React from 'react';

export default function HelpText() {
  const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';

  return (
    <>
      <h2 className="help-heading">
        Need to manage your travel reimbursement claim?
      </h2>
      <p>
        You can login to the{' '}
        <a className="btsss-portal-link" href={BTSSS_PORTAL_URL}>
          BTSSS portal
          <va-icon
            aria-hidden="true"
            className="vads-u-margin-left--2p5"
            icon="launch"
            size={2}
          />
        </a>
        <br />
        You can also make note of your travel claim number and call the VA's
        Beneficiary Travel toll-free call center at 855-574-7292. Hours: 7 a.m.
        to 7 p.m. Monday through Friday.
      </p>
      <va-need-help>
        <div slot="content">
          <p>
            Call us at <va-telephone contact="8008271000" />. We're here Monday
            through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,{' '}
            <va-telephone contact="711" tty="true" />.
          </p>
        </div>
      </va-need-help>
    </>
  );
}
