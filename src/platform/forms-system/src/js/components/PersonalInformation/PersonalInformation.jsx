import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { genderLabels } from '~/platform/static-data/labels';
import { selectProfile } from '~/platform/user/selectors';

import { formatNumberForScreenReader } from '../../utilities/ui/mask-string';
import {
  hasRequiredData,
  parseDateToDateObj,
  FORMAT_YMD_DATE_FNS_CONCAT,
  FORMAT_READABLE_DATE_FNS,
} from './utils';
import { adaptFormData } from './adapter';

/**
 * @typedef {Object} FieldConfig - Field configuration object for PersonalInformation component
 * @property {boolean} [showSSN] - Whether to show SSN field
 * @property {boolean} [showVAFileNumber] - Whether to show VA file number
 * @property {boolean} [showDateOfBirth] - Whether to show date of birth
 * @property {boolean} [showGender] - Whether to show gender
 * @property {boolean} [showName] - Whether to show name
 * @property {string | ReactNode} [errorMessage] - Custom error message or ReactNode for missing data
 */

/**
 * @typedef {Object} DataAdapter
 * @property {string} [ssnPath] - Path to SSN in form data
 * @property {string} [vaFileNumberPath] - Path to VA file number in form data
 */

export const PersonalInformation = ({
  formData,
  config = {},
  dataAdapter = {},
}) => {
  const profile = useSelector(selectProfile);
  const adaptedData = adaptFormData(formData, dataAdapter);
  const { ssnLastFour, vaFileLastFour } = adaptedData;
  const { dob, gender, userFullName = {} } = profile;
  const { first, middle, last, suffix } = userFullName;

  const shouldShowErrorOrNull = !hasRequiredData(
    { ...adaptedData, ...profile },
    config,
  );

  if (shouldShowErrorOrNull) {
    return config.errorMessage ? (
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">{config.errorMessage}</div>
      </div>
    ) : null;
  }

  const dobDateObj = parseDateToDateObj(
    dob || null,
    FORMAT_YMD_DATE_FNS_CONCAT,
  );

  // console.log({
  //   shouldShowErrorOrNull,
  //   ssnLastFour,
  //   vaFileLastFour,
  //   dob,
  //   gender,
  //   formData,
  //   dobDateObj,
  // });

  return (
    <>
      <h3 className="vads-u-margin-y--2">
        Confirm the personal information we have on file for you.
      </h3>
      <div className="blue-bar-block">
        {config.showName &&
          (first || last) && (
            <strong
              className="name dd-privacy-hidden"
              data-dd-action-name="Veteran's name"
            >
              {`${first || ''} ${middle || ''} ${last || ''}`}
              {suffix ? `, ${suffix}` : null}
            </strong>
          )}

        {config.showSSN &&
          ssnLastFour && (
            <p className="ssn">
              Social Security number:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Veteran's SSN"
              >
                {formatNumberForScreenReader(ssnLastFour)}
              </span>
            </p>
          )}

        {config.showVAFileNumber &&
          vaFileLastFour && (
            <p className="vafn">
              VA file number:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Veteran's VA file number"
              >
                {formatNumberForScreenReader(vaFileLastFour)}
              </span>
            </p>
          )}

        {config.showDateOfBirth &&
          isValid(dobDateObj) && (
            <p>
              Date of birth:{' '}
              <span
                className="dob dd-privacy-mask"
                data-dd-action-name="Veteran's date of birth"
              >
                {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
              </span>
            </p>
          )}

        {config.showGender &&
          gender && (
            <p>
              Gender:{' '}
              <span
                className="gender dd-privacy-hidden"
                data-dd-action-name="Veteran's gender"
              >
                {genderLabels?.[gender] || ''}
              </span>
            </p>
          )}
      </div>

      <br role="presentation" />

      <p>
        <strong>Note:</strong> If you need to update your personal information,
        you can call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />.
        We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
    </>
  );
};

PersonalInformation.propTypes = {
  config: PropTypes.shape({
    showSSN: PropTypes.bool,
    showVAFileNumber: PropTypes.bool,
    showDateOfBirth: PropTypes.bool,
    showGender: PropTypes.bool,
    showName: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
  dataAdapter: PropTypes.shape({
    ssnPath: PropTypes.string,
    vaFileNumberPath: PropTypes.string,
  }),
  formData: PropTypes.shape({
    veteran: PropTypes.shape({
      ssnLastFour: PropTypes.string,
      vaFileLastFour: PropTypes.string,
    }),
  }),
};
