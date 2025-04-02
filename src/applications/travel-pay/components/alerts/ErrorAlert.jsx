import React from 'react';
import PropTypes from 'prop-types';

import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../constants';

import ForbiddenAlert from './ForbiddenAlert';

const ErrorAlert = ({ errorStatus }) => {
  if (errorStatus.toString().startsWith('4')) {
    return <ForbiddenAlert />;
  }

  return (
    <va-alert closeable="false" status="error" role="status" visible>
      <h2 slot="headline">
        We’re sorry, we can’t access your travel claims right now
      </h2>
      <p className="vads-u-margin-top--2">
        There’s a problem with our system. Check back later or try checking in
        the Beneficiary Travel Self Service System (BTSSS) portal.
        <br />
        <va-link-action
          text="Go to the BTSSS portal"
          label="Go to the Beneficiary Travel Self Service System portal"
          href={BTSSS_PORTAL_URL}
        />
      </p>

      <p className="vads-u-margin-y--2">
        If it still doesn’t work, call the BTSSS call center at{' '}
        <va-telephone contact="8555747292" />. We’re here Monday through Friday,
        8:00 a.m. to 8:00 p.m. ET.
      </p>
      <p className="vads-u-margin-y--0">
        Or call your VA health facility’s Beneficiary Travel contact.
        <br />
        <va-link
          href={FIND_FACILITY_TP_CONTACT_LINK}
          text="Find the travel contact for your facility"
        />
      </p>
    </va-alert>
  );
};

ErrorAlert.propTypes = {
  errorStatus: PropTypes.number,
};

export default ErrorAlert;
