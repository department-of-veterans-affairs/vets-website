import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import { genderLabels } from 'platform/static-data/labels';
import { selectProfile } from 'platform/user/selectors';
import { formatNumberForScreenReader } from 'platform/forms-system/src/js/utilities/ui/mask-string';
import {
  parseDateToDateObj,
  FORMAT_READABLE_DATE_FNS,
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
 * @property {FieldConfig} [sex] - Sex field configuration
 */

/**
 * @type {FieldConfig}
 */
const defaultFieldConfig = {
  show: true,
  required: false,
};

/**
 * @type {PersonalInformationConfig}
 */
export const defaultConfig = {
  name: { ...defaultFieldConfig },
  ssn: { ...defaultFieldConfig },
  vaFileNumber: { show: false, required: false },
  dateOfBirth: { ...defaultFieldConfig },
  sex: { show: false, required: false },
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
export const PersonalInformationReview = ({
  data,
  config = {},
  dataAdapter = {},
  title,
}) => {
  const finalConfig = { ...defaultConfig, ...config };

  const profile = useSelector(selectProfile);
  const adaptedData = adaptFormData(data, dataAdapter);
  const { ssn, vaFileLastFour } = adaptedData;
  const { dob, gender, userFullName = {} } = profile;
  const { first, middle, last, suffix } = userFullName;

  const dobDateObj = parseDateToDateObj(dob || null, FORMAT_YMD_DATE_FNS);

  return (
    <>
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <div className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
            <h3 className="vads-u-margin-top--0 vads-u-font-size--h5">
              {title}
            </h3>
          </div>
        </div>
        <dl className="review">
          {finalConfig.name?.show && (
            <div className="review-row">
              <dt>Name</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="Veteran's name"
              >
                {first || last ? (
                  `${first || ''} ${middle || ''} ${last || ''}`
                ) : (
                  <span data-testid="name-not-available">Not available</span>
                )}
                {suffix ? `, ${suffix}` : null}
              </dd>
            </div>
          )}
          {finalConfig.ssn?.show && (
            <div className="review-row">
              <dt>Last 4 digits of Social Security number</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="Veteran's SSN"
              >
                {ssn ? (
                  <span data-dd-action-name="Veteran's SSN">
                    {formatNumberForScreenReader(ssn)}
                  </span>
                ) : (
                  <span data-testid="ssn-not-available">Not available</span>
                )}
              </dd>
            </div>
          )}
          {finalConfig.vaFileNumber?.show && (
            <div className="review-row">
              <dt>Last 4 digits of VA file number</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="Veteran's VA file number"
              >
                {vaFileLastFour ? (
                  <span data-dd-action-name="Veteran's VA file number">
                    {formatNumberForScreenReader(vaFileLastFour)}
                  </span>
                ) : (
                  <span data-testid="va-file-number-not-available">
                    Not available
                  </span>
                )}
              </dd>
            </div>
          )}
          {finalConfig.dateOfBirth?.show && (
            <div className="review-row">
              <dt>Date of birth</dt>
              <dd
                className="dob dd-privacy-mask"
                data-dd-action-name="Veteran's date of birth"
              >
                {isValid(dobDateObj) ? (
                  <span data-dd-action-name="Veteran's date of birth">
                    {format(dobDateObj, FORMAT_READABLE_DATE_FNS)}
                  </span>
                ) : (
                  <span data-testid="dob-not-available">Not available</span>
                )}
              </dd>
            </div>
          )}
          {finalConfig.sex?.show && (
            <div className="review-row">
              <dt>Sex</dt>
              <dd
                className="sex dd-privacy-hidden"
                data-dd-action-name="Veteran's sex"
              >
                {gender ? (
                  <span data-dd-action-name="Veteran's sex">
                    {genderLabels?.[gender]}
                  </span>
                ) : (
                  <span data-testid="sex-not-available">Not available</span>
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </>
  );
};

const fieldConfigShape = PropTypes.shape({
  show: PropTypes.bool,
  required: PropTypes.bool,
});

PersonalInformationReview.propTypes = {
  children: PropTypes.node,
  config: PropTypes.shape({
    name: fieldConfigShape,
    ssn: fieldConfigShape,
    vaFileNumber: fieldConfigShape,
    dateOfBirth: fieldConfigShape,
    gender: fieldConfigShape,
  }),
  data: PropTypes.object,
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
  title: PropTypes.string,
};
