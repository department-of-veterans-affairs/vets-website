import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { camelCase } from 'lodash';
import {
  customStepPage,
  employmentHistory,
  identificationInformation,
  nameAndDateOfBirth,
} from '../config/pages';

/** @type {SchemaOptions} */
const defaultSchema = {
  type: 'object',
};

// This chapter contains only one page.
/** @returns {FormConfigPages} */
const singlePageChapter = ({ id, pageTitle, schema, uiSchema }) => ({
  [id]: {
    path: id.toString(),
    schema,
    title: pageTitle,
    uiSchema,
  },
});

/** @returns {FormConfigPages} */
export const addressPages = ({ additionalFields, id, pageTitle }) => {
  const schema = {
    ...defaultSchema,
  };
  const uiSchema = { ...webComponentPatterns.titleUI(pageTitle) };
  if (additionalFields.militaryAddressCheckbox === false) {
    schema.properties = {
      address: webComponentPatterns.addressNoMilitarySchema(),
    };
    uiSchema.address = webComponentPatterns.addressNoMilitaryUI();
  } else {
    schema.properties = {
      address: webComponentPatterns.addressSchema(),
    };
    uiSchema.address = webComponentPatterns.addressUI();
  }

  return singlePageChapter({ id, pageTitle, schema, uiSchema });
};

/** @returns {FormConfigPages} */
export const customStepPages = chapter => {
  const pages = {};
  chapter.pages.forEach(page => {
    // This assumes every pageTitle within a chapter is unique.
    pages[camelCase(page.pageTitle)] = customStepPage(page);
  });

  return pages;
};

/** @returns {FormConfigPages} */
export const phoneAndEmailPages = ({ additionalFields, id, pageTitle }) => {
  const schema = {
    ...defaultSchema,
    properties: {
      homePhone: webComponentPatterns.phoneSchema,
      mobilePhone: webComponentPatterns.phoneSchema,
    },
    required: ['homePhone'],
  };
  const uiSchema = {
    ...webComponentPatterns.titleUI(pageTitle),
    homePhone: webComponentPatterns.phoneUI('Home phone number'),
    mobilePhone: webComponentPatterns.phoneUI('Mobile phone number'),
  };

  if (additionalFields.includeEmail) {
    schema.properties.emailAddress = webComponentPatterns.emailSchema;
    // Email is always required when present.
    schema.required = [...schema.required, 'emailAddress'];
    uiSchema.emailAddress = webComponentPatterns.emailUI();
  }

  return singlePageChapter({ id, pageTitle, schema, uiSchema });
};

/** @returns {FormConfigPages} */
export const listLoopPages = (
  { additionalFields: { optional } },
  arrayBuilder = arrayBuilderPages,
) => {
  /** @type {ArrayBuilderOptions} */
  const options = {
    arrayPath: 'employers',
    nounSingular: 'employer',
    nounPlural: 'employers',
    required: !optional,
    isItemIncomplete: item => !item?.name || !item.address || !item.dateRange,
    maxItems: 4,
    text: {
      getItemName: item => item.name,
      cardDescription: item =>
        `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
          item?.dateRange?.to,
        )}`,
    },
  };

  const {
    datePage,
    detailPage,
    introPage,
    namePage,
    summaryPage,
  } = employmentHistory;

  /** @returns {FormConfigPages} */
  const pageBuilderCallback = pageBuilder => {
    /** @type {FormConfigPages} */
    const pages = {};

    if (!optional) {
      pages.employer = pageBuilder.introPage(introPage(options));
    }

    return {
      ...pages,
      employerSummary: pageBuilder.summaryPage(summaryPage(options)),
      employerNamePage: pageBuilder.itemPage(namePage(options)),
      employerDatePage: pageBuilder.itemPage(datePage),
      employerDetailPage: pageBuilder.itemPage(detailPage),
    };
  };

  return arrayBuilder(options, pageBuilderCallback);
};

/** @returns {FormConfigPages} */
export const personalInfoPages = chapter => {
  const [nameAndDob, identificationInfo] = chapter.pages;

  return {
    nameAndDateOfBirth: nameAndDateOfBirth(nameAndDob),
    identificationInformation: identificationInformation(identificationInfo),
  };
};
