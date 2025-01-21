import React from 'react';

import { PersonalInformation } from './PersonalInformation';
import { DefaultErrorMessage } from './DefaultErrorMessage';
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
        />
      ),
      CustomPageReview: null,
      hideOnReview: true,
    },
  };
};

export { personalInformationPage, PersonalInformation };
