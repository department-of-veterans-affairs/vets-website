import React from 'react';

const ProcedureCodesAddtlInfo = () => (
  <va-additional-info
    trigger="More information about required procedure codes"
    class="vads-u-margin-y--4"
  >
    <ul>
      <li>
        <strong>DX/ICD-10 codes</strong>, or diagnosis codes, are used to
        identify a specific diagnosis. They’re typically a letter followed by a
        series of 3-7 numbers, usually including a decimal point (example:
        A12.345).
      </li>
      <li>
        <strong>PX/HCPCS codes</strong> are used to identify products, supplies,
        and services. They’re usually 1 alphabet letter followed by 4 digits
        (example: A1234).
      </li>
      <li>
        <strong>CPT codes</strong> are used to identify a medical service or
        procedure. They’re usually a 5-digit code (example: 12345).
      </li>
    </ul>
  </va-additional-info>
);

export default ProcedureCodesAddtlInfo;
