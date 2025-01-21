import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLOA3 as isLOA3Selector } from 'platform/user/selectors';

import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../constants';

import VerifyIdentityAlert from './VerifyIdentityAlert';
import ForbiddenAlert from './ForbiddenAlert';

const ErrorAlert = ({ errorStatus, isIdentityVerified }) => {
  if (errorStatus === 400 || !isIdentityVerified) {
    return <VerifyIdentityAlert />;
  }

  if (errorStatus === 403) {
    return <ForbiddenAlert />;
  }

  return (
    <>
      <va-alert closealble="false" status="error" role="status" visible>
        <h2 slot="headline">
          We’re sorry, we can’t access your Travel claims right now
        </h2>
        <p className="vads-u-margin-top--2">
          We’re sorry. There’s a problem with our system. Check back later or
          try checking in the Beneficiary Travel Self Service System (BTSSS)
          portal.
          <va-link-action
            text="Go to the BTSSS portal (opens in a new tab)"
            href={BTSSS_PORTAL_URL}
          />
        </p>

        <p className="vads-u-margin-y--2">
          If it still doesn’t work, call the BTSSS call center at{' '}
          <va-telephone contact="8555747292" />. We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
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
    </>
  );
};

ErrorAlert.propTypes = {
  errorStatus: PropTypes.number,
  isIdentityVerified: PropTypes.bool,
};

export const mapStateToProps = state => {
  const isIdentityVerified = isLOA3Selector(state);

  return {
    isIdentityVerified,
  };
};

export default connect(mapStateToProps)(ErrorAlert);
