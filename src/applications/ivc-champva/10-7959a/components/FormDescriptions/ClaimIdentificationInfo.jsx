import React from 'react';
import { CHAMPVA_PHONE_NUMBER } from '../../utils/constants';

const ContactHelpText = idType => (
  <p className="vads-u-margin-bottom--0">
    If you can’t find the {idType}, call us at{' '}
    <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
    <va-telephone contact="711" tty />){'. '}
    We’re here Monday through Friday, 8:05 a.m. to 7:30 p.m.{' '}
    <dfn>
      <abbr title="Eastern Time">ET</abbr>
    </dfn>
    .
  </p>
);

const ClaimIdentificationInfo = (
  <div className="vads-u-margin-top--4">
    <p>
      <strong>For PDI numbers</strong> don’t include the date in the beginning
      of the PDI number. Enter the 2 letters and all the numbers after it.
    </p>
    <p>
      <strong>For control numbers</strong> include all the numbers listed under
      “Control Number” on the CHAMPVA explanation of benefits.
    </p>

    <va-additional-info
      trigger="Where to find the PDI number"
      class="vads-u-margin-y--3"
    >
      <span>
        <p className="vads-u-margin-top--0">
          Find the PDI number at the end of the letter we mailed you requesting
          missing documents. It begins with a date, followed by 2 letters (VA,
          PG, FX and CM), and some numbers. Example:
          02/26/2025-VA1753294097390-001.
        </p>
        {ContactHelpText('PDI number')}
      </span>
    </va-additional-info>
    <va-additional-info
      trigger="Where to find the control number"
      class="vads-u-margin-y--3"
    >
      <span>
        <p className="vads-u-margin-top--0">
          Find the control number on the CHAMPVA explanation of benefits we
          mailed you. It’s a 12-digit code or it may begin with the letter “M”
          followed by an 11-digit code. Example: M00001234567.
        </p>
        {ContactHelpText('control number')}
      </span>
    </va-additional-info>
  </div>
);

export default ClaimIdentificationInfo;
