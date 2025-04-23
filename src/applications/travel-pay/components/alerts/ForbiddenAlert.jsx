import React from 'react';

import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../constants';

const ForbiddenAlert = () => {
  return (
    <va-alert closeable="false" status="warning" role="status" visible>
      <h2 slot="headline">We can’t find any travel claims for you</h2>
      <p className="vads-u-margin-y--2">If this seems incorrect to you:</p>
      <ul>
        <li>
          <p>
            Try checking in the Beneficiary Travel Self Service System (BTSSS)
            portal.
            <br />
            <va-link-action
              text="Go to the BTSSS portal"
              label="Go to the Beneficiary Travel Self Service System portal"
              href={BTSSS_PORTAL_URL}
            />
          </p>
        </li>
        <li>
          <p>
            Call the BTSSS call center at <va-telephone contact="8555747292" />.
            We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </li>
        <li>
          <p className="vads-u-margin-top--2">
            Or call your VA health facility’s Beneficiary Travel contact.
            <br />
            <va-link
              href={FIND_FACILITY_TP_CONTACT_LINK}
              text="Find the travel contact for your facility"
            />
          </p>
        </li>
      </ul>
    </va-alert>
  );
};

export default ForbiddenAlert;
