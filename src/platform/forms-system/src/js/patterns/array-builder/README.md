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
    - [Examples checking for duplicate content](#examples-checking-for-duplicate-content)
  - [Array Builder Options](#array-builder-options)
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

### Examples checking for duplicate content
If you need to prevent adding duplicate data within the array, include the following duplicate checks.

#### Minimal example: Duplicate alert on summary page only

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
  },
  duplicateChecks: {
    // path to comparison data within the arrayPath
    comparisons: ['fullName.first', 'fullName.last', 'birthDate', 'ssn'],
  },
};
```

#### Minimal example: external data comparison on an internal array page only

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
  },
  duplicateChecks: {
    itemPathModalChecks: {
      // path in form config would be 'dependent-children/:index/birth-date'
      'birth-date': {
        comparisons: ['fullName.first', 'birthDate'],
        externalComparisonData: ({ formData, arrayData }) => {
          const dependents = formData?.dependentsFromApi || [];
          if (!dependents?.length) {
            return [];
          }
         // return array of array strings duplicate comparisons
          return dependents
            .filter(
              dependent =>
                dependent.relationshipToVeteran.toLowerCase() === 'child',
            )
            .map(child => [
              child.fullName?.first || '',
              child.dateOfBirth || '',
            ]);
        }
      },
    },
  },
};
```

#### Complex example: separate summary & internal page comparisons

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
  },
  duplicateChecks: {
    // comparison type: ['internal', 'external', 'all']; defaults to 'all'
    comparisonType: 'all',
    // path to comparison data within the arrayPath
    comparisons: ['fullName.first', 'fullName.last', 'birthDate', 'ssn'],
    externalComparisonData: ({ formData, arrayData }) => {
      /* formData = Full form data; API loaded external data needs to be added
       *  into the form data to get this to work
       * arrayData = data gathered from internal arrayPath based on comparisons,
       *  used to help with debugging
       * return array of array strings for comparison with arrayData
       * example: (first name, last name, birth date, ssn)
       * [
       *   ['John', 'Doe', '1990-01-01', '123-45-6789'],
       *   ['Jane', 'Smith', '1992-02-02', '987-65-4321']
       * ]
       */
      const dependents = formData?.dependentsFromApi || [];
      if (!dependents?.length) {
        return [];
      }
      return dependents
        .filter(
          dependent =>
            dependent.relationshipToVeteran.toLowerCase() === 'child',
        )
        .map(child => [
          child.fullName?.first || '',
          child.fullName?.last || '',
          child.dateOfBirth || '',
          child.ssn || '',
        ]);
    },

    itemPathModalChecks: {
      // path in config would be 'this-array/:index/date-of-birth'
      // Modal appears with duplicate when attempting to continue past this page
      'date-of-birth': {
        // Customize content for each internal page (defaults to arraybuilder
        // settings, or to default settings if not included here)
        // External setting makes external data array comparisons with unique
        // internal data
        comparisonType: 'external',
        comparisons: ['dateOfBirth'],
        externalComparisonData: ({ formData, arrayData }) => {
          const dependents = formData?.dependentsFromApi || [];
          if (!dependents?.length) {
            return [];
          }
          return dependents
            .filter(
              dependent =>
                dependent.relationshipToVeteran.toLowerCase() === 'child',
            )
            .map(child => [child.dateOfBirth || '']);
        },

        // Include page-specific content changes if needed.
        duplicateModalTitle: props => '...',
        duplicateModalDescription: props => '...',
        duplicateModalPrimaryButtonText: props => '...',
        duplicateModalSecondaryButtonText: props => '...',
      },
      // path in config would be 'this-array/:index/ssn'
      // Modal appears with duplicate when attempting to continue past this page
      'ssn': {
        comparisonType: 'external',
        comparisons: ['ssn'],
        externalComparisonData: ({ formData, arrayData }) => {
          const dependents = formData?.dependentsFromApi || [];
          if (!dependents?.length) {
            return [];
          }
          return dependents
            .filter(
              dependent =>
                dependent.relationshipToVeteran.toLowerCase() === 'child',
            )
            .map(child => [child.ssn || '']);
        },

        // Include page-specific content changes if needed.
        duplicateModalTitle: props => '...',
        duplicateModalDescription: props => '...',
        duplicateModalPrimaryButtonText: props => '...',
        duplicateModalSecondaryButtonText: props => '...',
      },
    },
  },
};
```

## Array Builder Options

| Option | Type | Description |
|--------|------|-------------|
| `arrayPath` | `string` | The formData key for the array e.g. `"employers"` for `formData.employers` |
| `nounSingular` | `string` | Used for text in cancel, remove, and modals |
| `nounPlural` | `string` | Used for text in cancel, remove, and modals |
| `required` | `boolean \| function` | Determines the flow type. If `true`, starts with intro page and expects at least 1 item |
| `isItemIncomplete` | `function` | Will display error on the cards if item is incomplete |
| `maxItems` | `number \| function` | Maximum number of items allowed in the array |
| `hideMaxItemsAlert` | `boolean` | Will not display the alert when maxItems is reached |
| `text` | `object` | Override any default text used in the array builder pattern |
| `reviewPath` | `string` | Defaults to `'review-and-submit'` if not provided |
| `reviewPanelHeadingLevel` | `string` | The heading level for the summary title on the review page |
| `useLinkInsteadOfYesNo` | `boolean` | Use a link instead of yes/no question |
| `useButtonInsteadOfYesNo` | `boolean` | Use a button instead of yes/no question |
| `canAddItem` | `function` | `({ arrayData, fullData, isReview }) => boolean` - Control add button/link visibility on summary page |
| `canEditItem` | `function` | `({ itemData, index, fullData, isReview }) => boolean` - Control edit link visibility per card |
| `canDeleteItem` | `function` | `({ itemData, index, fullData, isReview }) => boolean` - Control delete button visibility per card |
| `duplicateChecks` | `object` | Configuration for duplicate checking |

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