import React from 'react';
import { CHAMPVA_PHONE_NUMBER } from '../../utils/constants';

const ClaimIdentificationInfo = (
  <div className="vads-u-margin-top--4">
    <p>
      <strong>For PDI numbers</strong> you don’t need to include the date in the
      beginning of the PDI number. Enter the 2 letters and all of the numbers
      following it.
    </p>
    <p>
      <strong>For control numbers</strong> include all of the numbers listed
      under “Control Number” on the CHAMPVA Explanation of Benefits.
    </p>

    <va-additional-info
      trigger="Where to find the PDI number"
      class="vads-u-margin-y--3"
    >
      <span>
        <p className="vads-u-margin-top--0">
          The PDI number is located at the bottom of the letter we mailed you.
          It begins with a date, followed by 2 letters (VA, PG, FX and CM) and a
          series of numbers (example: 02/26/2025-VA1753294097390-001).
        </p>
        <p className="vads-u-margin-bottom--0">
          If you can’t find the PDI number, call us at{' '}
          <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
          <va-telephone contact="711" tty />){'. '}
          We’re here Monday through Friday, 8:05 a.m. to 7:30 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
      </span>
    </va-additional-info>
    <va-additional-info
      trigger="Where to find the control number"
      class="vads-u-margin-y--3"
    >
      <span>
        <p className="vads-u-margin-top--0">
          The control number is located on the CHAMPVA Explanation of Benefits
          we mailed you. It is a 12-digit code or may begin with the letter “M”
          followed by an 11-digit code (example: M00001234567).
        </p>
        <p className="vads-u-margin-bottom--0">
          If you can’t find the control number, call us at{' '}
          <va-telephone contact={CHAMPVA_PHONE_NUMBER} /> (
          <va-telephone contact="711" tty />){'. '}
          We’re here Monday through Friday, 8:05 a.m. to 7:30 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
      </span>
    </va-additional-info>
  </div>
);

export default ClaimIdentificationInfo;
