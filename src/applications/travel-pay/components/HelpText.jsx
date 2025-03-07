import React from 'react';

import {
  BTSSS_PORTAL_URL,
  FORM_103542_LINK,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../constants';

export const HelpTextManage = () => {
  return (
    <div>
      <p>
        To manage your travel claims or file a new claim, go to our{' '}
        <va-link
          external
          href={BTSSS_PORTAL_URL}
          text="Beneficiary Travel Self Service System (BTSSS) portal"
        />
        .
      </p>
      <p className="vads-u-margin-top--2">
        Or call the BTSSS call center at <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />) Monday through Friday, 8:00 a.m. to
        8:00 p.m. ET. Have your claim number ready to share when you call.
      </p>
    </div>
  );
};

export const HelpTextGeneral = () => {
  return (
    <div>
      <p>
        Call the BTSSS call center at <va-telephone contact="8555747292" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p className="vads-u-margin-top--2">
        Or call your VA health facility’s Beneficiary Travel contact.
      </p>
      <va-link
        href={FIND_FACILITY_TP_CONTACT_LINK}
        text="Find the travel contact for your facility"
      />
    </div>
  );
};

export const HelpTextModalities = () => {
  return (
    <div>
      <p>You can still file a claim for this appointment these other ways:</p>
      <ul>
        <li>
          <p className="vads-u-margin-y--2">
            Online 24/7 through the Beneficiary Travel Self Service System
            (BTSSS)
          </p>
          <va-link
            external
            href={BTSSS_PORTAL_URL}
            text="File a travel claim online"
          />
        </li>
        <li>
          <p className="vads-u-margin-y--2">
            VA Form 10-3542 by mail, fax, email, or in person
          </p>
          <va-link
            href={FORM_103542_LINK}
            text="Learn more about VA Form 10-3542"
          />
        </li>
      </ul>
    </div>
  );
};
