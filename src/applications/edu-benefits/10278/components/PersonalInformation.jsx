import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import { selectProfile } from '~/platform/user/selectors';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { getAppUrl } from '~/platform/utilities/registry-helpers';
import {
  parseDateToDateObj,
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
} from 'platform/forms-system/src/js/components/PersonalInformation/utils';

const PersonalInformation = ({ formData }) => {
  const profile = useSelector(selectProfile);
  const { dob, userFullName = {} } = profile;
  const { first, middle, last, suffix } = userFullName;

  const fullName = formData?.fullName || userFullName;
  const dateOfBirth = formData?.dateOfBirth || dob;

  // Build full name string
  const nameFirst = fullName?.first || first || '';
  const nameMiddle = fullName?.middle || middle || '';
  const nameLast = fullName?.last || last || '';
  const fullNameString = `${nameFirst} ${nameMiddle} ${nameLast}`.trim();

  // Parse date of birth
  const dobDateObj = parseDateToDateObj(dateOfBirth, FORMAT_YMD_DATE_FNS);

  // Check for missing fields
  const missingFields = [];
  if (!nameFirst && !nameLast) {
    missingFields.push('name');
  }
  if (!dateOfBirth || !isValid(dobDateObj)) {
    missingFields.push('date of birth');
  }

  const hasMissingFields = missingFields.length > 0;

  if (hasMissingFields) {
    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });
    const missingFieldsText = formatter.format(missingFields);
    return (
      <va-alert status="error" class="vads-u-margin-bottom--4">
        <h2 slot="headline">We need more information</h2>
        <p className="vads-u-margin-bottom--0">
          Your VA account is missing your {missingFieldsText}, which we need
          before you can begin this form. For security reasons, we don't allow
          online changes to this information. To update this information, call
          us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact="711" tty />
          ). Tell us you may be missing your {missingFieldsText} and we'll
          explain the best way to add that information. We're here Monday
          through Friday, between 8:00 a.m. and 8:00 p.m. ET.
        </p>
      </va-alert>
    );
  }

  // Show normal display if all fields are present
  return (
    <div className="personal-information-container">
      <h3 className="vads-u-margin-bottom--4">
        Confirm the personal information we have on file for you
      </h3>
      <va-card class="data-card">
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Personal information
        </h4>
        <p className="name">
          <strong>Name:</strong>{' '}
          <span
            className="name dd-privacy-hidden"
            data-dd-action-name="Veteran's name"
          >
            {fullNameString}
            {suffix || fullName?.suffix
              ? `, ${suffix || fullName?.suffix}`
              : null}
          </span>
        </p>
        <p className="dob vads-u-margin-bottom--0">
          <strong>Date of birth:</strong>{' '}
          {isValid(dobDateObj) ? (
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's date of birth"
            >
              {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
            </span>
          ) : null}
        </p>
      </va-card>

      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> To protect your personal information, we don't
        allow online changes to your name or date of birth. If you need to
        change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact="711" tty />
        ). We're here Monday through Friday, between 8:00 a.m. and 8:00 p.m. ET.
        We'll give you instructions for how to change your information. Or you
        can learn how to change your legal name on file with VA.{' '}
      </p>
      <p className="vads-u-margin-bottom--4">
        <va-link
          external
          href={getAppUrl('facilities')}
          text="Learn how to change your legal name"
        />
      </p>
    </div>
  );
};

PersonalInformation.propTypes = {
  formData: PropTypes.shape({
    fullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
    dateOfBirth: PropTypes.string,
  }),
};

export default PersonalInformation;
