import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { normalizeFullName } from '../../utils/helpers';

const GuestVerifiedInformation = ({ user }) => {
  const {
    veteranFullName,
    veteranDateOfBirth,
    veteranSocialSecurityNumber,
  } = user;
  const veteranSSN = `xxx-xx-${veteranSocialSecurityNumber.substring(
    veteranSocialSecurityNumber.length - 4,
  )}`;
  const veteranDOB = moment(veteranDateOfBirth).format('MMMM DD, YYYY');
  const veteranName = normalizeFullName(veteranFullName, true);
  return (
    <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
      <p data-testid="hca-guest-confirm-intro">
        Confirm your information before you continue.
      </p>
      <div className="vads-u-border-left--7px vads-u-border-color--primary vads-u-padding-y--1 vads-u-margin-bottom--3">
        <dl className="vads-u-padding-left--1 vads-u-margin-y--0">
          <div data-testid="hca-veteran-fullname">
            <dt className="vads-u-visibility--screen-reader">Full name:</dt>
            <dd
              className="vads-u-font-weight--bold dd-privacy-mask"
              data-dd-action-name="Veteran name"
            >
              {veteranName}
            </dd>
          </div>
          <div data-testid="hca-veteran-ssn">
            <dt className="vads-u-display--inline-block vads-u-margin-right--0p5">
              Social Security number:
            </dt>
            <dd
              className="vads-u-display--inline-block dd-privacy-mask"
              data-dd-action-name="Veteran Social Security number"
            >
              {veteranSSN}
            </dd>
          </div>
          <div data-testid="hca-veteran-dob">
            <dt className="vads-u-display--inline-block vads-u-margin-right--0p5">
              Date of birth:
            </dt>
            <dd
              className="vads-u-display--inline-block dd-privacy-mask"
              data-dd-action-name="Veteran date of birth"
            >
              {veteranDOB}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

GuestVerifiedInformation.propTypes = {
  user: PropTypes.object,
};

export default GuestVerifiedInformation;
