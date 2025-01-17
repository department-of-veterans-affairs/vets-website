import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLOA3 as isLOA3Selector } from 'platform/user/selectors';

import { BTSSS_PORTAL_URL } from '../../constants';
import { HelpTextGeneral, HelpTextManage } from '../HelpText';

import VerifyIdentityAlert from './VerifyIdentityAlert';
import NonVeteranAlert from './NonVeteranAlert';

const ErrorAlert = ({ errorStatus, isIdentityVerified }) => {
  if (errorStatus === 400 || !isIdentityVerified) {
    return (
      <>
        <VerifyIdentityAlert />
        <p>
          If you have previously filed claims, you can still view them online by
          visiting our{' '}
          <va-link
            external
            href={BTSSS_PORTAL_URL}
            text="Beneficiary Travel Self Service System (BTSSS) portal"
          />
          .
        </p>
      </>
    );
  }

  if (errorStatus === 403) {
    return (
      <>
        <NonVeteranAlert />
        <va-need-help class="vads-u-margin-top--2">
          <div slot="content">
            <HelpTextGeneral />
          </div>
        </va-need-help>
      </>
    );
  }

  return (
    <>
      <va-alert closealble="false" status="error" role="status" visible>
        <h2 slot="headline">
          We’re sorry, we can’t access your Travel claims right now
        </h2>
        <p className="vads-u-margin-y--1">
          We’re sorry. There’s a problem with our system. Check back later.
        </p>
        <p>
          If it still doesn’t work, call the BTSSS call center at{' '}
          <va-telephone contact="8555747292" />. We’re here Monday through
          Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </va-alert>
      <va-need-help class="vads-u-margin-top--2">
        <div slot="content">
          <HelpTextManage />
        </div>
      </va-need-help>
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
