import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatDate, maskSSN, normalizeFullName } from '../../utils/helpers';

const GuestVerifiedInformation = ({ user }) => {
  const {
    veteranFullName,
    veteranDateOfBirth,
    veteranSocialSecurityNumber,
  } = user;

  const veteranSSN = useMemo(() => maskSSN(veteranSocialSecurityNumber), [
    veteranSocialSecurityNumber,
  ]);

  const veteranDOB = useMemo(
    () => formatDate(veteranDateOfBirth, 'MMMM dd, yyyy'),
    [veteranDateOfBirth],
  );

  const veteranName = useMemo(() => normalizeFullName(veteranFullName, true), [
    veteranFullName,
  ]);

  return (
    <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
      <p>Confirm your information before you continue.</p>
      <va-card data-testid="hca-guest-card">
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Personal Information
        </h2>
        <ul className="hca-list-style-none">
          <li className="vads-u-margin-y--1">
            <strong>Full name:</strong>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran name"
            >
              {veteranName}
            </span>
          </li>
          <li className="vads-u-margin-y--1">
            <strong>Date of birth:</strong>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Date of birth"
            >
              {veteranDOB}
              GVI valid? {moment(veteranDOB) > 1950}
            </span>
          </li>
          <li>
            <strong>Social Security number:</strong>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Social Security number"
            >
              {veteranSSN}
            </span>
          </li>
        </ul>
      </va-card>
    </div>
  );
};

GuestVerifiedInformation.propTypes = {
  user: PropTypes.shape({
    veteranFullName: PropTypes.object,
    veteranDateOfBirth: PropTypes.string,
    veteranSocialSecurityNumber: PropTypes.string,
  }),
};

export default GuestVerifiedInformation;
