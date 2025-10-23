import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import {
  customStepPage,
  identificationInformation,
  nameAndDateOfBirth,
} from '../config/pages';

export { listLoopPages } from '../config/pages/listLoop';

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
    pages[`page${page.id}`] = customStepPage(page);
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
export const personalInfoPages = chapter => {
  const [nameAndDob, identificationInfo] = chapter.pages;

  return {
    nameAndDateOfBirth: nameAndDateOfBirth(nameAndDob),
    identificationInformation: identificationInformation(identificationInfo),
  };
};
