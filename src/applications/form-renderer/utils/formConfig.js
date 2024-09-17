import React from 'react';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const selectSchemas = ({ pageTitle, additionalFields }) => {
  const schemas = {
    schema: {
      type: 'object',
      properties: {
        fullName: fullNameSchema,
      },
    },
    uiSchema: {
      ...titleUI(pageTitle),
      fullName: fullNameUI(),
    },
  };

  if (additionalFields.includeDateOfBirth) {
    schemas.schema.properties.dateOfBirth = dateOfBirthSchema;
    schemas.uiSchema.dateOfBirth = dateOfBirthUI();
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
