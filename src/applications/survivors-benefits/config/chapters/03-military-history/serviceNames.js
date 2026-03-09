import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

function checkIsItemIncomplete(item) {
  return !item?.otherServiceName?.first || !item?.otherServiceName?.last;
}

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'veteranPreviousNames',
  nounSingular: 'name',
  nounPlural: 'names',
  required: false,
  isItemIncomplete: item => checkIsItemIncomplete(item),
  maxItems: 2,
  text: {
    summaryTitle: 'Review the Veteran’s other service names',
    alertMaxItems: (
      <div>
        <p className="vads-u-margin-top--0">
          You have added the maximum number of allowed service names for this
          application. Additional service names can be added using VA Form
          21-4138 and uploaded at the end of this application.
        </p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21-4138/"
          external
          text="Get VA Form 21-4138 to download"
        />
      </div>
    ),
    cancelAddTitle: 'Cancel adding this service name?',
    cancelEditTitle: 'Cancel editing this service name?',
    cancelAddDescription:
      'If you cancel, we won’t add this name to your list of service names. You’ll return to a page where you can add a new service name.',
    cancelEditDescription:
      'If you cancel, you’ll lose any changes you made to this service name and you will be returned to the service name review page.',
    cancelAddYes: 'Yes, cancel adding',
    cancelAddNo: 'No, continue adding',
    cancelEditYes: 'Yes, cancel editing',
    cancelEditNo: 'No, continue editing',
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
        Next we’ll ask you about other names the Veteran served under. You may
        add up to 2 names.
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
      title: 'Service names',
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
