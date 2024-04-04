/* eslint-disable no-unused-vars */
import React from 'react';
import { getUrlPathIndex } from 'platform/forms-system/src/js/helpers';
import { YesNoField } from 'platform/forms-system/src/js/web-component-fields';
import {
  createArrayBuilderItemAddPath,
  onNavForwardKeepUrlParams,
  onNavBackKeepUrlParams,
  onNavBackRemoveAddingItem,
  createArrayBuilderUpdatedPath,
} from '../helpers';
import ArrayBuilderItemPage from './ArrayBuilderItemPage';
import ArrayBuilderCards from './ArrayBuilderCards';

/**
 * @typedef {Object} ArrayBuilderPages
 * @property {function(FormConfigPage): FormConfigPage} summaryPage Summary page which includes Cards with edit/remove, and the Yes/No field
 * @property {function(FormConfigPage): FormConfigPage} [itemPage] A repeated page corresponding to an item
 */

/**
 * @typedef {Object} ArrayBuilderOptions
 * @property {string} arrayPath the formData key for the array e.g. `"employers"` for `formData.employers`
 * @property {string} nounSingular Used for text in cancel, remove, and modals. Used with nounPlural
 * ```
 * // Example:
 * nounSingular: "employer"
 * nounPlural: "employers"
 * ```
 * @property {string} nounPlural Used for text in cancel, remove, and modals. Used with nounSingular
 * ```
 * // Example:
 * nounSingular: "employer"
 * nounPlural: "employers"
 * ```
 * @property {(item) => boolean} [isItemIncomplete] Will display error on the cards if item is incomplete. e.g. `item => !item?.name`
 * @property {string} [reviewPath] Will default to the last page. Specify this to manually set it e.g. `"/review-and-submit"`
 * @property {{
 *   getItemName?: (item) => string | JSX.Element,
 *   cardDescription?: (item) => string,
 * }} [text] optional text overrides
 */

function throwErrorPage(pageType, option) {
  throw new Error(
    `arrayBuilderPages \`pageBuilder.${pageType}()\` must include \`${option}\` property like this: ` +
      `\`...arrayBuilderPages(options, pageBuilder => ({ examplePage: pageBuilder.${pageType}({ ${option}: ... }) }))\``,
  );
}

function throwErrorOption(option) {
  throw new Error(
    `arrayBuilderPages options must include \`${option}\` property like this: ` +
      `\`...arrayBuilderPages({ ${option}: ... }, pageBuilder => { ... })\``,
  );
}

function throwErrorNoOptionsOrCallbackFunction() {
  throw new Error(
    'arrayBuilderPages must include options and a callback like this `...arrayBuilderPages(options, pageBuilder => { ... })`',
  );
}

function throwMissingYesNoField() {
  throw new Error(
    "arrayBuilderPages `pageBuilder.summaryPage()` must include a `uiSchema` that has a property with a `'ui:webComponentField': YesNoField`",
  );
}

function throwIncorrectItemPath() {
  throw new Error(
    'arrayBuilderPages item pages must include a `path` property that includes `/:index`',
  );
}

function verifyRequiredArrayBuilderOptions(options, requiredOpts) {
  requiredOpts.forEach(option => {
    if (options[option] === undefined) {
      throwErrorOption(option);
    }
  });
}

function verifyRequiredPropsPageConfig(pageType, requiredOpts, objectToCheck) {
  requiredOpts.forEach(option => {
    if (objectToCheck[option] === undefined) {
      throwErrorPage(pageType, option);
    }
  });
}

function determineYesNoField(uiSchema) {
  let yesNoKey;
  for (const key of Object.keys(uiSchema)) {
    if (uiSchema[key]['ui:webComponentField'] === YesNoField) {
      yesNoKey = key;
    }
  }
  return yesNoKey;
}

export function getPageAfterPageKey(pageList, pageKey) {
  let nextPage;
  for (let i = 0; i < pageList.length; i++) {
    if (pageList[i].pageKey === pageKey) {
      nextPage = pageList[i + 1];
    }
  }
  return nextPage;
}

/**
 * Example:
 * ```
 * pages: {
 *   ...arrayBuilderPages(
 *     {
 *       arrayPath: 'employers',
 *       nounSingular: 'employer',
 *       nounPlural: 'employers',
 *       isItemIncomplete: item => !item?.name,
 *       maxItems: 5,
 *       text: {
 *         getItemName: item => item.name,
 *         cardDescription: item => `${item?.dateStart} - ${item?.dateEnd}`,
 *         ...you can override any of the text content
 *       },
 *     },
 *     pageBuilder => ({
 *       mySummaryPage: pageBuilder.summaryPage({
 *         title: 'Employers',
 *         path: 'employers-summary',
 *         uiSchema: ...,
 *         schema: ...,
 *       }),
 *       myItemPageOne: pageBuilder.itemPage({
 *         title: 'Name of employer',
 *         path: 'employers/:index/name',
 *         uiSchema: ...,
 *         schema: ...,
 *       }),
 *       myItemPageTwo: pageBuilder.itemPage({
 *         title: 'Address of employer',
 *         path: 'employers/:index/address',
 *         uiSchema: ...,
 *         schema: ...,
 *       }),
 *     }),
 *   ),
 * },
 * ```
 *
 * - Use `pageBuilder.summaryPage` for the summary page with the yes/no question and the cards
 * - Use `pageBuilder.itemPage` for a page that will be repeated for each item
 *
 * @param {ArrayBuilderOptions} options
 * @param {(pageBuilder: ArrayBuilderPages) => FormConfigChapter} pageBuilderCallback
 * @returns {FormConfigChapter}
 */
