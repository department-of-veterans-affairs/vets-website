import React from 'react';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  addressPages,
  customStepPages,
  listLoopPages,
  personalInfoPages,
  phoneAndEmailPages,
} from './digitalFormPatterns';
import transformForSubmit from '../config/submitTransformer';

const getChapterKey = chapter =>
  chapter.type === 'digital_form_your_personal_info'
    ? 'personalInformationChapter'
    : `chapter${chapter.id}`;

/** @returns {FormConfigPages} */
export const formatPages = chapter => {
  switch (chapter.type) {
    case 'digital_form_address':
      return addressPages(chapter);
    case 'digital_form_custom_step':
      return customStepPages(chapter);
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

const formatChapter = chapter => ({
  [getChapterKey(chapter)]: {
    title: chapter.chapterTitle,
    pages: formatPages(chapter),
  },
});

const formatChapters = chapters =>
  chapters.reduce(
    (formattedChapters, chapter) => ({
      ...formattedChapters,
      ...formatChapter(chapter),
    }),
    {},
  );

export const statementOfTruthBody =
  'I confirm that the identifying information in this form is accurate and ' +
  'has been represented correctly.';

/**
 * @param {NormalizedForm} form
 * @param {Object} options
 * @returns {FormConfig}
 */
export const createFormConfig = (form, options) => {
  const { chapters, formId, ombInfo, title, plainLanguageHeader } = form;
  const { rootUrl, trackingPrefix } = options;
  const subTitle = `${title} (VA Form ${formId})`;

  return {
    preSubmitInfo: {
      statementOfTruth: {
        body: statementOfTruthBody,
        messageAriaDescribedby: statementOfTruthBody,
        fullNamePath: 'fullName',
      },
    },
    rootUrl,
    introduction: props => <IntroductionPage {...props} ombInfo={ombInfo} />,
    confirmation: ConfirmationPage,
    formId,
    saveInProgress: {},
    trackingPrefix,
    transformForSubmit,
    urlPrefix: '/',
    version: 0,
    prefillEnabled: true,
    savedFormMessages: {
      notFound: `${subTitle} NOT FOUND`,
      noAuth: `Please sign in again to continue ${subTitle}.`,
    },
    title: plainLanguageHeader,
    subTitle,
    defaultDefinitions: {},
    chapters: formatChapters(chapters),
  };
};
