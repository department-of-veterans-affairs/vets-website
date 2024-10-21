import React from 'react';

const NeedHelpFooter = () => {
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
        <va-telephone contact="3032736200">303-273-6200</va-telephone> (TTY:
        711). We’re here Monday through Friday, 8:15 a.m. to 5:00 p.m. ET.
      </p>
    </>
  );
};

export default NeedHelpFooter;
