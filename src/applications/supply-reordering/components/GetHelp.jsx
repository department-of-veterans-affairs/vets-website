import React from 'react';
import {
  VaLink,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getAppUrl } from '~/platform/utilities/registry-helpers';

const GetHelp = () => (
  <>
    <p>
      <span className="vads-u-font-weight--bold">
        If you have trouble using your supplies,{' '}
      </span>
      <VaLink
        href={`${getAppUrl('facilities')}/?facilityType=health`}
        text="find the phone number for your local VA health facility"
      />
    </p>
    <p>
      <span className="vads-u-font-weight--bold">
        If you have questions about your supplies,{' '}
      </span>
      call our VA Denver Logistics Center at{' '}
      <VaTelephone contact="3032736200" /> (<VaTelephone contact="711" tty />
      ). We’re here Monday through Friday, 8:15 a.m. to 5:00 p.m. ET.
    </p>
  </>
);

export default GetHelp;
