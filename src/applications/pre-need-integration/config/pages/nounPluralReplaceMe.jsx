/* eslint-disable no-unused-vars */
import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import set from 'platform/utilities/data/set';
import { merge } from 'lodash';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import { description } from 'platform';
import fullNameUI from '../../definitions/fullName';

import EligibleBuriedView from '../../components/EligibleBuriedView';

import {
  getCemeteries,
  isVeteran,
  isAuthorizedAgent,
} from '../../utils/helpers';
import DeceasedPersons from '../../components/DeceasedPersons';

const {
  currentlyBuriedPersons,
} = fullSchemaPreNeed.properties.application.properties;

function currentlyBuriedPersonsMinItem() {
  const copy = { ...currentlyBuriedPersons };
  copy.minItems = 1;
  return set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}
const {
  hasCurrentlyBuried,
} = fullSchemaPreNeed.properties.application.properties;

export const desiredCemeteryNoteTitleWrapper = (
  <a
    href="https://www.va.gov/find-locations/"
    rel="noreferrer"
    target="_blank"
    className="desiredCemeteryNoteTitle"
  >
    Find a VA national cemetery
  </a>
);

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPluralReplaceMe',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: true,
  isItemIncomplete: item => !item?.name, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: (item, index, fullData) => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    application: {
      'ui:title': ' ',
      hasCurrentlyBuried: {
        'ui:widget': 'radio',
        'ui:options': {
          updateSchema: formData => {
            let title = '';
            // Veteran Flow
            if (isVeteran(formData) && !isAuthorizedAgent(formData)) {
              title =
                'Is there anyone currently buried in a VA national cemetery under your eligibility?';
            }
            // Preparer Flow
            else if (isVeteran(formData) && isAuthorizedAgent(formData)) {
              title =
                'Is there anyone currently buried in a VA national cemetery under the applicant’s eligibility?';
            }
            // Sponsor Flow
            else {
              title =
                'Is there anyone currently buried in a VA national cemetery under the sponsor’s eligibility?';
            }
            return { title };
          },
          labels: {
            1: 'Yes',
            2: 'No',
            3: 'I don’t know',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      application: {
        type: 'object',
        required: ['hasCurrentlyBuried'],
        properties: {
          hasCurrentlyBuried,
        },
      },
    },
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasNounPluralReplaceMe': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasNounPluralReplaceMe': arrayBuilderYesNoSchema,
    },
    required: ['view:hasNounPluralReplaceMe'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name of deceased person(s)',
      description: 'dsdfkjshdfkjhsdf',
      nounSingular: options.nounSingular,
    }),
    firstName: textUI('Deceased person’s first name'),
    lastName: textUI('Deceased person’s last name'),
  },
  schema: {
    type: 'object',
    properties: {
      firstName: textSchema,
      lastName: textSchema,
    },
    required: ['firstName', 'lastName'],
  },
};

/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => (formData?.name ? `Date at ${formData.name}` : 'Date'),
    ),
    date: currentOrPastDateUI(),
  },
  schema: {
    type: 'object',
    properties: {
      date: currentOrPastDateSchema,
    },
    required: ['date'],
  },
};

export const nounPluralReplaceMePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    nounPluralReplaceMe: pageBuilder.introPage({
      title: '[noun plural]',
      path: 'noun-plural-replace-me',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    nounPluralReplaceMeSummary: pageBuilder.summaryPage({
      title: 'Review your [noun plural]',
      path: 'noun-plural-replace-me-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    nounSingularReplaceMeNamePage: pageBuilder.itemPage({
      title: 'Name',
      path: 'noun-plural-replace-me/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    nounSingularReplaceMeDatePage: pageBuilder.itemPage({
      title: 'Date',
      path: 'noun-plural-replace-me/:index/date',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
    }),
  }),
);