export function arrayBuilderPages(options, pageBuilderCallback) {
  let summaryPath;
  let hasItemsKey;
  const itemPages = [];

  if (
    !options ||
    typeof options !== 'object' ||
    !pageBuilderCallback ||
    typeof pageBuilderCallback !== 'function'
  ) {
    throwErrorNoOptionsOrCallbackFunction();
  }

  verifyRequiredArrayBuilderOptions(options, [
    'arrayPath',
    'nounSingular',
    'nounPlural',
  ]);

  const {
    arrayPath,
    nounSingular,
    nounPlural,
    getItemName = item => item?.name,
    isItemIncomplete = item => item?.name,
    minItems = 1,
    maxItems = 100,
    text = {},
    reviewPath,
  } = options;

  /**
   * @type {{
   *   [key: string]: (config: FormConfigPage) => FormConfigPage,
   * }}
   */
  const pageBuilderVerifyAndSetup = {
    summaryPage: pageConfig => {
      summaryPath = pageConfig.path;
      try {
        hasItemsKey = determineYesNoField(pageConfig.uiSchema);
      } catch (e) {
        throwMissingYesNoField();
      }
      if (!hasItemsKey) {
        throwMissingYesNoField();
      }
      return pageConfig;
    },
    itemPage: pageConfig => {
      if (!pageConfig?.path.includes('/:index')) {
        throwIncorrectItemPath();
      }
      itemPages.push(pageConfig);
      return pageConfig;
    },
  };

  // Verify and setup any initial page options
  const testConfig = pageBuilderCallback(pageBuilderVerifyAndSetup);
  const pageKeys = Object.keys(testConfig);
  const firstItemPagePath = itemPages?.[0]?.path;
  const lastItemPagePath = itemPages?.[itemPages.length - 1]?.path;
  const itemLastPageKey = pageKeys?.[pageKeys.length - 1];

  // Didn't throw error so success: Validated and setup success
  const pageBuilder = pageBuilderVerifyAndSetup;

  const CustomPageItem = ArrayBuilderItemPage({
    arrayPath,
    nounSingular,
    nounPlural,
    summaryRoute: summaryPath,
  });

  const SummaryCards = (
    <ArrayBuilderCards
      cardDescription={text?.cardDescription || undefined}
      arrayPath={arrayPath}
      nounSingular={nounSingular}
      nounPlural={nounPlural}
      isIncomplete={isItemIncomplete}
      editItemPathUrl={firstItemPagePath}
    />
  );

  /** @returns {FormConfigPage} */
  const commonItemPageConfig = depends => ({
    showPagePerItem: true,
    allowPathWithNoItems: true,
    arrayPath,
    CustomPage: CustomPageItem,
    CustomPageReview: () => null,
    customPageUsesPagePerItemData: true,
    depends: formData =>
      (depends ? depends(formData) : true) &&
      (formData[hasItemsKey] || formData[arrayPath]?.length > 0),
  });

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardFinishedItem = ({
    goPath,
    urlParams,
    pathname,
    pageList,
  }) => {
    let path = summaryPath;
    if (urlParams?.edit) {
      const index = getUrlPathIndex(pathname);
      const review = reviewPath || pageList[pageList.length - 1]?.path;
      const basePath = urlParams?.review ? review : summaryPath;
      path = createArrayBuilderUpdatedPath({
        basePath,
        index,
        nounSingular,
      });
    }
    goPath(path);
  };

  /** @type {FormConfigPage['onNavBack']} */
  const navBackFirstItem = onNavBackRemoveAddingItem({
    arrayPath,
    summaryPathUrl: summaryPath,
  });

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardSummary = ({ formData, goPath, pageList }) => {
    if (formData[hasItemsKey]) {
      const index = formData[arrayPath] ? formData[arrayPath].length : 0;
      const path = createArrayBuilderItemAddPath({
        path: firstItemPagePath,
        index,
      });
      goPath(path);
    } else {
      const nextPage = getPageAfterPageKey(pageList, itemLastPageKey);
      goPath(nextPage?.path);
    }
  };

  function getNavItem(path) {
    const onNavBack =
      firstItemPagePath === path ? navBackFirstItem : onNavBackKeepUrlParams;
    const onNavForward =
      lastItemPagePath === path
        ? navForwardFinishedItem
        : onNavForwardKeepUrlParams;
    return { onNavBack, onNavForward };
  }

  pageBuilder.summaryPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('summaryPage', requiredOpts, pageConfig);

    return {
      CustomPageReview: () => SummaryCards,
      onNavForward: navForwardSummary,
      ...pageConfig,
      uiSchema: {
        ...pageConfig.uiSchema,
        'ui:description': SummaryCards,
      },
    };
  };

  pageBuilder.itemPage = pageConfig => {
    const { depends, ...restPageConfig } = pageConfig;
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('itemFirstPage', requiredOpts, pageConfig);
    const { onNavBack, onNavForward } = getNavItem(pageConfig.path);

    return {
      showPagePerItem: true,
      allowPathWithNoItems: true,
      arrayPath,
      CustomPage: ArrayBuilderItemPage({
        arrayPath,
        nounSingular,
        nounPlural,
        summaryRoute: summaryPath,
      }),
      CustomPageReview: () => null,
      customPageUsesPagePerItemData: true,
      depends: formData =>
        (depends ? depends(formData) : true) &&
        (formData[hasItemsKey] || formData[arrayPath]?.length > 0),
      onNavBack,
      onNavForward,
      ...restPageConfig,
      uiSchema: {
        [arrayPath]: {
          items: pageConfig.uiSchema,
        },
      },
      schema: {
        type: 'object',
        properties: {
          [arrayPath]: {
            type: 'array',
            minItems,
            maxItems,
            items: pageConfig.schema,
          },
        },
      },
    };
  };

  return pageBuilderCallback(pageBuilder);
}
