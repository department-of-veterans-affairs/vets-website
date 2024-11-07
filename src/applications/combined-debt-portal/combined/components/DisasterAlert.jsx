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
      trigger="Need help with VA debt after a natural disaster?"
      class="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0"
      uswds
    >
      <ul>
        <li>
          <strong>
            For temporary help with debt from benefit overpayments
          </strong>
          <p className="vads-u-margin-top--0">
            Call our Debt Management Center at{' '}
            <va-telephone contact={CONTACTS.DMC} /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). If you’re outside the U.S., call{' '}
            <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />.
            We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
          <p>
            Or contact us online through Ask VA. Select "Veterans Affairs -
            Debt" as the category.
          </p>
          <va-link
            href="https://ask.va.gov"
            text="Contact us online through Ask VA"
          />
        </li>
        <li>
          <strong>
            For temporary help with debt from health care copay bills
          </strong>
          <p className="vads-u-margin-top--0">
            Call our Health Resource Center at{' '}
            <va-telephone contact="8664001238" /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </li>
      </ul>
    </va-alert-expandable>
  ) : null;
};

export { GenericDisasterAlert, SpecialHurricaneAlert };
