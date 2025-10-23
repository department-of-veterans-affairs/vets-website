import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'otherServiceNames',
  nounSingular: 'name',
  nounPlural: 'names',
  required: false,
  isItemIncomplete: item =>
    !item?.otherServiceName?.first || !item?.otherServiceName?.last,
  maxItems: 2,
  text: {
    getItemName: item => {
      const name = item?.otherServiceName;
      if (!name?.first && !name?.last) return '';

      const parts = [];
      if (name?.first) parts.push(name.first);
      if (name?.middle) parts.push(name.middle);
      if (name?.last) parts.push(name.last);
      if (name?.suffix) parts.push(name.suffix);

      return parts.join(' ');
    },
  },
};

function introDescription() {
  return (
    <div>
      <p>
        In the next few questions, we'll ask you about other names the Veteran
        served under.
      </p>
    </div>
  );
}

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Service names',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': introDescription,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasOtherServiceNames': arrayBuilderYesNoUI(
      options,
      {
        title: 'Did the Veteran serve under any other names?',
        hint: '',
      },
      {
        title: 'Would you like to add another name the Veteran served under?',
        hint: '',
      },
    ),
  },
  schema: {
    type: 'object',
    required: ['view:hasOtherServiceNames'],
    properties: {
      'view:hasOtherServiceNames': arrayBuilderYesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
const otherServiceNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Other service name',
      nounSingular: options.nounSingular,
    }),
    otherServiceName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      otherServiceName: fullNameSchema,
    },
    required: ['otherServiceName'],
  },
};

export const otherServiceNamesPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    otherServiceNamesIntro: pageBuilder.introPage({
      title: 'test',
      path: 'veteran/other-service-names-intro',
      depends: formData => formData.receivedBenefits === false,
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    otherServiceNamesSummary: pageBuilder.summaryPage({
      title: 'Did the Veteran serve under any other names?',
      path: 'veteran/other-service-names',
      depends: formData => formData.receivedBenefits === false,
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    otherServiceNamePage: pageBuilder.itemPage({
      title: 'Other service name',
      path: 'veteran/other-service-names/:index',
      depends: formData => formData.receivedBenefits === false,
      uiSchema: otherServiceNamePage.uiSchema,
      schema: otherServiceNamePage.schema,
    }),
  }),
);
