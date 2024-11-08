import React from 'react';
import DlcPhone from './DlcPhone';
import { HEALTH_FACILITIES_URL } from '../constants';

/**
 * Help content for the form's footer.
 */
const GetFormHelp = () => {
  return (
    <>
      <p>
        <strong>If you have trouble using your supplies,</strong>{' '}
        <a href={HEALTH_FACILITIES_URL}>
          find the phone number for your local VA health facility
        </a>
        .
      </p>
      <p>
        <strong>If you have questions about your supplies,</strong> call our VA
        Denver Logistics Center at <DlcPhone />. We’re here Monday through
        Friday, 8:15 a.m. to 5:00 p.m. ET.
      </p>
    </>
  );
};

export default GetFormHelp;
