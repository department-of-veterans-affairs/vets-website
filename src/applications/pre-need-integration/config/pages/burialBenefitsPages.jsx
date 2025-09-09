import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import { merge } from 'lodash';
import {
  isVeteran,
  isAuthorizedAgent,
  getCemeteries,
  hasDeceasedPersons,
} from '../../utils/helpers';
import CurrentlyBuriedDescription from '../../components/CurrentlyBuriedDescription';
import fullNameUI from '../../definitions/fullName';

export function handleGetItemName(item) {
  if (item?.name?.first && item?.name?.last) {
    return `${item.name.first} ${item.name.last}`;
  }
  return null;
}

export function handleAlertMaxItems() {
  return 'You have added the maximum number of allowed deceased persons for this application. You may edit or delete a deceased person or choose to continue the application.';
}

export function handleCancelAddTitle(props) {
  const deceasedPersonName = props.getItemName(props.itemData);

  if (deceasedPersonName === null) {
    return `Cancel adding this deceased person?`;
  }
  return `Cancel adding ${deceasedPersonName}?`;
}

export function handleCancelAddNo() {
  return 'No, keep this';
}

export function handleDeleteTitle(props) {
  const deceasedPersonName = props.getItemName(props.itemData);

  if (deceasedPersonName === null) {
    return `Are you sure you want to remove this deceased person?`;
  }
  return `Are you sure you want to remove ${deceasedPersonName}?`;
}

export function handleDeleteDescription(props) {
  const deceasedPersonName = props.getItemName(props.itemData);

  if (deceasedPersonName === null) {
    return 'This will remove this deceased person and all the information from the deceased person records.';
  }
  return `This will remove ${deceasedPersonName} and all the information from the deceased person records.`;
}

export function handleDeleteNeedAtLeastOneDescription(props) {
  const deceasedPersonName = props.getItemName(props.itemData);
  if (deceasedPersonName === null) {
    return 'If you remove this deceased person, we’ll take you to a screen where you can add another deceased person. You’ll need to list at least one deceased person for us to process this form.';
  }

  return `If you remove ${deceasedPersonName}, we’ll take you to a screen where you can add another deceased person. You’ll need to list at least one deceased person for us to process this form.`;
}

export function handleDeleteYes() {
  return 'Yes, remove this';
}

export function handleDeleteNo() {
  return 'No, keep this';
}

export function handleCancelEditTitle(props) {
  const deceasedPersonName = props.getItemName(props.itemData);

  if (deceasedPersonName === null) {
    return `Cancel editing this deceased person?`;
  }
  return `Cancel editing ${deceasedPersonName}?`;
}

export function handleCancelEditDescription() {
  return 'If you cancel, you’ll lose any changes you made on this screen and you will be returned to the deceased persons review page.';
}

export function handleCancelEditYes() {
  return 'Yes, cancel';
}

export function handleCancelEditNo() {
  return 'No, keep this';
}

export function handleSummaryTitle(formData) {
  return hasDeceasedPersons(formData)
    ? 'Name of deceased person(s)'
    : 'Review your deceased persons';
}

export function handleVeteranDepends(formData) {
  return isVeteran(formData) && !isAuthorizedAgent(formData);
}

export function handlePreparerVeteranDepends(formData) {
  return isVeteran(formData) && isAuthorizedAgent(formData);
}

export function handleNonVeteranDepends(formData) {
  return !isVeteran(formData) && !isAuthorizedAgent(formData);
}

