import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { formatDate } from '../../utils/helpers/general';
import { normalizeFullName } from '../../utils/helpers';
import { APP_URLS } from '../../utils/constants';

const AuthProfileInformation = ({ user }) => {
  const { veteranFullName, veteranDateOfBirth, totalDisabilityRating } = user;
  const veteranDOB = veteranDateOfBirth
    ? formatDate(veteranDateOfBirth, 'MMMM dd, yyyy')
    : null;
  const veteranName = normalizeFullName(veteranFullName, true);
  return (
    <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
      <p>This is the personal information we have on file for you.</p>
      <va-card data-testid="hca-profile-card" background>
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
          {veteranDOB ? (
            <li>
              <span>Date of birth:</span>{' '}
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
  user: PropTypes.object,
};

export default AuthProfileInformation;
