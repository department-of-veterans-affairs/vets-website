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
 * @type {PrefillPersonalInfoPageConfig}
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
