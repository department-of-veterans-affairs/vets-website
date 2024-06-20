import React from 'react';

const DisasterAlert = () => {
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
          request temporary financial relief or via Ask VA at{' '}
          <a href="https://ask.va.gov">https://ask.va.gov</a> (select "Veterans
          Affairs-Debt" as the category). We’re here Monday through Friday, 7:30
          a.m. to 7:00 p.m. ET. If you have hearing loss, call
          <va-telephone tty contact="711" />.
        </li>
        <li>
          <strong>
            For help with VA debt related to medical care and pharmacy services:{' '}
          </strong>
          Call our Health Resource Center at{' '}
          <va-telephone contact="8664001213" />(
          <va-telephone tty contact="711" />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </li>
      </ul>
    </va-alert-expandable>
  );
};

export default DisasterAlert;
