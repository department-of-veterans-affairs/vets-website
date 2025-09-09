# Array Builder Pattern (Multiple responses list & loop)

Array builder pattern features an intro page (for required flow), a yes/no question if they have items to add, a loop of page(s) to fill out data for an item, and cards displayed for each item to review/edit/remove items. The user can add items until `maxItems` is reached.

## Table of Contents
- [Array Builder Pattern (Multiple responses list \& loop)](#array-builder-pattern-multiple-responses-list--loop)
  - [Table of Contents](#table-of-contents)
  - [Flows](#flows)
  - [Terminology](#terminology)
  - [Example code](#example-code)
    - [Step 1. `config/form.js`](#step-1-configformjs)
    - [Step 2. Create either "required" pages flow or "optional" pages flow](#step-2-create-either-required-pages-flow-or-optional-pages-flow)
    - [Example Pages "Required" Flow](#example-pages-required-flow)
    - [Example Pages "Optional" Flow](#example-pages-optional-flow)
    - [Example using action link (or button) instead of yes/no question](#example-using-action-link-or-button-instead-of-yesno-question)
    - [Example content at bottom of page](#example-content-at-bottom-of-page)
  - [Web Component Patterns](#web-component-patterns)
    - [Example `arrayBuilderYesNoUI` Text Overrides:](#example-arraybuilderyesnoui-text-overrides)
  - [General Pattern Text Overrides](#general-pattern-text-overrides)
  - [URL Query Params](#url-query-params)
  - [Advanced routing](#advanced-routing)
  - [Custom navigation with `helpers`](#custom-navigation-with-helpers)
  - [Future Enhancement Ideas](#future-enhancement-ideas)

## Flows
| Flow | `required` | Description |
|------|----|---------|
| Required | `true` | `introPage` -> `itemPage` -> `summaryPage` -> `itemPage` -> `summaryPage` |
| Optional | `false` | `summaryPage` -> `itemPage` -> `summaryPage` |

## Terminology
| Term | Definition |
|------|------------|
| "item" | A single item (object) in the array, e.g. an employer in a list of employers. |
| `introPage` | A simple text page that tells the user they are about to go through an array. This page is not needed for an "optional" flow, but is necessary for a "required" flow, because we will go directly from the introPage to an itemPage and skip the summary on the first time around. |'
| `itemPage` | One of the pages (there can be multiple) that has fields and allows the user to fill out information for the current item. |
| `summaryPage` | The page that shows cards of all the items the user has entered so far + yes/no question if they have more to add. The user is return to this page after every loop, until they select "no" that they don't have any more to add. |

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
  - [Example Pages "Required" Flow](#example-pages-required-flow)
  - [Example Pages "Optional" Flow](#example-pages-optional-flow)

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
    getItemName: (item, index, fullData) => item.name,
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
    getItemName: (item, index, fullData) => item.name,
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

### Example using action link (or button) instead of yes/no question
Use the [Optional flow](#example-pages-optional-flow) as a starting point, and make the following replacements:

```js
const title = 'Events from your service';
const description = (
  <div>
    <p>Lorem ipsum dolor sit amet.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
  </div>
);

/** @type {ArrayBuilderOptions} */
const options = {
  ...
  useLinkInsteadOfYesNo: true,
  required: false,
  text: {
    getItemName: (item, index, fullData) => item.name,
    summaryTitle: title,
    summaryTitleWithoutItems: title,
    summaryDescription: description,
    summaryDescriptionWithoutItems: description,
    summaryAddLinkText: (props) => {
      return props.itemData?.length ? 'Add another event' : 'Add an event';
    },
    reviewAddButtonText: (props) => {
      return props.itemData?.length ? 'Add another event' : 'Add an event';
    },
    yesNoBlankReviewQuestion: 'Did you have any events?', // No
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
  },
};
```

If you want to use a button instead of a link, use `useButtonInsteadOfYesNo: true`.

`uiSchema` or `schema` no longer be necessary if using a link or button.

### Example content at bottom of page
If you want additional content below the link or button, you can use the `ContentBeforeButtons` prop at the `form/config` page level.

```js
export const nounPluralReplaceMePages = arrayBuilderPages( options,
  pageBuilder => ({
    nounPluralReplaceMeSummary: pageBuilder.summaryPage({
      ...
      ContentBeforeButtons: () => (
        <div>
          <p>Content before "Finish your form later" link, and back/continue buttons</p>
        </div>
      ),
    }),
    ...
  }),
);
```

### Example checking for duplicate content
If you need to prevent adding duplicate data within the array, include the following duplicate checks.

```js
/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'childrenToAdd',
  nounSingular: 'child',
  nounPlural: 'children',
  required: true,
  // ...
  text: {
    getItemName: (item, index, fullData) => item.name,

    // Default duplicate messages shown
    // Internal data array comparisons only or Internal data and external data
    duplicateSummaryCardInfoAlert: props =>
      `You may have multiple children with this same information.`,
    duplicateSummaryCardWarningOrErrorAlert: props => (
      <>
        <p className="vads-u-margin-top--0">
          You may have entered multiple children with this same information.
        </p>
        <p>
          Before continuing, review these entries and delete any duplicates.
        </p>
      </>
    ),
    duplicateModalTitle: props => 'Is this a duplicate?',
    duplicateModalDescription: props =>
      `You’ve entered multiple children with this information`,
    duplicateModalPrimaryButtonText: props => 'No, cancel',
    duplicateModalSecondaryButtonText: props => 'Yes, save and continue',

    // Internal compared to external data only (internal duplicates are ignored)
    duplicateSummaryCardExternalComparisonInfoAlert: props =>
      `This child may be a duplicate entry.`,
    duplicateSummaryCardExternalComparisonWarningOrErrorAlert: props =>
      `This child matches information we already have on file.
      Before continuing, review these entries and delete any duplicates.`,
    duplicateModalExternalComparisonTitle: props => 'Is this a duplicate?',
    duplicateModalExternalComparisonDescription: props =>
      `This child matches information we already have on file`,
    duplicateModalExternalComparisonPrimaryButtonText: props => 'No, cancel',
    duplicateModalExternalComparisonSecondaryButtonText: props =>
      'Yes, save and continue',

    duplicateSummaryCardLabel: props => 'DUPLICATE',
  },
};

// Item page and/or summary page UI schema needs to include a `ui:duplicateChecks` object with comparisons and
const uiSchema = {
  'ui:duplicateChecks': {
    // If duplicates are allowed, progress past the item and summary page is
    // blocked; set to true by default
    allowDuplicates: true,
    // comparison type: ['internal', 'external', 'all']; defaults to 'all'
    comparisonType: 'all',
    // path to comparison data within the arrayPath
    comparisons: ['fullName.first', 'fullName.last', 'birthDate', 'ssn'],
    externalComparisonData: ({ formData, arrayData }) => {
      /* formData = Full form data; API loaded external data needs to be added
       *  into the form data to get this to work
       * arrayData = data gathered from internal arrayPath based on comparisons
       * return array of array strings for comparison with arrayData
       * example: (first name, last name, birth date, ssn)
       * [
       *   ['John', 'Doe', '1990-01-01', '123-45-6789'],
       *   ['Jane', 'Smith', '1992-02-02', '987-65-4321']
       * ]
       */
      return [];
    },

    // Customize content for each page (defaults to arraybuilder settings,
    // or to default settings if not included here)
    // Internal data array comparisons with and without external data
    duplicateModalTitle: props => '...',
    duplicateModalDescription: props => '...',
    duplicateModalPrimaryButtonText: props => '...',
    duplicateModalSecondaryButtonText: props => '...',
    duplicateSummaryCardWarningOrErrorAlert: props => '...',
    duplicateSummaryCardInfoAlert: props => '...',

    // Internal with external data comparisons (internal duplicates are ignored)
    duplicateModalExternalComparisonTitle: props => '...',
    duplicateModalExternalComparisonDescription: props => '...',
    duplicateModalExternalComparisonPrimaryButtonText: props => '...',
    duplicateModalExternalComparisonSecondaryButtonText: props => '...',
    duplicateSummaryCardExternalComparisonWarningOrErrorAlert: props => '...',
    duplicateSummaryCardExternalComparisonInfoAlert: props => '...',
  },
};
```

## Web Component Patterns
| Pattern | Description |
|---------|-------------|
| `arrayBuilderItemFirstPageTitleUI` | Should be used instead of `titleUI` for the first item page. Includes adding "Edit" before the title if in edit mode, and showing a `va-alert` warning if an item is required when removing all. The description instructions can optionally be hidden when their is only one item page via the `hasMultipleItemPages: false` function parameter. |
| `arrayBuilderItemSubsequentPageTitleUI` | Can be used instead of `titleUI` for subsequent item pages. Includes adding "Edit" before the title if in edit mode. If you need to use a custom title instead, you can try passing `withEditTitle` into your implementation. |
| `withEditTitle` | Used with `arrayBuilderItemFirstPageTitleUI` and `arrayBuilderItemSubsequentPageTitleUI` to show "Edit" before the title, provided as an export for custom use. The "Edit" title item can be optionally lowercased via the `lowerCase` function parameter. |
| `arrayBuilderYesNoUI` | Should be used instead of `yesNoUI` for the summary page. Has dynamic text for if the user has 0 items, or more 1+ items, and validation for max items. After an item is added/cancelled the yes/no question is reset. You can override all text values. |

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

## General Pattern Text Overrides
You can override almost any text in the array builder pattern. Here is an example of how to override the text for the `alertItemUpdated` key:
```js
const options = {
  text: {
      alertItemUpdated: (props) => {
        return `Your ${props.nounSingular} has been updated.`;
      },
  }
}
```

| Key |
|-----|
| `alertItemUpdated` |
| `alertMaxItems` |
| `cancelAddButtonText` |
| `cancelAddDescription` |
| `cancelAddReviewDescription` |
| `cancelAddYes` |
| `cancelAddNo` |
| `cancelAddTitle` |
| `cancelEditButtonText` |
| `cancelEditDescription` |
| `cancelEditReviewDescription` |
| `cancelEditYes` |
| `cancelEditNo` |
| `cancelEditTitle` |
| `cardDescription` |
| `cardItemMissingInformation` |
| `editSaveButtonText` |
| `getItemName` |
| `deleteDescription` |
| `deleteNeedAtLeastOneDescription` |
| `deleteNo` |
| `deleteTitle` |
| `deleteYes` |
| `duplicateModalTitle` |
| `duplicateModalDescription` |
| `duplicateModalPrimaryButtonText` |
| `duplicateModalSecondaryButtonText` |
| `duplicateSummaryCardWarningOrErrorAlert` |
| `duplicateSummaryCardInfoAlert` |
| `reviewAddButtonText` |
| `summaryTitle` |
| `summaryTitleWithoutItems` |
| `summaryDescription` |
| `summaryDescriptionWithoutItems` |
| `yesNoBlankReviewQuestion` |

## URL Query Params
| Key | Description |
|-----|-------------|
| `add=true` | For adding an item. Going back or cancelling will remove the item. |
| `edit=true` | For editing an item. Fields will not persist until the user clicks "Save and continue". Clicking cancel, will not save the changes. |
| `review=true` | Used with `add=true` or `add=edit`. Used if coming from the `review-and-submit` page. Will return back to the `review-and-submit` page after finishing adding, editing, or cancelling this item. |
| `updated=nounSingular_0` | Used after completing an edit flow. |
| `removedAllWarn=true` | Used after removing all items. Will show a warning message if the item is required. |

## Advanced routing
Use `depends` for conditional pages
```js
...arrayBuilderPages(employersOptions, pageBuilder => ({
  multiPageBuilderSummary: pageBuilder.summaryPage({
    title: 'Array with multiple page builder summary',
    path: 'array-multiple-page-builder-summary',
    uiSchema: employersSummaryPage.uiSchema,
    schema: employersSummaryPage.schema,
  }),
  multiPageBuilderStepOne: pageBuilder.itemPage({
    title: 'Employer name and address',
    path: 'array-multiple-page-builder/:index/name-and-address',
    uiSchema: employersPageNameAndAddressPage.uiSchema,
    schema: employersPageNameAndAddressPage.schema,
    depends: (formData, index) => formData.employers?.[index]?.type === 'Military',
  }),
}));
```

## Custom navigation with `helpers`
`arrayBuilderPages` has a second parameter `helpers` to help with things like a custom `onNavForward` and `onNavBack`.
e.g.
```js
...arrayBuilderPages(employersOptions, (pageBuilder, helpers) => ({
  multiPageBuilderSummary: pageBuilder.summaryPage({
    title: 'Array with multiple page builder summary',
    path: 'array-multiple-page-builder-summary',
    uiSchema: employersSummaryPage.uiSchema,
    schema: employersSummaryPage.schema,
  }),
  multiPageBuilderStepOne: pageBuilder.itemPage({
    title: 'Employer name and address',
    path: 'array-multiple-page-builder/:index/name-and-address',
    uiSchema: employersPageNameAndAddressPage.uiSchema,
    schema: employersPageNameAndAddressPage.schema,
    onNavForward: props => {
      return props.formData.name === 'Veteran'
        ? helpers.navForwardKeepUrlParams(props) // go to next page
        : helpers.navForwardFinishedItem(props); // return to summary
    },
  }),
  // an optional itemPage follows
}));
```

## Future Enhancement Ideas
- Add `minItems`
- Allow for customizing the review page