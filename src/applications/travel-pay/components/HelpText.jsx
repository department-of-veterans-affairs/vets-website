import React from 'react';

export default function HelpText() {
  const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';

  return (
    <>
      <h2 className="help-heading">
        Need to manage your travel reimbursement claim?
      </h2>
      <p>
        You can login to the
        <a href={BTSSS_PORTAL_URL}>BTSSS portal</a>
        &nbsp;&nbsp;
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="14px"
          fill="#005ea2"
        >
          <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
        </svg>
        <br />
        You can also make note of your travel claim number and call the VA's
        Beneficiary Travel toll-free call center at 855-574-7292. Hours: 7 a.m.
        to 7 p.m. Monday through Friday.
      </p>
      <va-need-help className="hydrated">
        <div slot="content">
          <p>
            Call us at{' '}
            <va-telephone contact="8008271000" className="hydrated" />. We're
            here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
            hearing loss,{' '}
            <va-telephone contact="711" tty="true" className="hydrated" />.
          </p>
        </div>
      </va-need-help>
    </>
  );
}
