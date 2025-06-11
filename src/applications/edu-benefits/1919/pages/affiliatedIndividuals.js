import React from 'react';

import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  textSchema,
  textUI,
  radioUI,
  radioSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { alert } from '../helpers';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const options = {
  arrayPath: 'affiliatedIndividuals',
  nounSingular: 'individual',
  nounPlural: 'individuals',
  required: false,
  isItemIncomplete: item =>
    !item?.first || !item?.last || !item?.title || !item?.association,
  text: {
    getItemName: item => `${item?.first || ''} ${item?.last || ''}`.trim(),
    cardDescription: item => (
      <>
        {item?.title}
        <div className=" vads-u-margin-y--2">
          {item?.association === 'vaEmployee' ? 'VA employee' : 'SAA employee'}
        </div>
      </>
    ),
    summaryTitle:
      'Review the individuals with a potential conflict of interest',
  },
};

const summaryPage = {
  uiSchema: {
    'view:introduction': {
      ...titleUI('Individuals with a potential conflict of interest'),
      'ui:description': (
        <>
          <div data-testid="instructions">
            <p>
              Title 38 U.S.C. 3638 prohibits employees of the Department of
              Veterans Affairs (VA) and the State Approving Agency (SAA) from
              owning any interest in a for-profit educational institution. These
              employees cannot receive wages, salary, dividends, profits, or
              gifts from for-profit schools. The law also prohibits VA employees
              from receiving any services from these schools. The VA may waive
              these restrictions if it determines that no harm will result to
              the government, Veterans, or eligible persons.
            </p>
            <p>
              In the next step, you’ll provide information about any VA or SAA
              employees who may have a conflict under this law.
            </p>
          </div>
          {alert}
        </>
      ),
      'ui:options': {
        hideIf: formData => formData?.affiliatedIndividuals?.length > 0,
      },
    },
    isProfitConflictOfInterest: arrayBuilderYesNoUI(
      options,
      {
        title:
          'Do you need to report any VA or SAA employees at your institution who may have a potential conflict of interest under this law?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        hint: () => '',
      },
      {
        title:
          'Do you have another individual with a potential conflict of interest to add?',
        labels: {
          Y: 'Yes, I have another individual to report',
          N: "No, I don't have another individual to report",
        },
        hint: () => '',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:introduction': {
        type: 'object',
        properties: {},
      },
      isProfitConflictOfInterest: arrayBuilderYesNoSchema,
      affiliatedIndividuals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            first: { type: 'string', pattern: noSpaceOnlyPattern },
            last: { type: 'string', pattern: noSpaceOnlyPattern },
            title: { type: 'string', pattern: noSpaceOnlyPattern },
            individualAssociationType: {
              type: 'string',
              enum: ['vaEmployee', 'saaEmployee'],
            },
          },
          required: ['first', 'last', 'title', 'individualAssociationType'],
        },
      },
    },
    required: ['isProfitConflictOfInterest'],
  },
};

const associationLabels = {
  vaEmployee:
    'They are a VA employee who works with, receives services from, or receives compensation from our institution',
  saaEmployee:
    'They are a SAA employee who works with or receives compensation from our institution',
};

const individualPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Individuals affiliated with both your institution and VA or SAA',
      nounSingular: options.nounSingular,
      description: (
        <>
          <p>
            Enter information about any individual who is affiliated with your
            institution and is employed by VA or an SAA. This may indicate a
            potential conflict of interest.
          </p>
          <va-additional-info
            trigger="Review guidelines on for-profit school restrictions"
            data-testid="for-profit-guidelines"
          >
            <p>
              VA and SAA employees are prohibited from owning any interest in
              for-profit schools or receiving wages, profits, or services from
              them, unless granted a waiver by the VA confirming no harm to the
              government, Veterans, or eligible individuals.
            </p>
          </va-additional-info>
        </>
      ),
    }),
    first: textUI({
      title: 'First name of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    last: textUI({
      title: 'Last name of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    title: textUI({
      title: 'Title of individual',
      errorMessages: {
        required: 'You must provide a response',
        pattern: 'You must provide a response',
      },
    }),
    individualAssociationType: radioUI({
      title: 'How is this individual associated with your institution?',
      errorMessages: { required: 'Please make a selection' },
      labels: associationLabels,
    }),
  },
  schema: {
    type: 'object',
    required: ['first', 'last', 'title', 'individualAssociationType'],
    properties: {
      first: { ...textSchema, pattern: noSpaceOnlyPattern },
      last: { ...textSchema, pattern: noSpaceOnlyPattern },
      title: { ...textSchema, pattern: noSpaceOnlyPattern },
      individualAssociationType: {
        ...radioSchema(['vaEmployee', 'saaEmployee']),
      },
    },
  },
};

export const affiliatedIndividualsPages = arrayBuilderPages(
  options,

  pageBuilder => ({
    affiliatedIndividualsSummary: pageBuilder.summaryPage({
      title: 'Individuals with a potential conflict of interest',
      path: 'proprietary-profit-1',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    affiliatedIndividualPage: pageBuilder.itemPage({
      title: 'Individuals affiliated with both your institution and VA or SAA',
      path: 'proprietary-profit-1/:index/details',
      uiSchema: individualPage.uiSchema,
      schema: individualPage.schema,
    }),
  }),
);
