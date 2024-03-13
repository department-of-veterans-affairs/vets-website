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
 * @property {function(FormConfigPage): FormConfigPage} [itemFirstPage] First page for the item
 * @property {function(FormConfigPage): FormConfigPage} [itemMiddlePage] A page between the first and last page for the item
 * @property {function(FormConfigPage): FormConfigPage} [itemLastPage] Last page for the item that will navigate back to the summary page
 * @property {function(FormConfigPage): FormConfigPage} [itemSinglePage] Use this if there's only one page
 */

/**
 * @typedef {Object} ArrayBuilderOptions
 * @property {string} nounSingular e.g. `employer`
 * @property {string} nounPlural e.g. `employers`
 * @property {string} arrayPath e.g. `employers`
 * @property {string} nextChapterPath e.g. `/next-chapter`
 * @property {string} [reviewPath] e.g. `/review-and-submit`
 * @property {(item) => boolean} [isIncompleteItem] Will display error on the cards if item is incomplete. e.g. `item => !item?.name`
 */

/**
 * @typedef {FormConfigChapter & {
 *   options: ArrayBuilderOptions
 * }} ArrayBuilderConfig
 */

function getBasePath(path) {
  const basePath = path.split('/:')[0];
  return basePath.startsWith('/') ? basePath : `/${basePath}`;
}

function throwErrorPage(pageType, option) {
  throw new Error(
    `arrayBuilderChapter \`pages.${pageType}()\` must include \`${option}\` property like this: ` +
      `\`arrayBuilderChapter(pages => ({ examplePage: pages.${pageType}({ ${option}: ... }) }))\``,
  );
}

function throwErrorChapter(option) {
  throw new Error(
    `arrayBuilderChapter must include \`options.${option}\` property`,
  );
}

function throwErrorNoConfigFunction() {
  throw new Error(
    'arrayBuilderChapter must include a config function like this `arrayBuilderChapter(pages => { ... })`',
  );
}

function throwErrorNoOptions() {
  throw new Error(
    'arrayBuilderChapter must include an `options` property like this: ' +
      '`arrayBuilderChapter(pages => ({ options: { ... } }))`',
  );
}

function throwMissingYesNoField() {
  throw new Error(
    "arrayBuilderChapter `pages.summaryPage()` must include a `uiSchema` that has a property with a `'ui:webComponentField': YesNoField`",
  );
}

function throwIncorrectItemPath() {
  throw new Error(
    'arrayBuilderChapter item pages must include a `path` property that ends with `/:index`',
  );
}

