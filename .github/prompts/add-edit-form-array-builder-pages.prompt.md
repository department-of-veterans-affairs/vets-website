---
mode: 'agent'
---
# Array Builder Pattern (Multiple responses list & loop)

Follow these steps when adding or updating array builder pages in the form.
1. Update `config/form.js` based on Step 1 below.
2. Update or create `pages/{nounPluralReplaceMe}.js`. For example if working with "employers", the file would be `pages/employers.js`. The content of `pages/{nounPluralReplaceMe}.js` should be similar to the one of the examples below, which contains all sub pages and exports. Use best judgement whether you think the page should be required or optional, which uses different templates below.
3. Ensure any text that says noun or noun plural or replace me is replaced with the correct noun or noun plural based on the type of data.
4. Validate pages uses `arrayBuilderItemFirstPageTitleUI` or `arrayBuilderItemSubsequentPageTitleUI` instead of `titleUI`, and `arrayBuilderYesNoUI` for is used for summary page instead of `yesNoUI`.
5. Validate the exports are used correctly by the form config.
6. Validate the web component patterns are used correctly, and correct if necessary.

## Example code
### Step 1. `config/form.js`
```js
import { nounPluralReplaceMePages } from '../pages/nounPluralReplaceMe';

const formConfig = {
  ...
  chapters: {
    nounPluralReplaceMeChapter: {
      title: 'Noun Plural',
      pages: nounPluralReplaceMePages
    },
  }
}
```

### Step 2. Create either "required" pages flow or "optional" pages flow

### Example Pages "Required" Flow
You can copy this to a new file `pages/nounPluralReplaceMe.js` as a starting point, and then import to `config/form.js`
```js
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

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPluralReplaceMe',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: true,
  isItemIncomplete: item => !item?.name, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: (item, index) => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Your ${options.nounPlural}`,
      `In the next few questions, we’ll ask you about your ${
        options.nounPlural
      }. You must add at least one ${options.nounSingular}. You may add up to 5 ${
        options.nounPlural
      }.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
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
      title: 'Name',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
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
```

### Example Pages "Optional" Flow
You can copy this to a new file `pages/nounPluralReplaceMe.js` as a starting point, and then import to `config/form.js`
```js
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPluralReplaceMe',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: false,
  isItemIncomplete: item => !item?.name, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: (item, index) => item.name,
    cardDescription: item => `${formatReviewDate(item?.date)}`,
    summaryDescription: 'You can add up to 5 items',
  },
};

/**
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
      title: 'Name',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
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

export const nounPluralReplaceMePages = arrayBuilderPages( options,
  pageBuilder => ({
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
```

### Example `arrayBuilderYesNoUI` Text Overrides:
```js
'view:hasEmployment': arrayBuilderYesNoUI(
  options,
  {
    title:
      'Do you have any employment, including self-employment for the last 5 years to report?',
    hint: (props) =>
      `Include self-employment and military duty (including inactive duty for training). ${maxItemsHint(props)}`,
    labels: {
      Y: 'Yes, I have employment to report',
      N: 'No, I don’t have employment to report',
    },
  },
  {
    title: 'Do you have another employer to report?',
    labels: {
      Y: 'Yes, I have another employer to report',
      N: 'No, I don’t have another employer to report',
    },
  },
),
```
