import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';

/** @type {SchemaOptions} */
const defaultSchema = {
  type: 'object',
};

// This chapter contains only one page. This is often referred to as a single
// response step.
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

  /** @returns {PageSchema} */
  const datePage = {
    title: 'Dates you were employed',
    path: 'employers/:index/dates',
    uiSchema: {
      ...webComponentPatterns.arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          formData?.name
            ? `Dates you were employed at ${formData.name}`
            : 'Dates you were employed',
      ),
      dateRange: webComponentPatterns.currentOrPastDateRangeUI(
        'Start date of employment',
        'End date of employment',
      ),
    },
    schema: {
      type: 'object',
      properties: {
        dateRange: webComponentPatterns.currentOrPastDateRangeSchema,
      },
      required: ['dateRange'],
    },
  };

  /** @returns {PageSchema} */
  const namePage = {
    title: 'Name and address of employer or unit',
    path: 'employers/:index/name-and-address',
    uiSchema: {
      ...webComponentPatterns.arrayBuilderItemFirstPageTitleUI({
        title: 'Name and address of employer or unit',
        nounSingular: options.nounSingular,
      }),
      name: webComponentPatterns.textUI('Name of employer'),
      address: webComponentPatterns.addressNoMilitaryUI({
        omit: ['street2', 'street3'],
      }),
    },
    schema: {
      type: 'object',
      properties: {
        name: webComponentPatterns.textSchema,
        address: webComponentPatterns.addressNoMilitarySchema({
          omit: ['street2', 'street3'],
        }),
      },
      required: ['name', 'address'],
    },
  };

  /** @type {PageSchema} */
  const detailPage = {
    path: 'employers/:index/detail',
    schema: {
      properties: {
        typeOfWork: webComponentPatterns.textSchema,
        hoursPerWeek: webComponentPatterns.numberSchema,
        lostTime: webComponentPatterns.numberSchema,
        highestIncome: webComponentPatterns.textSchema,
      },
      required: ['typeOfWork', 'hoursPerWeek', 'lostTime', 'highestIncome'],
      type: 'object',
    },
    title: 'Employment detail for employer',
    uiSchema: {
      ...webComponentPatterns.arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          formData?.name
            ? `Employment detail for ${formData.name}`
            : 'Employment detail',
      ),
      typeOfWork: webComponentPatterns.textUI({
        hint: 'If self-employed enter "Self"',
        title: 'Type of work',
      }),
      hoursPerWeek: webComponentPatterns.numberUI({
        title: 'Hours per week',
        min: 0,
        max: 168,
      }),
      lostTime: webComponentPatterns.numberUI({
        hint: 'Total hours',
        title: 'Lost time from illness',
        min: 0,
        max: 8760,
      }),
      highestIncome: webComponentPatterns.textUI({
        currency: true,
        hint: 'Total $ amount',
        title: 'Highest gross income per month',
      }),
    },
  };

  /** @type {PageSchema} */
  const introPage = {
    path: 'employers',
    title: 'Employers',
    uiSchema: {
      ...webComponentPatterns.titleUI(
        `Treatment records`,
        `In the next few questions, we’ll ask you about the treatment records you’re requesting. You must add at least one treatment request. You may add up to ${
          options.maxItems
        }.`,
      ),
    },
    schema: {
      type: 'object',
      properties: {},
    },
  };

  /** @type {PageSchema} */
  const summaryPage = {
    path: optional ? 'employers' : 'employers-summary',
    schema: {
      type: 'object',
      properties: {
        'view:hasEmployers': webComponentPatterns.arrayBuilderYesNoSchema,
      },
      required: ['view:hasEmployers'],
    },
    title: optional ? 'Your employers' : 'Review your employers',
    uiSchema: {
      'view:hasEmployers': webComponentPatterns.arrayBuilderYesNoUI(
        options,
        {
          title:
            'Were you employed by the VA, others or self-employed at any time during the last 12 months?',
          labels: {
            Y: 'Yes, I have employment to report',
            N: 'No, I don’t have any employment to report',
          },
        },
        {
          title: 'Do you have another employer to report?',
          labels: {
            Y: 'Yes, I have another employment to report',
            N: 'No, I don’t have another employment to report',
          },
        },
      ),
    },
  };

  /** @returns {FormConfigPages} */
  const pageBuilderCallback = pageBuilder => {
    /** @type {FormConfigPages} */
    const pages = {};

    if (!optional) {
      pages.employer = pageBuilder.introPage(introPage);
    }

    return {
      ...pages,
      employerSummary: pageBuilder.summaryPage(summaryPage),
      employerNamePage: pageBuilder.itemPage(namePage),
      employerDatePage: pageBuilder.itemPage(datePage),
      employerDetailPage: pageBuilder.itemPage(detailPage),
    };
  };

  return arrayBuilder(options, pageBuilderCallback);
};

/** @returns {FormConfigPages} */
export const personalInfoPages = chapter => {
  const [nameAndDob, identificationInfo] = chapter.pages;

  /** @returns {PageSchema} */
  const nameAndDobPage = ({ includeDateOfBirth, pageTitle }) => {
    const schema = {
      ...defaultSchema,
      properties: {
        fullName: webComponentPatterns.fullNameSchema,
      },
    };
    const uiSchema = {
      ...webComponentPatterns.titleUI(pageTitle),
      fullName: webComponentPatterns.fullNameUI(),
    };

    if (includeDateOfBirth) {
      schema.properties.dateOfBirth = webComponentPatterns.dateOfBirthSchema;
      uiSchema.dateOfBirth = webComponentPatterns.dateOfBirthUI();
    }

    return {
      path: 'name-and-date-of-birth',
      title: pageTitle,
      schema,
      uiSchema,
    };
  };

  /** @returns {PageSchema} */
  const identificationInfoPage = ({ includeServiceNumber, pageTitle }) => {
    const schema = {
      ...defaultSchema,
      properties: {
        veteranId: webComponentPatterns.ssnOrVaFileNumberSchema,
      },
    };
    const uiSchema = {
      ...webComponentPatterns.titleUI(pageTitle),
      veteranId: webComponentPatterns.ssnOrVaFileNumberUI(),
    };

    if (includeServiceNumber) {
      schema.properties.serviceNumber =
        webComponentPatterns.serviceNumberSchema;
      uiSchema.serviceNumber = webComponentPatterns.serviceNumberUI();
    }

    return {
      path: 'identification-information',
      title: pageTitle,
      schema,
      uiSchema,
    };
  };

  return {
    nameAndDateOfBirth: nameAndDobPage(nameAndDob),
    identificationInformation: identificationInfoPage(identificationInfo),
  };
};
