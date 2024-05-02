# Array Builder Pattern

Array builder pattern features an intro page (for required flow), a yes/no question if they have items to add, a loop of page(s) to fill out data for an item, and cards displayed for each item to review/edit/remove items. The user can add items until `maxItems` is reached.

## Table of Contents
- [Array Builder Pattern](#array-builder-pattern)
  - [Table of Contents](#table-of-contents)
  - [Flows](#flows)
  - [Terminology](#terminology)
  - [Example Code Required Flow](#example-code-required-flow)
  - [Example Code Optional Flow](#example-code-optional-flow)
  - [Example `config/form.js`](#example-configformjs)
  - [Web Component Patterns](#web-component-patterns)
    - [Example `arrayBuilderYesNoUI` Text Overrides:](#example-arraybuilderyesnoui-text-overrides)
  - [General Pattern Text Overrides](#general-pattern-text-overrides)
  - [URL Query Params](#url-query-params)
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

## Example Code Required Flow
You can copy this to a new file `pages/nounPlural.jsx` as a starting point, and then import to `config/form.js`
```js
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from '~/platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPlural',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: true,
  isItemIncomplete: item => !item?.name,
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item => `${item?.date}`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Your ${options.nounPlural}`,
      `In the next few questions, we’ll ask you about your ${
        options.nounPlural
      }. You must add at least one [noun singular]. You may add up to 5 ${
        options.nounPlural
      }.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasNounPlural': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasNounPlural': arrayBuilderYesNoSchema,
    },
    required: ['view:hasNounPlural'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name',
      nounSingular: options.nounSingular,
    }),
    name: {
      'ui:title': 'Name',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
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

export const nounSingularArrayPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    nounPlural: pageBuilder.introPage({
      title: 'Your [noun plural]',
      path: 'noun-plural-required',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    nounPluralSummary: pageBuilder.summaryPage({
      title: 'Your [noun plural]',
      path: 'noun-plural-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    nounSingularNamePage: pageBuilder.itemPage({
      title: 'Name',
      path: 'noun-plural/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    nounSingularDatePage: pageBuilder.itemPage({
      title: 'Date',
      path: 'noun-plural/:index/date',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
    }),
  }),
);
```

## Example Code Optional Flow
You can copy this to a new file `pages/nounPlural.jsx` as a starting point, and then import to `config/form.js`
```js
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from '~/platform/forms-system/src/js/web-component-fields';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'nounPlural',
  nounSingular: '[noun singular]',
  nounPlural: '[noun plural]',
  required: false,
  isItemIncomplete: item => !item?.name,
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: item => `${item?.date}`,
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:hasNounPlural': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasNounPlural': arrayBuilderYesNoSchema,
    },
    required: ['view:hasNounPlural'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name',
      nounSingular: options.nounSingular,
    }),
    name: {
      'ui:title': 'Name',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
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

export const nounSingularArrayPages = arrayBuilderPages( options,
  pageBuilder => ({
    nounPluralSummary: pageBuilder.summaryPage({
      title: 'Your [noun plural]',
      path: 'noun-plural',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    nounSingularNamePage: pageBuilder.itemPage({
      title: 'Name',
      path: 'noun-plural/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
    }),
    nounSingularDatePage: pageBuilder.itemPage({
      title: 'Date',
      path: 'noun-plural/:index/date',
      uiSchema: datePage.uiSchema,
      schema: datePage.schema,
    }),
  }),
);
```

## Example `config/form.js`
```js
import { nounSingularArrayPages } from '../pages/nounPlural';

const formConfig = {
  ...
  chapters: {
    nounPluralChapter: {
      title: 'Noun Plural',
      pages: nounSingularArrayPages
    },
  }
}
```

## Web Component Patterns
| Pattern | Description |
|---------|-------------|
| `arrayBuilderItemFirstPageTitleUI` | Should be used instead of `titleUI` for the first item page. Includes adding "Edit" before the title if in edit mode, and showing a `va-alert` warning if an item is required when removing all. |
| `arrayBuilderItemSubsequentPageTitleUI` | Can be used instead of `titleUI` for subsequent item pages. Includes adding "Edit" before the title if in edit mode. If you need to use a custom title instead, you can try passing `withEditTitle` into your implementation. |
| `withEditTitle` | Used with `arrayBuilderItemFirstPageTitleUI` and `arrayBuilderItemSubsequentPageTitleUI` to show "Edit" before the title, provided as an export for custom use. |
| `arrayBuilderYesNoUI` | Should be used instead of `yesNoUI` for the summary page. Has dynamic text for if the user has 0 items, or more 1+ items, and validation for max items. You can override all text values. |

### Example `arrayBuilderYesNoUI` Text Overrides:
```js
'view:hasEmployment': arrayBuilderYesNoUI(
  employersOptions,
  {
    title:
      'Do you have any employment, including self-employment for the last 5 years to report?',
    hint:
      'Include self-employment and military duty (including inactive duty for training).',
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
| `cancelAddNo` |
| `cancelAddTitle` |
| `cancelEditButtonText` |
| `cancelEditDescription` |
| `cancelEditReviewDescription` |
| `cancelEditNo` |
| `cancelEditTitle` |
| `cancelYes` |
| `cardDescription` |
| `cardItemMissingInformation` |
| `editSaveButtonText` |
| `getItemName` |
| `removeDescription` |
| `removeNeedAtLeastOneDescription` |
| `removeNo` |
| `removeTitle` |
| `removeYes` |
| `reviewAddButtonText` |
| `summaryTitle` |
| `yesNoBlankReviewQuestion` |

## URL Query Params
| Key | Description |
|-----|-------------|
| `add=true` | For adding an item. Going back or cancelling will remove the item. |
| `edit=true` | For editing an item. Fields will not persist until the user clicks "Save and continue". Clicking cancel, will not save the changes. |
| `review=true` | Used with `add=true` or `add=edit`. Used if coming from the `review-and-submit` page. Will return back to the `review-and-submit` page after finishing adding, editing, or cancelling this item. |
| `updated=nounSingular_0` | Used after completing an edit flow. |
| `removedAllWarn=true` | Used after removing all items. Will show a warning message if the item is required. |

## Future Enhancement Ideas
- Add `minItems`
- Allow for customizing the review page