export function handlePreparerNonVeteranDepends(formData) {
  return !isVeteran(formData) && isAuthorizedAgent(formData);
}

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'currentlyBuriedPersons',
  nounSingular: 'deceased person',
  nounPlural: 'deceased persons',
  required: true,
  isItemIncomplete: item => !item?.name?.first || !item?.name?.last,
  maxItems: 3,
  text: {
    getItemName: handleGetItemName,
    alertMaxItems: handleAlertMaxItems,
    cancelAddTitle: handleCancelAddTitle,
    cancelAddNo: handleCancelAddNo,
    deleteTitle: handleDeleteTitle,
    deleteDescription: handleDeleteDescription,
    deleteNeedAtLeastOneDescription: handleDeleteNeedAtLeastOneDescription,
    deleteYes: handleDeleteYes,
    deleteNo: handleDeleteNo,
    cancelEditTitle: handleCancelEditTitle,
    cancelEditDescription: handleCancelEditDescription,
    cancelEditYes: handleCancelEditYes,
    cancelEditNo: handleCancelEditNo,
    summaryTitle: handleSummaryTitle,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Name of deceased person(s)`,
      `In the next few questions, we'll ask you about the details of the person(s) currently buried in a VA national cemetery under your eligibility. You must add at least one name. You can add up to 3 people.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 * This page is skipped on the first loop for required flow
 * @returns {PageSchema}
 */
const summaryPageVeteran = {
  uiSchema: {
    'view:hasCurrentlyBuriedPersons': arrayBuilderYesNoUI(options, {
      title:
        'Is there anyone currently buried in a VA national cemetery under your eligibility?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasCurrentlyBuriedPersons': arrayBuilderYesNoSchema,
    },
    required: ['view:hasCurrentlyBuriedPersons'],
  },
};

const summaryPagePreparer = {
  uiSchema: {
    'view:hasCurrentlyBuriedPersons': arrayBuilderYesNoUI(options, {
      title:
        'Is there anyone currently buried in a VA national cemetery under the applicant’s eligibility?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasCurrentlyBuriedPersons': arrayBuilderYesNoSchema,
    },
    required: ['view:hasCurrentlyBuriedPersons'],
  },
};

const summaryPageSponsor = {
  uiSchema: {
    'view:hasCurrentlyBuriedPersons': arrayBuilderYesNoUI(options, {
      title:
        'Is there anyone currently buried in a VA national cemetery under the sponsor’s eligibility?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasCurrentlyBuriedPersons': arrayBuilderYesNoSchema,
    },
    required: ['view:hasCurrentlyBuriedPersons'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name of deceased person(s)',
      description: <CurrentlyBuriedDescription />,
      nounSingular: options.nounSingular,
    }),
    name: merge({}, fullNameUI),
    cemeteryNumber: autosuggest.uiSchema(
      'VA national cemetery where they’re buried',
      getCemeteries,
      {
        'ui:options': {
          hideIf: () => true,
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'object',
        properties: {
          first: textSchema,
          last: textSchema,
        },
        required: ['first', 'last'],
      },
      cemeteryNumber: {
        type: 'string',
      },
    },
    required: ['name'],
  },
};

export const burialBenefitsPagesVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    burialBenefitsIntroVeteran: pageBuilder.introPage({
      title: 'Burial benefits',
      path: 'burial-benefits-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handleVeteranDepends(formData),
    }),
    burialBenefitsSummaryVeteran: pageBuilder.summaryPage({
      title: 'Review deceased persons',
      path: 'burial-benefits-summary',
      uiSchema: summaryPageVeteran.uiSchema,
      schema: summaryPageVeteran.schema,
      depends: formData => handleVeteranDepends(formData),
    }),
    burialBenefitsInformationPageVeteran: pageBuilder.itemPage({
      title: 'Deceased person information',
      path: 'burial-benefits/:index/person',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
      depends: formData => handleVeteranDepends(formData),
    }),
  }),
);

export const burialBenefitsPagesPreparerVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    burialBenefitsIntroPreparerVeteran: pageBuilder.introPage({
      title: 'Burial benefits',
      path: 'burial-benefits-preparer-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handlePreparerVeteranDepends(formData),
    }),
    burialBenefitsSummaryPreparerVeteran: pageBuilder.summaryPage({
      title: 'Review deceased persons',
      path: 'burial-benefits-preparer-summary',
      uiSchema: summaryPagePreparer.uiSchema,
      schema: summaryPagePreparer.schema,
      depends: formData => handlePreparerVeteranDepends(formData),
    }),
    burialBenefitsInformationPagePreparerVeteran: pageBuilder.itemPage({
      title: 'Deceased person information',
      path: 'burial-benefits-preparer/:index/person',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
      depends: formData => handlePreparerVeteranDepends(formData),
    }),
  }),
);

export const burialBenefitsPagesNonVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    burialBenefitsIntroNonVeteran: pageBuilder.introPage({
      title: 'Burial benefits',
      path: 'burial-benefits-sponsor-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handleNonVeteranDepends(formData),
    }),
    burialBenefitsSummaryNonVeteran: pageBuilder.summaryPage({
      title: 'Review deceased persons',
      path: 'burial-benefits-sponsor-summary',
      uiSchema: summaryPageSponsor.uiSchema,
      schema: summaryPageSponsor.schema,
      depends: formData => handleNonVeteranDepends(formData),
    }),
    burialBenefitsInformationPageNonVeteran: pageBuilder.itemPage({
      title: 'Deceased person information',
      path: 'burial-benefits-sponsor/:index/person',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
      depends: formData => handleNonVeteranDepends(formData),
    }),
  }),
);

export const burialBenefitsPagesPreparerNonVeteran = arrayBuilderPages(
  options,
  pageBuilder => ({
    burialBenefitsIntroPreparerNonVeteran: pageBuilder.introPage({
      title: 'Burial benefits',
      path: 'burial-benefits-preparer-sponsor-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
      depends: formData => handlePreparerNonVeteranDepends(formData),
    }),
    burialBenefitsSummaryPreparerNonVeteran: pageBuilder.summaryPage({
      title: 'Review deceased persons',
      path: 'burial-benefits-preparer-sponsor-summary',
      uiSchema: summaryPageSponsor.uiSchema,
      schema: summaryPageSponsor.schema,
      depends: formData => handlePreparerNonVeteranDepends(formData),
    }),
    burialBenefitsInformationPagePreparerNonVeteran: pageBuilder.itemPage({
      title: 'Deceased person information',
      path: 'burial-benefits-preparer-sponsor/:index/person',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
      depends: formData => handlePreparerNonVeteranDepends(formData),
    }),
  }),
);
