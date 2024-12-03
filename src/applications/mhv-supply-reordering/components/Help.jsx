import React from 'react';
import DlcTelephoneLink from './DlcTelephoneLink';
import { HEALTH_FACILITIES_URL } from '../constants';

const Help = () => (
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
      Denver Logistics Center at <DlcTelephoneLink />. We’re here Monday through
      Friday, 8:15 a.m. to 5:00 p.m. ET.
    </p>
  </>
);

export default Help;
