import React from 'react';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  addressPages,
  listLoopPages,
  personalInfoPages,
  phoneAndEmailPages,
} from './digitalFormPatterns';

const getChapterKey = chapter =>
  chapter.type === 'digital_form_your_personal_info'
    ? 'personalInformationChapter'
    : `chapter${chapter.id}`;

/** @returns {FormConfigPages} */
export const formatPages = chapter => {
  switch (chapter.type) {
    case 'digital_form_address':
      return addressPages(chapter);
    case 'digital_form_list_loop':
      return listLoopPages(chapter);
    case 'digital_form_phone_and_email':
      return phoneAndEmailPages(chapter);
    case 'digital_form_your_personal_info':
      return personalInfoPages(chapter);
    default:
      return {};
  }
};

const formatChapter = chapter => {
  return {
    [getChapterKey(chapter)]: {
      title: chapter.chapterTitle,
      pages: formatPages(chapter),
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
