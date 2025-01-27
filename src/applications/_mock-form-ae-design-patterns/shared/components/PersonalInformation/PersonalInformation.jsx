import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { genderLabels } from '~/platform/static-data/labels';
import { selectProfile } from '~/platform/user/selectors';
import { getAppUrl } from '~/platform/utilities/registry-helpers';
import { formatNumberForScreenReader } from '~/platform/forms-system/src/js/utilities/ui/mask-string';

import { DefaultErrorMessage } from './DefaultErrorMessage';

import {
  getMissingData,
  parseDateToDateObj,
  FORMAT_READABLE_DATE_FNS,
  getChildrenByType,
  FORMAT_YMD_DATE_FNS,
} from './utils';

import { adaptFormData } from './adapter';

/**
 * @typedef {Object} FieldConfig
 * @property {boolean} show - Whether to show the field
 * @property {boolean} required - Whether the field is required
 */

/**
 * @typedef {Object} PersonalInformationConfig - Field configuration object for PersonalInformation component
 * @property {FieldConfig} [name] - Name field configuration
 * @property {FieldConfig} [ssn] - SSN field configuration
 * @property {FieldConfig} [vaFileNumber] - VA file number field configuration
 * @property {FieldConfig} [dateOfBirth] - Date of birth field configuration
 * @property {FieldConfig} [gender] - Gender field configuration
 */

const defaultFieldConfig = {
  show: true,
  required: true,
};

/**
 * @type {PersonalInformationConfig}
 */
const defaultConfig = {
  name: { ...defaultFieldConfig },
  ssn: { ...defaultFieldConfig },
  vaFileNumber: { show: false, required: false },
  dateOfBirth: { ...defaultFieldConfig },
  gender: { show: false, required: false },
};

/**
 * @typedef {Object} DataAdapter
 * @property {string} [ssnPath] - Path to SSN in form data example: `'veteran.lastFourSSN'`
 * @property {string} [vaFileNumberPath] - Path to VA file number in form data example: `'veteran.vaFileNumber'`
 */

/**
 * @param {Object} props - Component props
 * @param {Object} props.data - Form data object
 * @param {PersonalInformationConfig} props.config - Field configuration object
 * @param {DataAdapter} props.dataAdapter - Data adapter object
 * @param {ReactNode} props.children - React children
 * @param {string | ReactNode} props.errorMessage - Custom error message or ReactNode for missing data
 * @returns {ReactNode} - Rendered component
 */
export const PersonalInformation = ({
  data,
  config = {},
  dataAdapter = {},
  children,
  NavButtons,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
  errorMessage,
}) => {
  const finalConfig = { ...defaultConfig, ...config };

  const finalErrorMessage = errorMessage || DefaultErrorMessage;

  const profile = useSelector(selectProfile);
  const adaptedData = adaptFormData(data, dataAdapter);
  const { ssn, vaFileLastFour } = adaptedData;
  const { dob, gender, userFullName = {} } = profile;
  const { first, middle, last, suffix } = userFullName;

  const missingData = getMissingData(
    { ...adaptedData, ...profile },
    finalConfig,
  );

  const { note, header, footer } = getChildrenByType(children);

  if (missingData.length > 0) {
    let messageComponent;

    // check if the error message is a function
    if (typeof finalErrorMessage === 'function') {
      messageComponent = finalErrorMessage({ missingFields: missingData });
    }
    return (
      <va-alert status="error" class="vads-u-margin-bottom--4">
        <h2 slot="headline">We need more information</h2>

        <div className="vads-u-margin-y--0">
          {messageComponent || finalErrorMessage}
        </div>
      </va-alert>
    );
  }

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      {header || (
        <h3 className="vads-u-margin-bottom--3">
          Confirm the personal information we have on file for you.
        </h3>
      )}
      <div className="vads-u-display--flex">
        <va-card>
          <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Personal information
          </h4>
          {finalConfig.name?.show && (
            <p>
              <strong
                className="name dd-privacy-hidden"
                data-dd-action-name="Veteran's name"
              >
                Name:{' '}
              </strong>
              {first || last ? (
                `${first || ''} ${middle || ''} ${last || ''}`
              ) : (
                <span data-testid="name-not-available">Not available</span>
              )}
              {suffix ? `, ${suffix}` : null}
            </p>
          )}
          {finalConfig.ssn?.show && (
            <p>
              <strong>Last 4 digits of Social Security number: </strong>
              {ssn ? (
                <span data-dd-action-name="Veteran's SSN">
                  {formatNumberForScreenReader(ssn)}
                </span>
              ) : (
                <span data-testid="ssn-not-available">Not available</span>
              )}
            </p>
          )}
          {finalConfig.vaFileNumber?.show && (
            <p>
              <strong>Last 4 digits of VA file number: </strong>
              {vaFileLastFour ? (
                <span
                  className="dd-privacy-mask"
                  data-dd-action-name="Veteran's VA file number"
                >
                  {formatNumberForScreenReader(vaFileLastFour)}
                </span>
              ) : (
                <span data-testid="va-file-number-not-available">
                  Not available
                </span>
              )}
            </p>
          )}
          {finalConfig.dateOfBirth?.show && (
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
                <span data-testid="dob-not-available">Not available</span>
              )}
            </p>
          )}
          {finalConfig.gender?.show && (
            <p>
              <strong>Gender: </strong>
              {gender ? (
                <span
                  className="gender dd-privacy-hidden"
                  data-dd-action-name="Veteran's gender"
                >
                  {genderLabels?.[gender]}
                </span>
              ) : (
                <span data-testid="gender-not-available">Not available</span>
              )}
            </p>
          )}
        </va-card>
      </div>

      {note || (
        <div className="vads-u-margin-bottom--4" data-testid="default-note">
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

      {contentBeforeButtons || null}
      <NavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons || null}
    </>
  );
};

const fieldConfigShape = PropTypes.shape({
  show: PropTypes.bool,
  required: PropTypes.bool,
});

PersonalInformation.propTypes = {
  NavButtons: PropTypes.func,
  children: PropTypes.node,
  config: PropTypes.shape({
    name: fieldConfigShape,
    ssn: fieldConfigShape,
    vaFileNumber: fieldConfigShape,
    dateOfBirth: fieldConfigShape,
    gender: fieldConfigShape,
  }),
  contentAfterButtons: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.func),
  ]),
  contentBeforeButtons: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.func),
  ]),
  data: PropTypes.object,
  dataAdapter: PropTypes.shape({
    ssnPath: PropTypes.string,
    vaFileNumberPath: PropTypes.string,
  }),
  errorMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  formData: PropTypes.shape({
    veteran: PropTypes.shape({
      ssnLastFour: PropTypes.string,
      vaFileLastFour: PropTypes.string,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

// the following are the allowed child components for the PersonalInformation component
// you would wrap your custom components in these to use them as children of the PersonalInformation component
export const PersonalInformationNote = ({ children }) => {
  return <>{children}</>;
};

export const PersonalInformationHeader = ({ children }) => {
  return <>{children}</>;
};

export const PersonalInformationFooter = ({ children }) => {
  return <>{children}</>;
};

const ChildPropTypes = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.arrayOf(PropTypes.func),
]);

PersonalInformationNote.propTypes = {
  children: ChildPropTypes,
};

PersonalInformationHeader.propTypes = {
  children: ChildPropTypes,
};

PersonalInformationFooter.propTypes = {
  children: ChildPropTypes,
};
