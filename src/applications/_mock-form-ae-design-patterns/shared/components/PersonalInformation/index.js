import React from 'react';
import { PersonalInformation } from './PersonalInformation';

/**
 * @typedef {import('./PersonalInformation').PersonalInformationConfig} PersonalInformationConfig
 */

/**
 * @typedef {import('./PersonalInformation').DataAdapter} DataAdapter
 */

const defaultConfig = {
  title: 'Personal Information',
  path: '/personal-information',
  personalInfoConfig: {},
  dataAdapter: {},
};

/**
 * @typedef {Object} PersonalInformationPageConfig - Configuration object for the PersonalInformationPage component
 * @property {string} title - The title of the page
 * @property {string} path - The path of the page
 * @property {PersonalInformationConfig} personalInfoConfig - Configuration object for the PersonalInformation component
 * @property {DataAdapter} dataAdapter - Data adapter configuration object for the PersonalInformation component
 */
const personalInformationPage = ({
  title = defaultConfig.title,
  path = defaultConfig.path,
  personalInfoConfig = defaultConfig.personalInfoConfig,
  dataAdapter = defaultConfig.dataAdapter,
} = defaultConfig) => {
  return {
    personalInfoPage: {
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
        />
      ),
      CustomPageReview: null,
      hideOnReview: true,
    },
  };
};

export { personalInformationPage, PersonalInformation };
