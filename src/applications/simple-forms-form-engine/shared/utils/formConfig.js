import React from 'react';
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
    : `chapter${chapter.id}`;

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

const formatChapter = chapter => {
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

  return {
    [getChapterKey(chapter)]: {
      title: chapter.chapterTitle,
      pages,
    },
  };
};

const formatChapters = chapters =>
  chapters.reduce(
    (formattedChapters, chapter) => ({
      ...formattedChapters,
      ...formatChapter(chapter),
    }),
    {},
  );

export const createFormConfig = (form, options) => {
  const { chapters, formId, ombInfo, title } = form;
  const { rootUrl, trackingPrefix } = options;
  const subTitle = `VA Form ${formId}`;

  return {
    rootUrl,
    urlPrefix: '/',
    trackingPrefix,
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
