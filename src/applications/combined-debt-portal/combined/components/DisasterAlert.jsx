import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GenericDisasterAlert = () => {
  return (
    <va-alert-expandable
      trigger="Need help with VA debt after a natural disaster?"
      status="info"
      uswds
      class="vads-u-margin-bottom--4"
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
            <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
            <va-telephone contact={CONTACTS[711]} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </li>
      </ul>
    </va-alert-expandable>
  );
};

export { GenericDisasterAlert };
