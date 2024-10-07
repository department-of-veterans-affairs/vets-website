import React from 'react';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

export const selectSchemas = ({ pageTitle, type, additionalFields }) => {
  const { titleUI } = webComponentPatterns;
  const schemas = { uiSchema: { ...titleUI(pageTitle) } };

  switch (type) {
    case 'digital_form_address':
      if (additionalFields.militaryAddressCheckbox === false) {
        schemas.schema = {
          type: 'object',
          properties: {
            address: webComponentPatterns.addressNoMilitarySchema,
          },
        };
        schemas.uiSchema.address = webComponentPatterns.addressNoMilitaryUI();
      } else {
        schemas.schema = {
          type: 'object',
          properties: {
            address: webComponentPatterns.addressSchema,
          },
        };
        schemas.uiSchema.address = webComponentPatterns.addressUI();
      }
      break;
    case 'digital_form_name_and_date_of_bi':
      schemas.schema = {
        type: 'object',
        properties: {
          fullName: webComponentPatterns.fullNameSchema,
        },
      };
      schemas.uiSchema.fullName = webComponentPatterns.fullNameUI();

      if (additionalFields.includeDateOfBirth) {
        schemas.schema.properties.dateOfBirth =
          webComponentPatterns.dateOfBirthSchema;
        schemas.uiSchema.dateOfBirth = webComponentPatterns.dateOfBirthUI();
      }
      break;
    case 'digital_form_identification_info':
      schemas.schema = {
        type: 'object',
        properties: {
          veteranId: webComponentPatterns.ssnOrVaFileNumberSchema,
        },
      };
      schemas.uiSchema.veteranId = webComponentPatterns.ssnOrVaFileNumberUI();

      if (additionalFields.includeServiceNumber) {
        schemas.schema.properties.serviceNumber =
          webComponentPatterns.serviceNumberSchema;
        schemas.uiSchema.serviceNumber = webComponentPatterns.serviceNumberUI();
      }
      break;
    default:
      break;
  }

  return schemas;
};

const formatChapters = chapters =>
  chapters.reduce((formattedChapters, chapter) => {
    const pages = {
      // For now, all chapters contain only one page, and there are no
      // separate IDs for pages. This will probably change at some point.
      [chapter.id]: {
        path: chapter.id.toString(),
        title: chapter.pageTitle,
        ...selectSchemas(chapter),
      },
    };

    const formattedChapter = {
      [chapter.id]: {
        title: chapter.chapterTitle,
        pages,
      },
    };

    return { ...formattedChapters, ...formattedChapter };
  }, {});

export const createFormConfig = form => {
  if (form.rootUrl) {
    // It's probably already a Form Config object
    return form;
  }

  const { chapters, formId, ombInfo, title } = form;
  const subTitle = `VA Form ${formId}`;

  return {
    rootUrl: `${manifest.rootUrl}/${formId}`,
    urlPrefix: `/${formId}/`,
    trackingPrefix: `${formId}-`,
    // eslint-disable-next-line no-console
    submit: () => console.log(`Submitted ${subTitle}`),
    introduction: props => <IntroductionPage {...props} ombInfo={ombInfo} />,
    confirmation: ConfirmationPage,
    formId,
    saveInProgress: {},
    version: 0,
    prefillEnabled: true,
    savedFormMessages: {
      notFound: `${subTitle} NOT FOUND`,
      noAuth: `Please sign in again to continue ${subTitle}.`,
    },
    title,
    defaultDefinitions: {},
    subTitle,
    chapters: formatChapters(chapters),
  };
};
