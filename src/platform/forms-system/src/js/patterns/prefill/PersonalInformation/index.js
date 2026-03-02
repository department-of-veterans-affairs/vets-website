import React from 'react';
import PropTypes from 'prop-types';
import {
  defaultConfig,
  PersonalInformation,
  PersonalInformationCardHeader,
  PersonalInformationFooter,
  PersonalInformationHeader,
  PersonalInformationNote,
} from './PersonalInformation';
import { DefaultErrorMessage } from './DefaultErrorMessage';
import { DefaultCardHeader } from './DefaultCardHeader';
import { DefaultHeader } from './DefaultHeader';
import { PersonalInformationReview } from './PersonalInformationReview';

/**
 * @typedef {import('./PersonalInformation').PersonalInformationConfig} PersonalInformationConfig
 */

/**
 * @typedef {import('./PersonalInformation').DataAdapter} DataAdapter
 */

/**
 * Add this page to config/form
 * Spread the returned object into the app config/form
 *
 * README: {@link https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/platform/forms-system/src/js/patterns/prefill/README.md|Prefill Usage/Guidance/Examples}
 *
 * @param {Object} [options] - Configuration options for the personal information page
 * @param {boolean} [options.background] - Whether to display a background on the page
 * @param {JSX.Element|React.ReactNode} [options.cardHeader] - Custom card header component
 * @param {JSX.Element|React.ReactNode} [options.contentAfterButtons] - Content to display after the navigation buttons
 * @param {JSX.Element|React.ReactNode} [options.contentBeforeButtons] - Content to display before the navigation buttons
 * @param {DataAdapter} [options.dataAdapter] - Data adapter configuration object for the PersonalInformation component
 * @param {Function} [options.depends] - Conditional function to determine if page should be shown
 * @param {string|Function} [options.errorMessage] - Custom error message or component for missing data
 * @param {JSX.Element|React.ReactNode} [options.footer] - Custom footer component
 * @param {JSX.Element|React.ReactNode} [options.header] - Custom header component
 * @param {boolean} [options.hideOnReview] - Whether to hide the page on the review page
 * @param {string} [options.key] - The page key within the form config chapter
 * @param {JSX.Element|React.ReactNode} [options.note] - Custom note component
 * @param {string} [options.path] - The path of the page
 * @param {PersonalInformationConfig} [options.personalInfoConfig] - Configuration object for the PersonalInformation component
 * @param {boolean} [options.prefillPatternEnabled] - enable prefill pattern for personal info
 * @param {string} [options.title] - The title of the page
 * @returns {Object} - form config pages for a chapter
 */
const profilePersonalInfoPage = ({
  key = 'personalInfoPage',
  title = 'Personal Information',
  path = 'personal-information',
  personalInfoConfig = defaultConfig,
  dataAdapter = {},
  errorMessage = DefaultErrorMessage,
  cardHeader = <DefaultCardHeader />,
  header = <DefaultHeader />,
  note = null,
  footer = null,
  contentBeforeButtons = null,
  contentAfterButtons = null,
  hideOnReview = false,
  depends = () => true,
  background = false,
} = {}) => {
  const config = {
    ...defaultConfig,
    ...personalInfoConfig,
  };

  // Create a CustomPage component with proper PropTypes
  const CustomPage = props => (
    <PersonalInformation
      {...props}
      config={config}
      dataAdapter={dataAdapter}
      errorMessage={errorMessage}
      background={background}
      contentBeforeButtons={contentBeforeButtons || props.contentBeforeButtons}
      contentAfterButtons={contentAfterButtons || props.contentAfterButtons}
    >
      {header && (
        <PersonalInformationHeader>{header}</PersonalInformationHeader>
      )}
      {cardHeader && (
        <PersonalInformationCardHeader>
          {cardHeader}
        </PersonalInformationCardHeader>
      )}
      {note && <PersonalInformationNote>{note}</PersonalInformationNote>}
      {footer && (
        <PersonalInformationFooter>{footer}</PersonalInformationFooter>
      )}
    </PersonalInformation>
  );

  // Add PropTypes to the CustomPage component
  CustomPage.propTypes = {
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
  };

  return {
    [key]: {
      title,
      path,
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {},
      },
      CustomPage,
      CustomPageReview: hideOnReview
        ? null
        : props => (
            <PersonalInformationReview
              {...props}
              config={personalInfoConfig}
              dataAdapter={dataAdapter}
              title={title}
            />
          ),
      hideOnReview,
      depends,
    },
  };
};

export { profilePersonalInfoPage };
