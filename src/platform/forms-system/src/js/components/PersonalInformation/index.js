import React from 'react';

import {
  PersonalInformation,
  PersonalInformationCardHeader,
  PersonalInformationFooter,
  PersonalInformationHeader,
  PersonalInformationNote,
} from './PersonalInformation';
import { DefaultErrorMessage } from './DefaultErrorMessage';
import { DefaultCardHeader } from './DefaultCardHeader';
import { DefaultHeader } from './DefaultHeader';
/**
 * @typedef {import('./PersonalInformation').PersonalInformationConfig} PersonalInformationConfig
 */

/**
 * @typedef {import('./PersonalInformation').DataAdapter} DataAdapter
 */

export const defaultConfig = {
  key: 'personalInfoPage',
  title: 'Personal Information',
  path: 'personal-information',
  personalInfoConfig: {},
  dataAdapter: {},
  errorMessage: DefaultErrorMessage,
  cardHeader: <DefaultCardHeader />,
  header: <DefaultHeader />,
  note: null,
  footer: null,
  contentBeforeButtons: null,
  contentAfterButtons: null,
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
  key = defaultConfig.key,
  title = defaultConfig.title,
  path = defaultConfig.path,
  personalInfoConfig = defaultConfig.personalInfoConfig,
  dataAdapter = defaultConfig.dataAdapter,
  errorMessage = defaultConfig.errorMessage,
  cardHeader = defaultConfig.cardHeader,
  header = defaultConfig.header,
  note = defaultConfig.note,
  footer = defaultConfig.footer,
  contentBeforeButtons = defaultConfig.contentBeforeButtons,
  contentAfterButtons = defaultConfig.contentAfterButtons,
} = defaultConfig) => {
  return {
    [key]: {
      title,
      path,
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {},
      },
      CustomPage: props => (
        <PersonalInformation
          {...props}
          config={personalInfoConfig}
          dataAdapter={dataAdapter}
          errorMessage={errorMessage}
          contentBeforeButtons={contentBeforeButtons}
          contentAfterButtons={contentAfterButtons}
        >
          {cardHeader && (
            <PersonalInformationCardHeader>
              {cardHeader}
            </PersonalInformationCardHeader>
          )}
          {header && (
            <PersonalInformationHeader>{header}</PersonalInformationHeader>
          )}
          {note && <PersonalInformationNote>{note}</PersonalInformationNote>}
          {footer && (
            <PersonalInformationFooter>{footer}</PersonalInformationFooter>
          )}
        </PersonalInformation>
      ),
      CustomPageReview: null,
      hideOnReview: true,
    },
  };
};

export { personalInformationPage, PersonalInformation };
