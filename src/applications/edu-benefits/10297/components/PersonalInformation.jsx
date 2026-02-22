import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import { selectProfile } from '~/platform/user/selectors';
import {
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
  mask,
  parseDateToDateObj,
} from '../helpers';

const PersonalInformation = ({ formData }) => {
  const profile = useSelector(selectProfile);
  const { dob, ssn: profileSsn, userFullName = {} } = profile;
  const { first, middle, last, suffix, dateOfBirth } = userFullName;
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

  return (
    <div className="personal-information-container">
      <h3 className="vads-u-margin-y--2">Review your personal information</h3>
      <p>
        We have this personal information on file for you. If you want to update
        your personal information for other VA benefits, update your information
        on your <va-link href="/profile" text="profile" />.
      </p>
      <p>
        <b>Note:</b> If you want to request that we change your name or date of
        birth, you will need to send additional information. Learn more on how
        to change your legal name,{' '}
        <va-link
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
          text="on file with VA"
        />
        .
      </p>
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
