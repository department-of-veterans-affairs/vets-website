import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import AuthenticatedShortFormAlert from '../FormAlerts/AuthenticatedShortFormAlert';
import { formatDate, normalizeFullName } from '../../utils/helpers';
import { HIGH_DISABILITY_MINIMUM } from '../../utils/constants';
import { APP_URLS } from '../../utils/appUrls';
import { CONTACTS } from '../../utils/imports';

const AuthProfileInformation = ({ user }) => {
  const { veteranFullName, veteranDateOfBirth, totalDisabilityRating } = user;

  const veteranDOB = useMemo(
    () => formatDate(veteranDateOfBirth, 'MMMM dd, yyyy'),
    [veteranDateOfBirth],
  );
  const veteranName = useMemo(() => normalizeFullName(veteranFullName, true), [
    veteranFullName,
  ]);

  const ShortFormAlert = useMemo(
    () =>
      totalDisabilityRating >= HIGH_DISABILITY_MINIMUM ? (
        <AuthenticatedShortFormAlert />
      ) : null,
    [totalDisabilityRating],
  );

  return (
    <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
      {ShortFormAlert}

      <p>This is the personal information we have on file for you.</p>

      <va-card data-testid="hca-profile-card">
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Personal Information
        </h2>
        <ul className="hca-list-style-none">
          <li className="vads-u-margin-y--1">
            <strong>Full name:</strong>{' '}
            <span
              className="vads-u-margin-bottom--1 dd-privacy-mask"
              data-dd-action-name="Veteran name"
            >
              {veteranName}
            </span>
          </li>
          {veteranDOB ? (
            <li className="vads-u-margin-y--1">
              <strong>Date of birth:</strong>{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Date of birth"
              >
                {veteranDOB}
              </span>
            </li>
          ) : null}
          <li>
            And our records show that you have a{' '}
            <strong>
              VA service-connected disability rating of{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Disability rating"
              >
                {totalDisabilityRating}%
              </span>
              .
            </strong>
          </li>
        </ul>
      </va-card>

      <p>
        <strong>Note:</strong> If you need to update your personal information,
        call our VA benefits hotline at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        . Or you can call your VA medical center to get help changing your name
        on file with VA. Ask for the eligibility department.{' '}
        <va-link
          href={APP_URLS.facilities}
          text="Find a VA medical center near you"
        />
      </p>
    </div>
  );
};

AuthProfileInformation.propTypes = {
  user: PropTypes.shape({
    veteranFullName: PropTypes.object,
    veteranDateOfBirth: PropTypes.string,
    totalDisabilityRating: PropTypes.number,
  }),
};

export default AuthProfileInformation;
