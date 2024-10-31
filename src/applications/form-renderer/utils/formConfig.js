import React from 'react';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  digitalFormAddress,
  digitalFormIdentificationInfo,
  digitalFormNameAndDoB,
  digitalFormPhoneAndEmail,
} from './digitalFormPatterns';

const getChapterKey = chapter =>
  chapter.type === 'digital_form_your_personal_info'
    ? 'personalInformationChapter'
    : chapter.id;

export const selectSchemas = page => {
  switch (page.type) {
    case 'digital_form_address':
      return digitalFormAddress(page);
    case 'digital_form_phone_and_email':
      return digitalFormPhoneAndEmail(page);
    default:
      return {};
  }
};

const formatChapters = chapters =>
  chapters.reduce((formattedChapters, chapter) => {
    let pages;

    if (chapter.type === 'digital_form_your_personal_info') {
      const [nameAndDob, identificationInfo] = chapter.pages;

      pages = {
        nameAndDateOfBirth: {
          path: 'name-and-date-of-birth',
          title: nameAndDob.pageTitle,
          ...digitalFormNameAndDoB(nameAndDob),
        },
        identificationInformation: {
          path: 'identification-information',
          title: identificationInfo.pageTitle,
          ...digitalFormIdentificationInfo(identificationInfo),
        },
      };
    } else {
      pages = {
        // For now, all chapters except for "Your personal information" are
        // assumed to contain only one page, and there are no
        // separate IDs for pages. This will probably change at some point.
        [chapter.id]: {
          path: chapter.id.toString(),
          title: chapter.pageTitle,
          ...selectSchemas(chapter),
        },
      };
    }

    const formattedChapter = {
      [getChapterKey(chapter)]: {
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
