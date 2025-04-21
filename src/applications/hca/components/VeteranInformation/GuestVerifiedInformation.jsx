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
      <va-card data-testid="hca-guest-card" background>
        <ul className="hca-list-style-none">
          <li>
            <span className="vads-u-visibility--screen-reader">Full name:</span>{' '}
            <span
              className="vads-u-font-weight--bold vads-u-margin-bottom--1 dd-privacy-mask"
              data-dd-action-name="Veteran name"
            >
              {veteranName}
            </span>
          </li>
          <li className="vads-u-margin--0">
            <span>Date of birth:</span>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Date of birth"
            >
              {veteranDOB}
            </span>
          </li>
          <li>
            <span>Social Security number:</span>{' '}
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
