import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

/**
 * Help content for the form's footer.
 */
const GetFormHelp = () => {
  return (
    <>
      <p>
        <strong>If you have trouble using your supplies,</strong>{' '}
        <a href="/find-locations/?facilityType=health&serviceType-allVAhealthservices">
          find the phone number for your local VA health facility
        </a>
        .
      </p>
      <p>
        <strong>If you have questions about your supplies,</strong> call our VA
        Denver Logistics Center at{' '}
        <va-telephone contact="3032736200">303-273-6200</va-telephone> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:15 a.m. to 5:00 p.m. ET.
      </p>
    </>
  );
};

export default GetFormHelp;
