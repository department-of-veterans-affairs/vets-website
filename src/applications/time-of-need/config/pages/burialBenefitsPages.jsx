import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { merge } from 'lodash';
import CurrentlyBuriedDescription from '../../components/CurrentlyBuriedDescription';
import fullNameUI from '../../definitions/fullName';

// Utility functions (adapt as needed for your app)
// import { isVeteran, hasDeceasedPersons } from '../../utils/helpers';

// Commented out unused handlers for now
// function handlePreparerVeteranDepends(formData) { ... }
// function handleNonVeteranDepends(formData) { ... }
// function handlePreparerNonVeteranDepends(formData) { ... }

function handleGetItemName(item) {
  if (item?.name?.first && item?.name?.last) {
    return `${item.name.first} ${item.name.last}`;
  }
  return null;
}

function handleAlertMaxItems() {
  return 'You have added the maximum number of allowed deceased persons for this application. You may edit or delete a deceased person or choose to continue the application.';
}

function handleCancelAddTitle(props) {
  const deceasedPersonName = props.getItemName(props.itemData);
  if (deceasedPersonName === null) {
    return 'Cancel adding this deceased person?';
  }
  return `Cancel adding ${deceasedPersonName}?`;
}

function handleCancelAddNo() {
  return 'No, keep this';
}

function handleDeleteTitle(props) {
  const deceasedPersonName = props.getItemName(props.itemData);
  if (deceasedPersonName === null) {
    return 'Are you sure you want to remove this deceased person?';
  }
  return `Are you sure you want to remove ${deceasedPersonName}?`;
}

function handleDeleteDescription(props) {
  const deceasedPersonName = props.getItemName(props.itemData);
  if (deceasedPersonName === null) {
    return 'This will remove this deceased person and all the information from the deceased person records.';
  }
  return `This will remove ${deceasedPersonName} and all the information from the deceased person records.`;
}

function handleDeleteNeedAtLeastOneDescription(props) {
  const deceasedPersonName = props.getItemName(props.itemData);
  if (deceasedPersonName === null) {
    return 'If you remove this deceased person, we’ll take you to a screen where you can add another deceased person. You’ll need to list at least one deceased person for us to process this form.';
  }
  return `If you remove ${deceasedPersonName}, we’ll take you to a screen where you can add another deceased person. You’ll need to list at least one deceased person for us to process this form.`;
}

function handleDeleteYes() {
  return 'Yes, remove this';
}

function handleDeleteNo() {
  return 'No, keep this';
}

function handleCancelEditTitle(props) {
  const deceasedPersonName = props.getItemName(props.itemData);
  if (deceasedPersonName === null) {
    return 'Cancel editing this deceased person?';
  }
  return `Cancel editing ${deceasedPersonName}?`;
}

function handleCancelEditDescription() {
  return 'If you cancel, you’ll lose any changes you made on this screen and you will be returned to the deceased persons review page.';
}

function handleCancelEditYes() {
  return 'Yes, cancel';
}

function handleCancelEditNo() {
  return 'No, keep this';
}

const hasDeceasedPersons = true; // Placeholder until needed logic is defined
function handleSummaryTitle(formData) {
  return hasDeceasedPersons(formData)
    ? 'Name of deceased person(s)'
    : 'Review your deceased persons';
}

// function handleVeteranDepends(formData) {
//   // Allow pages to render until we explicitly know the user is not a Veteran.
//   const val = isVeteran(formData);
//   // If isVeteran() returns undefined/null, treat as true so array-builder has item pages.
//   return val !== false;
// }

const options = {
  arrayPath: 'currentlyBuriedPersons', // Must match your form data!
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

const introPage = {
  uiSchema: {
    ...titleUI(
      'Name of deceased person(s)',
      'In the next few questions, we’ll ask you about the details of the person(s) currently buried in a VA national cemetery under your eligibility. You must add at least one name. You can add up to 3 people.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

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

const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name of deceased person(s)',
      description: <CurrentlyBuriedDescription />,
      nounSingular: options.nounSingular,
    }),
    name: merge({}, fullNameUI),
    cemeteryNumber: {
      'ui:title': 'VA national cemetery where they’re buried',
      'ui:options': {
        hideIf: () => true,
      },
    },
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
    }),
    burialBenefitsSummaryVeteran: pageBuilder.summaryPage({
      title: 'Review deceased persons',
      path: 'burial-benefits-summary',
      uiSchema: summaryPageVeteran.uiSchema,
      schema: summaryPageVeteran.schema,
    }),
    burialBenefitsInformationPageVeteran: pageBuilder.itemPage({
      title: 'Deceased person information',
      path: 'burial-benefits/:index/person',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
  }),
);

// Uncomment and adapt for other roles as needed
// export const burialBenefitsPagesPreparerVeteran = ...
// export const burialBenefitsPagesNonVeteran = ...
// export const burialBenefitsPagesPreparerNonVeteran = ...
