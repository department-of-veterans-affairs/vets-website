import React from 'react';

import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../constants';

const AppointmentErrorAlert = () => {
  return (
    <va-alert closeable="false" status="error" role="status" visible>
      <h2 slot="headline">
        We’re sorry, we can’t access your appointment details right now
      </h2>
      <p className="vads-u-margin-top--2">
        Because we need details of your appointment to file your mileage-only
        claim we are not able to continue with your claim at this time. Please
        try again later.
      </p>
      <p className="vads-u-margin-top--2">
        If it still doesn’t work, try using the Beneficiary Travel Self Service
        System (BTSSS) portal.
        <br />
        <va-link-action
          text="Go to the BTSSS portal"
          label="Go to the Beneficiary Travel Self Service System portal"
          href={BTSSS_PORTAL_URL}
        />
      </p>

      <p className="vads-u-margin-y--2">
        You can also call the BTSSS call center at{' '}
        <va-telephone contact="8555747292" />. We’re here Monday through Friday,
        8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p className="vads-u-margin-y--0">
        Or call your VA health facility’s Beneficiary Travel contact.
        <br />
        <va-link
          href={FIND_FACILITY_TP_CONTACT_LINK}
          text="Find the travel contact for your facility"
        />
      </p>
    </va-alert>
  );
};

export default AppointmentErrorAlert;