function verifyRequiredOptions(pageType, requiredOpts, objectToCheck) {
  requiredOpts.forEach(option => {
    if (objectToCheck[option] === undefined) {
      if (pageType === 'chapter') {
        throwErrorChapter(option);
      } else {
        throwErrorPage(pageType, option);
      }
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

/**
 * arrayBuilderChapter
 *
 * Example:
 * ```
 * chapterName: arrayBuilderChapter(pages => {
 *   title: 'Employment history',
 *   options: {
 *     arrayPath: 'employers',
 *     nounSingular: 'employer',
 *     nounPlural: 'employers',
 *     nextChapterPath: '/next-chapter',
 *   }
 *   summaryPage: pages.summaryPage({
 *     title: 'Employment history',
 *     path: '/summary',
 *     uiSchema: ...,
 *     schema: ...
 *   }),
 *   itemFirstPage: pages.itemFirstPage({
 *     title: 'Name and address of employer or unit',
 *     path: '/employer',
 *     uiSchema: ...,
 *     schema: ...
 *   }),
 *   itemLastPage: pages.itemLastPage({
 *     title: 'Name and address of employer or unit',
 *     path: '/employer',
 *     uiSchema: ...,
 *     schema: ...
 *   }),
 * }
 * ```
 *
 * @param {(pages: ArrayBuilderPages) => ArrayBuilderConfig} configFunction
 * @returns {FormConfigChapter}
 */
export default function arrayBuilderChapter(configFunction) {
  let itemFirstPagePath;
  let summaryPath;
  let hasItemsKey;

  if (!configFunction || typeof configFunction !== 'function') {
    throwErrorNoConfigFunction();
  }

  /**
   * @type {{
   *   [key: string]: (config: FormConfigPage) => FormConfigPage,
   * }}
   */
  const pages = {
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
    },
    itemFirstPage: pageConfig => {
      if (!pageConfig.path.endsWith('/:index')) {
        throwIncorrectItemPath();
      }
      itemFirstPagePath = getBasePath(pageConfig.path);
    },
    itemMiddlePage: pageConfig => {
      if (!pageConfig.path.endsWith('/:index')) {
        throwIncorrectItemPath();
      }
    },
    itemLastPage: pageConfig => {
      if (!pageConfig.path.endsWith('/:index')) {
        throwIncorrectItemPath();
      }
    },
    itemSinglePage: pageConfig => {
      if (!pageConfig.path.endsWith('/:index')) {
        throwIncorrectItemPath();
      }
    },
  };

  // run configFunction once to get initial options
  const { options } = configFunction(pages);
  if (!options) {
    throwErrorNoOptions();
  }

  const requiredChapterOpts = [
    'arrayPath',
    'nounSingular',
    'nounPlural',
    'arrayPath',
    'nextChapterPath',
  ];
  verifyRequiredOptions('chapter', requiredChapterOpts, options);

  const {
    nounSingular,
    nounPlural,
    arrayPath,
    nextChapterPath,
    reviewPath = '/review-and-submit',
    isIncompleteItem = item => !item?.name, // TODO: update this to use user param
  } = options;

  const CustomPageItem = ArrayBuilderItemPage({
    arrayPath,
    nounSingular,
    nounPlural,
    summaryRoute: summaryPath,
  });

  const SummaryCards = (
    <ArrayBuilderCards
      cardDescription={itemData =>
        `${itemData?.dateStart} - ${itemData?.dateEnd}`
      }
      arrayPath={arrayPath}
      nounSingular={nounSingular}
      nounPlural={nounPlural}
      isIncomplete={isIncompleteItem}
      editItemBasePathUrl={itemFirstPagePath}
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

  /**
   * @param {UISchemaOptions} uiSchema
   * @param {SchemaOptions} schema
   * @returns {FormConfigPage}
   */
  const commonItemSchemas = (uiSchema, schema) => ({
    uiSchema: {
      [arrayPath]: {
        items: uiSchema,
      },
    },
    schema: {
      type: 'object',
      properties: {
        [arrayPath]: {
          type: 'array',
          minItems: 1, // TODO parameterize
          maxItems: 100, // TODO parameterize
          items: schema,
        },
      },
    },
  });

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardFinishedItem = ({ goPath, urlParams, pathname }) => {
    let path = summaryPath;
    if (urlParams?.edit) {
      const index = getUrlPathIndex(pathname);
      const basePath = urlParams?.review ? reviewPath : summaryPath;
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
  const navForwardSummary = ({ formData, goPath }) => {
    if (formData[hasItemsKey]) {
      const index = formData[arrayPath] ? formData[arrayPath].length : 0;
      const path = createArrayBuilderItemAddPath({
        basePath: itemFirstPagePath,
        index,
      });
      goPath(path);
    } else {
      goPath(nextChapterPath);
    }
  };

  pages.summaryPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredOptions('summaryPage', requiredOpts, pageConfig);

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

  pages.itemFirstPage = pageConfig => {
    const { depends, ...restPageConfig } = pageConfig;
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredOptions('itemFirstPage', requiredOpts, pageConfig);

    return {
      ...commonItemPageConfig(depends),
      onNavBack: navBackFirstItem,
      onNavForward: onNavForwardKeepUrlParams,
      ...restPageConfig,
      ...commonItemSchemas(restPageConfig.uiSchema, restPageConfig.schema),
    };
  };

  pages.itemMiddlePage = pageConfig => {
    const { depends, ...restPageConfig } = pageConfig;
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredOptions('itemMiddlePage', requiredOpts, pageConfig);

    return {
      ...commonItemPageConfig(depends),
      onNavBack: onNavBackKeepUrlParams,
      onNavForward: onNavForwardKeepUrlParams,
      ...restPageConfig,
      ...commonItemSchemas(restPageConfig.uiSchema, restPageConfig.schema),
    };
  };

  pages.itemSinglePage = pageConfig => {
    const { depends, ...restPageConfig } = pageConfig;
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredOptions('itemSinglePage', requiredOpts, pageConfig);

    return {
      ...commonItemPageConfig(depends),
      onNavBack: navBackFirstItem,
      onNavForward: navForwardFinishedItem,
      ...restPageConfig,
      ...commonItemSchemas(restPageConfig.uiSchema, restPageConfig.schema),
    };
  };

  pages.itemLastPage = pageConfig => {
    const { depends, ...restPageConfig } = pageConfig;
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredOptions('itemLastPage', requiredOpts, pageConfig);

    return {
      ...commonItemPageConfig(depends),
      onNavBack: onNavBackKeepUrlParams,
      onNavForward: navForwardFinishedItem,
      ...restPageConfig,
      ...commonItemSchemas(restPageConfig.uiSchema, restPageConfig.schema),
    };
  };

  return configFunction(pages);
}
