import React from 'react';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  digitalFormAddress,
  digitalFormIdentificationInfo,
  digitalFormNameAndDoB,
  digitalFormPhoneAndEmail,
} from './digitalFormPatterns';

export const selectSchemas = chapter => {
  switch (chapter.type) {
    case 'digital_form_address':
      return digitalFormAddress(chapter);
    case 'digital_form_name_and_date_of_bi':
      return digitalFormNameAndDoB(chapter);
    case 'digital_form_identification_info':
      return digitalFormIdentificationInfo(chapter);
    case 'digital_form_phone_and_email':
      return digitalFormPhoneAndEmail(chapter);
    default:
      return {};
  }
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
    // rootUrl: `${rootUrl}/${formId}`,
    // urlPrefix: `/${formId}/`,
    urlPrefix: '/',
    // trackingPrefix: `${formId}-`,
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
