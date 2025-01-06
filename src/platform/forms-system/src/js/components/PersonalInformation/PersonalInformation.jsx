import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { genderLabels } from '~/platform/static-data/labels';
import { selectProfile } from '~/platform/user/selectors';

import { getAppUrl } from '~/platform/utilities/registry-helpers';
import { srSubstitute } from '../../utilities/ui/mask-string';

import {
  getMissingData,
  parseDateToDateObj,
  FORMAT_YMD_DATE_FNS_CONCAT,
  FORMAT_READABLE_DATE_FNS,
} from './utils';
import { adaptFormData } from './adapter';

const srSpacedNumber = number => {
  if (!number && number !== 0) return null;

  return number
    .toString()
    .slice(-4)
    .split('')
    .join(' ');
};

const ALLOWED_CHILD_COMPONENTS = {
  NOTE: 'PersonalInformationNote',
  HEADER: 'PersonalInformationHeader',
  FOOTER: 'PersonalInformationFooter',
};

/**
 * @typedef {Object} PersonalInformationConfig - Field configuration object for PersonalInformation component
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

/**
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data object
 * @param {PersonalInformationConfig} props.config - Field configuration object
 * @param {DataAdapter} props.dataAdapter - Data adapter object
 * @param {ReactNode} props.children - React children
 * @returns {ReactNode} - Rendered component
 */
export const PersonalInformation = ({
  formData,
  config = {},
  dataAdapter = {},
  children,
}) => {
  /**
   * @type {PersonalInformationConfig}
   */
  const defaultConfig = {
    showSSN: true,
    showVAFileNumber: true,
    showDateOfBirth: true,
    showGender: true,
    showName: true,
    errorMessage: 'Required information is missing.',
  };

  const finalConfig = { ...defaultConfig, ...config };

  const profile = useSelector(selectProfile);
  const adaptedData = adaptFormData(formData, dataAdapter);
  const { ssnLastFour, vaFileLastFour } = adaptedData;
  const { dob, gender, userFullName = {} } = profile;
  const { first, middle, last, suffix } = userFullName;

  const missingData = getMissingData(
    { ...adaptedData, ...profile },
    finalConfig,
  );

  const getChildrenByType = () => {
    const childrenByType = {
      note: null,
      header: null,
      footer: null,
      other: [], // For any unrecognized children
    };

    React.Children.forEach(children, child => {
      if (!child) return;

      switch (child?.type?.name) {
        case ALLOWED_CHILD_COMPONENTS.NOTE:
          childrenByType.note = child;
          break;
        case ALLOWED_CHILD_COMPONENTS.HEADER:
          childrenByType.header = child;
          break;
        case ALLOWED_CHILD_COMPONENTS.FOOTER:
          childrenByType.footer = child;
          break;
        default:
          childrenByType.other.push(child);
      }
    });

    return childrenByType;
  };

  const { note, header, footer } = getChildrenByType();

  if (missingData.length > 0) {
    return config.errorMessage ? (
      <va-alert status="error">
        <h2 slot="headline">
          Sorry, we couldn’t access the information you need.
        </h2>
        <>
          <p className="vads-u-margin-y--0">
            {config.errorMessage}
            <ul>
              {missingData.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </p>
        </>
      </va-alert>
    ) : null;
  }

  const dobDateObj = parseDateToDateObj(
    dob || null,
    FORMAT_YMD_DATE_FNS_CONCAT,
  );

  return (
    <>
      {header || (
        <h3 className="vads-u-margin-bottom--3">
          Confirm the personal information we have on file for you.
        </h3>
      )}
      <div className="vads-u-display--flex">
        <va-card>
          {config.showName && (
            <p>
              <strong
                className="name dd-privacy-hidden"
                data-dd-action-name="Veteran's name"
              >
                Name:{' '}
              </strong>
              {`${first || ''} ${middle || ''} ${last || ''}`}
              {suffix ? `, ${suffix}` : null}
            </p>
          )}
          {config.showSSN &&
            ssnLastFour && (
              <p>
                <strong>Last 4 digits of Social Security number: </strong>
                <span data-dd-action-name="Veteran's SSN">
                  {srSubstitute(ssnLastFour, srSpacedNumber(ssnLastFour))}
                </span>
              </p>
            )}
          {config.showVAFileNumber &&
            vaFileLastFour && (
              <p>
                <strong>Last 4 digits of VA file number: </strong>
                <span
                  className="dd-privacy-mask"
                  data-dd-action-name="Veteran's VA file number"
                >
                  {srSubstitute(vaFileLastFour, srSpacedNumber(vaFileLastFour))}
                </span>
              </p>
            )}
          {config.showDateOfBirth && (
            <p>
              <strong>Date of birth: </strong>
              {isValid(dobDateObj) ? (
                <span
                  className="dob dd-privacy-mask"
                  data-dd-action-name="Veteran's date of birth"
                >
                  {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
                </span>
              ) : (
                <span>Not available</span>
              )}
            </p>
          )}
          {config.showGender && (
            <p>
              <strong>Gender: </strong>
              <span
                className="gender dd-privacy-hidden"
                data-dd-action-name="Veteran's gender"
              >
                {genderLabels?.[gender] || ''}
              </span>
            </p>
          )}
        </va-card>
      </div>

      {note || (
        <div className="vads-u-margin-bottom--4">
          <p>
            <strong>Note:</strong> To protect your personal information, we
            don’t allow online changes to your name, Social Security number,
            date of birth, or gender. If you need to change this information,
            call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
            <va-telephone contact="711" tty />
            ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
            ET. We’ll give you instructions for how to change your information.
            Or you can learn how to change your legal name on file with VA.{' '}
          </p>
          <va-link
            external
            href={getAppUrl('facilities')}
            text="Learn how to change your legal name"
          />
        </div>
      )}

      {footer || null}
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
