import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, isValid } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { genderLabels } from 'platform/static-data/labels';
import { selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';
import mask, {
  formatNumberForScreenReader,
} from 'platform/forms-system/src/js/utilities/ui/mask-string';
import { DefaultErrorMessage } from './DefaultErrorMessage';
import {
  getMissingData,
  parseDateToDateObj,
  FORMAT_READABLE_DATE_FNS,
  getChildrenByType,
  FORMAT_YMD_DATE_FNS,
} from './utils';
import { adaptFormData } from './adapter';
import { DefaultHeader } from './DefaultHeader';
import { DefaultCardHeader } from './DefaultCardHeader';

/**
 * @typedef {Object} FieldConfig
 * @property {boolean} show - Whether to show the field
 * @property {boolean} required - Whether the field is required
 * @property {boolean} [showFullSSN] - Whether to show full SSN with masking (SSN field only)
 */

/**
 * @typedef {Object} PersonalInformationConfig - Field configuration object for PersonalInformation component
 * @property {FieldConfig} [name] - Name field configuration
 * @property {FieldConfig} [ssn] - SSN field configuration
 * @property {FieldConfig} [dateOfBirth] - Date of birth field configuration
 * @property {FieldConfig} [vaFileNumber] - VA file number field configuration
 * @property {FieldConfig} [sex] - Sex field configuration
 */

/**
 * @type {PersonalInformationConfig}
 * @description Default configuration for the PersonalInformation component, shows the name field as non-required field
 */
export const defaultConfig = {
  name: {
    show: true,
    required: false,
  },
  ssn: {
    show: true,
    required: false,
  },
  dateOfBirth: {
    show: true,
    required: false,
  },
  vaFileNumber: { show: false, required: false },
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
 * @param {boolean} props.background - Whether to show background on va-card
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
  formOptions = {},
  background = false,
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

  const { note, header, footer, cardHeader } = getChildrenByType(children);

  // Helper function to render SSN based on configuration
  const renderSSN = () => {
    if (finalConfig.ssn?.showFullSSN) {
      return mask(ssn.toString(), 4);
    }

    const ssnString = ssn.toString();
    if (ssnString.length > 4) {
      return formatNumberForScreenReader(ssnString.slice(-4));
    }

    return formatNumberForScreenReader(ssn);
  };

  // Helper function to get SSN title
  const getSSNTitle = () => {
    return finalConfig.ssn?.showFullSSN
      ? 'Social Security Number: '
      : 'Last 4 digits of Social Security Number: ';
  };

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
      {header || <DefaultHeader />}
      <div className="vads-u-display--flex">
        <va-card background={background}>
          <div className="vads-u-margin-bottom--2">
            {cardHeader || <DefaultCardHeader />}
          </div>
          <dl className="vads-u-padding-y--0 vads-u-margin-y--0">
            {finalConfig.name?.show && (
              <div className="vads-u-margin-bottom--2">
                <dt className="vads-u-visibility--screen-reader">Full name:</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="Veteran's name"
                >
                  <strong>Name: </strong>
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
              <div className="vads-u-margin-bottom--2">
                <dt className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-right--0p5">
                  {getSSNTitle()}
                </dt>
                <dd
                  className="vads-u-display--inline-block dd-privacy-mask vads-u-font-family--sans"
                  data-dd-action-name="Veteran's SSN"
                >
                  {ssn ? (
                    renderSSN()
                  ) : (
                    <span data-testid="ssn-not-available">Not available</span>
                  )}
                </dd>
              </div>
            )}
            {finalConfig.vaFileNumber?.show && (
              <div className="vads-u-margin-bottom--2">
                <dt className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-right--0p5">
                  Last 4 digits of VA file number:
                </dt>
                <dd
                  className="vads-u-display--inline-block dd-privacy-mask vads-u-font-family--sans"
                  data-dd-action-name="Veteran's VA file number"
                >
                  {vaFileLastFour ? (
                    formatNumberForScreenReader(vaFileLastFour)
                  ) : (
                    <span data-testid="va-file-number-not-available">
                      Not available
                    </span>
                  )}
                </dd>
              </div>
            )}
            {finalConfig.dateOfBirth?.show && (
              <div className="vads-u-margin-bottom--2">
                <dt className="vads-u-display--inline-block vads-u-margin-right--0p5 vads-u-font-weight--bold">
                  Date of birth:
                </dt>
                <dd
                  className="vads-u-display--inline-block dd-privacy-mask vads-u-font-family--sans"
                  data-dd-action-name="Veteran's date of birth"
                >
                  {isValid(dobDateObj) ? (
                    format(dobDateObj, FORMAT_READABLE_DATE_FNS)
                  ) : (
                    <span data-testid="dob-not-available">Not available</span>
                  )}
                </dd>
              </div>
            )}
            {finalConfig.sex?.show && (
              <div className="vads-u-margin-bottom--2">
                <dt className="vads-u-display--inline-block vads-u-margin-right--0p5 vads-u-font-weight--bold">
                  Sex:
                </dt>
                <dd
                  className="vads-u-display--inline-block dd-privacy-hidden"
                  data-dd-action-name="Veteran's sex"
                >
                  {gender ? (
                    genderLabels?.[gender]
                  ) : (
                    <span data-testid="sex-not-available">Not available</span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </va-card>
      </div>

      {note || (
        <div className="vads-u-margin-bottom--4" data-testid="default-note">
          <p>
            <strong>Note:</strong> To protect your personal information, we
            don’t allow online changes to your name, date of birth, or Social
            Security number. If you need to change this information, call us at{' '}
            <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
            <va-telephone contact="711" tty />
            ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
            ET.
          </p>
          <va-link
            external
            href={`${
              environment.BASE_URL
            }/resources/how-to-change-your-legal-name-on-file-with-va/`}
            text="Find more detailed instructions for how to change your legal name"
          />
        </div>
      )}

      {footer || null}

      {contentBeforeButtons || null}
      <NavButtons
        goBack={goBack}
        goForward={goForward}
        useWebComponents={formOptions.useWebComponentForNavigation}
      />
      {contentAfterButtons || null}
    </>
  );
};

const fieldConfigShape = PropTypes.shape({
  show: PropTypes.bool,
  required: PropTypes.bool,
  showFullSSN: PropTypes.bool,
});

PersonalInformation.propTypes = {
  NavButtons: PropTypes.func,
  background: PropTypes.bool,
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
  formOptions: PropTypes.shape({
    useWebComponentForNavigation: PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

// the following are the allowed child components for the PersonalInformation component
// you would wrap your custom components in these to use them as children of the PersonalInformation component
export const PersonalInformationNote = ({ children }) => {
  return <>{children}</>;
};
PersonalInformationNote.componentType = 'note';

export const PersonalInformationHeader = ({ children }) => {
  return <>{children}</>;
};
PersonalInformationHeader.componentType = 'header';

export const PersonalInformationFooter = ({ children }) => {
  return <>{children}</>;
};
PersonalInformationFooter.componentType = 'footer';

export const PersonalInformationCardHeader = ({ children }) => {
  return <>{children}</>;
};
PersonalInformationCardHeader.componentType = 'cardHeader';

const ChildPropTypes = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.arrayOf(PropTypes.func),
]);

PersonalInformationNote.propTypes = {
  children: ChildPropTypes,
};

PersonalInformationCardHeader.propTypes = {
  children: ChildPropTypes,
};

PersonalInformationHeader.propTypes = {
  children: ChildPropTypes,
};

PersonalInformationFooter.propTypes = {
  children: ChildPropTypes,
};
