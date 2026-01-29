import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import { selectProfile } from '~/platform/user/selectors';
import environment from 'platform/utilities/environment';
import {
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
  getAgeInYears,
  mask,
  parseDateToDateObj,
} from '../helpers';

const PersonalInformation = ({ formData }) => {
  const profile = useSelector(selectProfile);
  const { dob, ssn: profileSsn, userFullName = {} } = profile;
  const { first, middle, last, suffix, dateOfBirth } = userFullName;
  const age = getAgeInYears(dob);
  const fullName = `${first || ''} ${middle || ''} ${last || ''}`.trim();

  // Get SSN from formData or profile, then extract last 4 digits
  const ssn = formData.ssn || profileSsn;
  const ssnLastFour = ssn
    ? ssn
        .toString()
        .replace(/[^\d]/g, '')
        .slice(-4)
    : '';
  const birthDate = dateOfBirth || dob;
  const dobDateObj = parseDateToDateObj(birthDate || null, FORMAT_YMD_DATE_FNS);

  // Check for missing fields
  const missingFields = [];
  if (!first && !last) {
    missingFields.push('name');
  }
  if (!dob || !isValid(dobDateObj)) {
    missingFields.push('date of birth');
  }
  if (!ssn || ssn.toString().replace(/[^\d]/g, '').length < 4) {
    missingFields.push('Social Security number');
  }

  const hasMissingFields = missingFields.length > 0;
  useEffect(
    () => {
      const formPanel = document.querySelector('.form-panel');
      const saveForLater = document.querySelector('.schemaform-save-container');
      const saveInProgressBox = document?.querySelector(
        '.schemaform-chapter-progress',
      );
      const AgeEligibilityAlert = document.getElementById(
        'age-eligibility-alert',
      );
      if ((hasMissingFields && formPanel) || age < 18) {
        formPanel.classList.add('hide-navigation-buttons');
        saveForLater?.classList.add('hide-save-in-progress-box');
        saveInProgressBox?.classList.add('hide-save-in-progress-title');
        AgeEligibilityAlert?.classList.add('hide-alert-box');
      } else if (formPanel && age >= 18) {
        formPanel.classList.remove('hide-navigation-buttons');
        saveForLater?.classList.remove('hide-save-in-progress-box');
        saveInProgressBox?.classList.remove('hide-save-in-progress-title');
        AgeEligibilityAlert?.classList.remove('hide-alert-box');
      }
      return () => {
        if (formPanel && age >= 18) {
          formPanel.classList.remove('hide-navigation-buttons');
          saveForLater?.classList.remove('hide-save-in-progress-box');
          saveInProgressBox?.classList.remove('hide-save-in-progress-title');
          AgeEligibilityAlert?.classList.remove('hide-alert-box');
        }
      };
    },
    [hasMissingFields],
  );

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
          before you can begin this form. For security reasons, we don’t allow
          online changes to this information. To update this information, call
          us at 866-279-3677 (TTY: 711). Tell us you may be missing your{' '}
          {missingFieldsText} and we’ll explain the best way to add that
          information. We’re here Monday through Friday, between 8:00 a.m. and
          8:00 p.m. ET.
        </p>
      </va-alert>
    );
  }

  // Show normal display if all fields are present
  return (
    <div className="personal-information-container">
      <h3 className="vads-u-margin-y--2">
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
            {fullName}
            {suffix ? `, ${suffix}` : null}
          </span>
        </p>
        {ssnLastFour ? (
          <p className="ssn">
            <strong>Last 4 digits of Social Security number:</strong>{' '}
            <span
              className="dd-privacy-mask"
              data-dd-action-name="Veteran's SSN"
            >
              {mask(ssnLastFour)}
            </span>
          </p>
        ) : null}
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
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information, call us at 866-279-3677
        (TTY: 711). We’re here Monday through Friday, between 8:00 a.m. and 8:00
        p.m. ET.
      </p>
      <p className="vads-u-margin-bottom--4">
        <va-link
          external
          href={`${
            environment.BASE_URL
          }/resources/how-to-change-your-legal-name-on-file-with-va/`}
          text="Find more detailed instructions for how to change your legal name"
        />
      </p>
    </div>
  );
};

PersonalInformation.propTypes = {
  formData: PropTypes.shape({
    ssn: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    applicantFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
      dateOfBirth: PropTypes.string,
    }),
  }),
};

export default PersonalInformation;
