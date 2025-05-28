import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
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
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Personal Information
        </h4>
        <ul className="hca-list-style-none">
          <li className="vads-u-margin-y--1">
            <span className="vads-u-font-weight--bold">Full name:</span>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran name"
            >
              {veteranName}
            </span>
          </li>
          <li className="vads-u-margin-y--1">
            <span className="vads-u-font-weight--bold">Date of birth:</span>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Date of birth"
            >
              {veteranDOB}
            </span>
          </li>
          <li className="vads-u-margin-top--1">
            <span className="vads-u-font-weight--bold">
              Social Security number:
            </span>{' '}
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
