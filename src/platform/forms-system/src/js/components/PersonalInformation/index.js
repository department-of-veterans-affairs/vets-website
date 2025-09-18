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

export const defaultPageConfig = {
  key: 'personalInfoPage',
  title: 'Personal Information',
  path: 'personal-information',
  personalInfoConfig: defaultConfig,
  dataAdapter: {},
  errorMessage: DefaultErrorMessage,
  cardHeader: <DefaultCardHeader />,
  header: <DefaultHeader />,
  note: null,
  footer: null,
  contentBeforeButtons: null,
  contentAfterButtons: null,
  hideOnReview: true,
  depends: () => true,
};

/**
 * @typedef {Object} PersonalInformationPageConfig - Configuration object for the PersonalInformationPage component
 * @property {string} title - The title of the page
 * @property {string} path - The path of the page
 * @property {PersonalInformationConfig} personalInfoConfig - Configuration object for the PersonalInformation component
 * @property {DataAdapter} dataAdapter - Data adapter configuration object for the PersonalInformation component
 * @property {string|Function} errorMessage - Custom error message or component for missing data
 */
const personalInformationPage = ({
  key = defaultPageConfig.key,
  title = defaultPageConfig.title,
  path = defaultPageConfig.path,
  personalInfoConfig = defaultPageConfig.personalInfoConfig,
  dataAdapter = defaultPageConfig.dataAdapter,
  errorMessage = defaultPageConfig.errorMessage,
  cardHeader = defaultPageConfig.cardHeader,
  header = defaultPageConfig.header,
  note = defaultPageConfig.note,
  footer = defaultPageConfig.footer,
  contentBeforeButtons = defaultPageConfig.contentBeforeButtons,
  contentAfterButtons = defaultPageConfig.contentAfterButtons,
  hideOnReview = defaultPageConfig.hideOnReview,
  depends = defaultPageConfig.depends,
  background = false,
} = defaultPageConfig) => {
  const config = {
    ...defaultPageConfig.personalInfoConfig,
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

export { personalInformationPage, PersonalInformation };
