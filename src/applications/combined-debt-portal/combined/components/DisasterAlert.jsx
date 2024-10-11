import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { isBefore } from 'date-fns';

const GenericDisasterAlert = () => {
  return (
    <va-alert-expandable
      trigger="Need help with VA Debt after a natural disaster?"
      status="info"
      uswds
    >
      <ul>
        <li>
          <strong>For help with VA benefit debt:</strong> Contact our Debt
          Management Center by calling <va-telephone contact="8008270648" /> (or{' '}
          <va-telephone contact="6127136415" international /> from overseas) to
          request temporary financial relief or via{' '}
          <va-link href="https://ask.va.gov" text="Ask VA" /> (select "Veterans
          Affairs-Debt" as the category). We’re here Monday through Friday, 7:30
          a.m. to 7:00 p.m. ET. If you have hearing loss, call{' '}
          <va-telephone tty contact="711" />.
        </li>
        <li>
          <strong>
            For help with VA debt related to medical care and pharmacy services:{' '}
          </strong>
          Call our Health Resource Center at{' '}
          <va-telephone contact="8664001238" /> (
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </li>
      </ul>
    </va-alert-expandable>
  );
};

const SpecialHurricaneAlert = () => {
  const specialHurricaneAlertDisplay = isBefore(
    new Date(),
    new Date('2024/12/09'),
  );
  return specialHurricaneAlertDisplay ? (
    <va-alert-expandable
      status="info"
      trigger="Need help with VA Debt after a natural disaster?"
      uswds
    >
      <h2 id="hurricane-alert" slot="headline">
        Hurricane Disaster Help.
      </h2>
      <p>
        VA is aware of the current disasters surrounding Hurricane Helene and
        Hurricane Milton. If you have been impacted by these hurricanes or any
        other disaster, VA wants to help.
      </p>
      <ul>
        <li>
          <strong>For help with VA benefit debt:</strong> Contact our Debt
          Management Center by calling <va-telephone contact={CONTACTS.DMC} />{' '}
          (or <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />{' '}
          from overseas) to request temporary financial relief or via Ask VA
          (select "Veterans Affairs-Debt" as the category). We’re here Monday
          through Friday, 7:30 a.m. to 7:00 p.m. ET. If you have hearing loss,
          call <va-telephone contact={CONTACTS[711]} tty />.
        </li>
        <li>
          <strong>
            For help with VA debt related to medical care and pharmacy services:{' '}
          </strong>
          Call our Health Resource Center at{' '}
          <va-telephone contact="8664001238" /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </li>
      </ul>
    </va-alert-expandable>
  ) : null;
};

export { GenericDisasterAlert, SpecialHurricaneAlert };
