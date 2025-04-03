/* eslint-disable no-unused-vars */
import React from 'react';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import {
  createArrayBuilderItemAddPath,
  onNavForwardKeepUrlParams,
  onNavBackKeepUrlParams,
  onNavBackRemoveAddingItem,
  createArrayBuilderUpdatedPath,
  getArrayIndexFromPathName,
  initGetText,
  defaultSummaryPageScrollAndFocusTarget,
  defaultItemPageScrollAndFocusTarget,
  arrayBuilderDependsContextWrapper,
  arrayBuilderContextObject,
  getArrayUrlSearchParams,
} from './helpers';
import ArrayBuilderItemPage from './ArrayBuilderItemPage';
import ArrayBuilderSummaryPage from './ArrayBuilderSummaryPage';
import { DEFAULT_ARRAY_BUILDER_TEXT } from './arrayBuilderText';

/**
 * @typedef {Object} ArrayBuilderPages
 * @property {function(FormConfigPage): FormConfigPage} [introPage] Intro page which should be used for required flow
 * @property {function(FormConfigPage): FormConfigPage} summaryPage Summary page which includes Cards with edit/remove, and the Yes/No field
 * @property {function(FormConfigPage): FormConfigPage} itemPage A repeated page corresponding to an item
 */

/**
 * @typedef {Object} ArrayBuilderHelpers
 * @property {FormConfigPage['onNavBack']} navBackFirstItem
 * @property {FormConfigPage['onNavBack']} navBackKeepUrlParams
 * @property {FormConfigPage['onNavForward']} navForwardIntro
 * @property {FormConfigPage['onNavForward']} navForwardSummary
 * @property {FormConfigPage['onNavForward']} navForwardFinishedItem
 * @property {FormConfigPage['onNavForward']} navForwardKeepUrlParams
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
    'arrayBuilderPages `pageBuilder.summaryPage()` must either include a `uiSchema` that is using `arrayBuilderYesNoUI` pattern OR option `useLinkInsteadOfYesNo` or `useButtonInsteadOfYesNo` to array builder primary options.',
  );
}

function throwMissingYesNoValidation() {
  throw new Error(
    "arrayBuilderPages `pageBuilder.summaryPage()` must include a `uiSchema` that is using `arrayBuilderYesNoUI` pattern instead of `yesNoUI` pattern, or a similar pattern including `yesNoUI` with `'ui:validations'`",
  );
}

function safeDependsItem(depends) {
  if (typeof depends !== 'function') {
    return depends;
  }
  return (formData, index, context = null) => {
    try {
      return depends(
        formData,
        index,
        arrayBuilderDependsContextWrapper(context),
      );
    } catch (e) {
      return false;
    }
  };
}

function validateNoSchemaAssociatedWithLinkOrButton(
  pageConfig,
  useLinkInsteadOfYesNo,
  useButtonInsteadOfYesNo,
) {
  if (useLinkInsteadOfYesNo || useButtonInsteadOfYesNo) {
    if (useLinkInsteadOfYesNo && useButtonInsteadOfYesNo) {
      throw new Error(
        'arrayBuilderPages options cannot include both `useLinkInsteadOfYesNo` and `useButtonInsteadOfYesNo`.',
      );
    }
    const noSchemaProp = useLinkInsteadOfYesNo
      ? 'useLinkInsteadOfYesNo'
      : 'useButtonInsteadOfYesNo';

    const error =
      (pageConfig.schema?.properties &&
        Object.keys(pageConfig.schema.properties).length) ||
      (pageConfig.uiSchema && Object.keys(pageConfig.uiSchema).length);

    if (error) {
      const message = `
        arrayBuilderPages \`pageBuilder.summaryPage()\` does not currently support
        using \`uiSchema\` or \`schema\` properties when using option \`${noSchemaProp}\`.
        Provide an empty object for \`uiSchema\` and \`schema\` properties or remove them.
        For adding content, use \`text\` options \`summaryTitle\`, \`summaryTitleWithoutItems\`,
        \`summaryDescription\`, \`summaryDescriptionWithoutItems\`, \`summaryAddButtonText\`,
        \`summaryAddLinkText\`, as well as \`ContentBeforeButtons\` at the \`form/config\` page.
      `.replace(/\s+/g, ' ');
      throw new Error(message);
    }
  }
}

function throwIncorrectItemPath() {
  throw new Error(
    'arrayBuilderPages item pages must include a `path` property that includes `/:index`',
  );
}

function throwValidateRequired() {
  throw new Error(
    'arrayBuilderPages options must include a `required` boolean or function that returns a boolean. If `required` returns `true`, the flow should start with an "intro" page and expects at least 1 item from the user. If `required` returns `false`, the user can choose to skip the array entirely with a yes no question on the "summary" page.',
  );
}

function verifyRequiredArrayBuilderOptions(options, requiredOpts) {
  requiredOpts.forEach(option => {
    if (options[option] === undefined) {
      if (option === 'required') {
        throwValidateRequired();
      } else {
        throwErrorOption(option);
      }
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
  if (uiSchema) {
    for (const key of Object.keys(uiSchema)) {
      if (
        uiSchema[key]?.['ui:options']?.classNames?.includes(
          'wc-pattern-array-builder-yes-no',
        )
      ) {
        yesNoKey = key;
      }
    }
  }
  return yesNoKey;
}

export function getPageAfterPageKey(pageList, pageKey) {
  let nextPage;
  for (let i = 0; i < pageList.length; i += 1) {
    if (pageList[i].pageKey === pageKey) {
      nextPage = pageList[i + 1];
    }
  }
  return nextPage;
}

export function validatePages(orderedPageTypes) {
  const pageTypes = {};
  for (const pageType of orderedPageTypes) {
    if (pageType === 'intro') {
      if (pageTypes.intro || pageTypes.summary || pageTypes.item) {
        throw new Error(
          "arrayBuilderPages `pageBuilder.introPage` must be first and defined only once. Intro page should be used for 'required' flow, and should contain only text.",
        );
      }
      pageTypes.intro = true;
    } else if (pageType === 'summary') {
      if (pageTypes.summary || pageTypes.item) {
        throw new Error(
          'arrayBuilderPages `pageBuilder.summaryPage` must be defined only once and be defined before the item pages. This is so the loop cycle, and back and continue buttons will work consistently and appropriately. In a "required" flow, the summary path will be skipped on the first round despite being defined first.',
        );
      }
      pageTypes.summary = true;
    } else if (pageType === 'item') {
      pageTypes.item = true;
    }
  }
  if (!pageTypes.summary) {
    throw new Error(
      'arrayBuilderPages must include a summary page with `pageBuilder.summaryPage`',
    );
  }
  if (!pageTypes.item) {
    throw new Error(
      'arrayBuilderPages must include at least one item page with `pageBuilder.itemPage`',
    );
  }
}

export function validateRequired(required) {
  if (required == null || typeof required === 'string') {
    throwValidateRequired();
  }
}

function validatePath(path) {
  if (path?.charAt(0) === '/') {
    throw new Error(`path ${path} should not start with a \`/\``);
  }
}

export function validateReviewPath(reviewPath) {
  if (reviewPath?.charAt(0) === '/') {
    throw new Error(`reviewPath ${reviewPath} should not start with a \`/\``);
  }
}

export function validateMinItems(minItems) {
  if (minItems != null) {
    // eslint-disable-next-line no-console
    console.warn('minItems is not yet implemented. Use "required" instead.');
  }
}

export function assignGetItemName(options) {
  const safeGetItemName = getItemFn => {
    return (item, index) => {
      try {
        return getItemFn(item, index);
      } catch (e) {
        return null;
      }
    };
  };

  if (options.getItemName) {
    return safeGetItemName(options.getItemName);
  }
  if (options.text?.getItemName) {
    return safeGetItemName(options.text.getItemName);
  }
  return DEFAULT_ARRAY_BUILDER_TEXT.getItemName;
}

/**
 * README: {@link https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/platform/forms-system/src/js/patterns/array-builder/README.md|Array Builder Usage/Guidance/Examples}
 *
 *
 * @param {ArrayBuilderOptions} options
 * @param {(pageBuilder: ArrayBuilderPages, helpers?: ArrayBuilderHelpers) => FormConfigChapter} pageBuilderCallback
 * @returns {FormConfigChapter}
 */
export function arrayBuilderPages(options, pageBuilderCallback) {
  let introPath;
  let summaryPath;
  let hasItemsKey;
  const itemPages = [];
  const orderedPageTypes = [];

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
    'required',
  ]);

  const {
    arrayPath,
    nounSingular,
    nounPlural,
    isItemIncomplete = item => item?.name,
    minItems = 1,
    maxItems = 100,
    hideMaxItemsAlert = false,
    text: userText = {},
    reviewPath = 'review-and-submit',
    required: userRequired,
    useLinkInsteadOfYesNo = false,
    useButtonInsteadOfYesNo = false,
  } = options;

  const usesYesNo = !useLinkInsteadOfYesNo && !useButtonInsteadOfYesNo;
  const getItemName = assignGetItemName(options);

  const getText = initGetText({
    getItemName,
    nounPlural,
    nounSingular,
    textOverrides: userText,
  });

  /**
   * @type {{
   *   [key: string]: (config: FormConfigPage) => FormConfigPage,
   * }}
   */
  const pageBuilderVerifyAndSetup = {
    introPage: pageConfig => {
      introPath = pageConfig.path;
      validatePath(introPath);
      orderedPageTypes.push('intro');
      return pageConfig;
    },
    summaryPage: pageConfig => {
      summaryPath = pageConfig.path;
      if (usesYesNo) {
        try {
          hasItemsKey = determineYesNoField(pageConfig.uiSchema);
        } catch (e) {
          throwMissingYesNoField();
        }
        if (!hasItemsKey) {
          throwMissingYesNoField();
        }
        if (!pageConfig.uiSchema?.[hasItemsKey]?.['ui:validations']?.[0]) {
          throwMissingYesNoValidation();
        }
      }

      validateNoSchemaAssociatedWithLinkOrButton(
        pageConfig,
        useLinkInsteadOfYesNo,
        useButtonInsteadOfYesNo,
      );
      validatePath(summaryPath);
      orderedPageTypes.push('summary');
      return pageConfig;
    },
    itemPage: pageConfig => {
      if (!pageConfig?.path?.includes('/:index')) {
        throwIncorrectItemPath();
      }
      validatePath(pageConfig?.path);
      itemPages.push(pageConfig);
      orderedPageTypes.push('item');
      return pageConfig;
    },
  };

  // Verify and setup any initial page options
  pageBuilderCallback(pageBuilderVerifyAndSetup);
  validatePages(orderedPageTypes);
  validateRequired(userRequired);
  validateReviewPath(reviewPath);
  validateMinItems(options.minItems);
  const required =
    typeof userRequired === 'function' ? userRequired : () => userRequired;

  const getActiveItemPages = (formData, index, context = null) => {
    return itemPages.filter(page => {
      try {
        if (page.depends) {
          return safeDependsItem(page.depends)(formData, index, context);
        }
        return true;
      } catch (e) {
        return false;
      }
    });
  };

  const getFirstItemPagePath = (formData, index, context = null) => {
    return getActiveItemPages(formData, index, context)?.[0]?.path;
  };

  const getLastItemPagePath = (formData, index, context = null) => {
    const activeItemPages = getActiveItemPages(formData, index, context);
    return activeItemPages?.[activeItemPages.length - 1]?.path;
  };

  // Didn't throw error so success: Validated and setup success
  const pageBuilder = pageBuilderVerifyAndSetup;

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardFinishedItem = ({ goPath, urlParams, pathname, index }) => {
    let path = summaryPath;
    if (urlParams?.edit || (urlParams?.add && urlParams?.review)) {
      const foundIndex = getArrayIndexFromPathName(pathname);
      const basePath = urlParams?.review ? reviewPath : summaryPath;
      path = createArrayBuilderUpdatedPath({
        basePath,
        index: foundIndex == null ? index : foundIndex,
        nounSingular,
      });
    }
    goPath(path);
  };

  const navForwardSummaryAddItem = ({ formData, goPath }) => {
    const nextIndex = formData[arrayPath]?.length || 0;

    const path = createArrayBuilderItemAddPath({
      path: getFirstItemPagePath(
        formData,
        nextIndex,
        arrayBuilderContextObject({
          add: true,
          review: getArrayUrlSearchParams()?.get('review') === 'true',
        }),
      ),
      index: nextIndex,
    });
    goPath(path);
  };

  const navForwardSummaryGoNextChapter = ({ formData, goPath, pageList }) => {
    // if 0 items, 1 set of item pages still exist in the form
    const lastIndex = formData[arrayPath]?.length
      ? formData[arrayPath].length - 1
      : 0;

    const lastActivePath = `/${getLastItemPagePath(formData, lastIndex).replace(
      ':index',
      lastIndex,
    )}`;

    const nextPagePath = getNextPagePath(pageList, formData, lastActivePath);
    goPath(nextPagePath);
  };

  /** @type {FormConfigPage['onNavBack']} */
  const navBackFirstItem = onNavBackRemoveAddingItem({
    arrayPath,
    introRoute: introPath,
    summaryRoute: summaryPath,
    reviewRoute: reviewPath,
  });

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardSummary = ({ formData, goPath, pageList }) => {
    if (formData?.[hasItemsKey]) {
      navForwardSummaryAddItem({ formData, goPath });
    } else {
      navForwardSummaryGoNextChapter({ formData, goPath, pageList });
    }
  };

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardIntro = ({ formData, goPath, urlParams }) => {
    let path;
    // required flow:
    // intro -> items -> summary -> items -> summary
    //
    // optional flow:
    // summary -> items -> summary
    if (required(formData) && !formData[arrayPath]?.length) {
      path = createArrayBuilderItemAddPath({
        path: getFirstItemPagePath(
          formData,
          0,
          arrayBuilderContextObject({
            add: true,
            review: getArrayUrlSearchParams()?.get('review') === 'true',
          }),
        ),
        index: 0,
        isReview: urlParams?.review,
      });
      goPath(path);
    } else {
      path = summaryPath;
      if (urlParams?.review) {
        path = `${path}?review=true`;
      }
      goPath(path);
    }
  };

  function getNavItem(path) {
    const onNavBack = props => {
      return getFirstItemPagePath(props.formData, props.index) === path
        ? navBackFirstItem(props)
        : onNavBackKeepUrlParams(props);
    };
    const onNavForward = props => {
      return getLastItemPagePath(props.formData, props.index) === path
        ? navForwardFinishedItem(props)
        : onNavForwardKeepUrlParams(props);
    };
    return { onNavBack, onNavForward };
  }

  pageBuilder.introPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('introPage', requiredOpts, pageConfig);

    return {
      onNavForward: navForwardIntro,
      ...pageConfig,
    };
  };

  pageBuilder.summaryPage = pageConfig => {
    let requiredOpts = ['title', 'path'];
    if (usesYesNo) {
      requiredOpts = requiredOpts.concat(['uiSchema', 'schema']);
    }
    verifyRequiredPropsPageConfig('summaryPage', requiredOpts, pageConfig);

    const summaryPageProps = {
      arrayPath,
      hasItemsKey,
      getFirstItemPagePath,
      getText,
      introPath,
      isItemIncomplete,
      maxItems,
      hideMaxItemsAlert,
      nounPlural,
      nounSingular,
      required,
      useLinkInsteadOfYesNo,
      useButtonInsteadOfYesNo,
      isReviewPage: false,
    };

    const summaryReviewPageProps = {
      ...summaryPageProps,
      isReviewPage: true,
    };

    // If the user defines their own CustomPage to override ArrayBuilderSummaryPage,
    // then we should at least give them all the same props that we use for parity.
    // In the future, it would be nice to extract component features as a whole
    // to pass to a consumer's CustomPage as well, e.g. Cards, Alerts, NavButtons
    const CustomPage = pageConfig.CustomPage
      ? props => (
          <pageConfig.CustomPage {...props} arrayBuilder={summaryPageProps} />
        )
      : ArrayBuilderSummaryPage(summaryPageProps);

    const CustomPageReview = pageConfig.CustomPageReview
      ? props => (
          <pageConfig.CustomPageReview
            {...props}
            arrayBuilder={summaryReviewPageProps}
          />
        )
      : ArrayBuilderSummaryPage(summaryReviewPageProps);

    const page = {
      scrollAndFocusTarget:
        pageConfig.scrollAndFocusTarget ||
        defaultSummaryPageScrollAndFocusTarget,
      onNavForward: navForwardSummary,
      onNavBack: onNavBackKeepUrlParams,
      ...pageConfig,
      CustomPageReview,
      CustomPage,
    };

    if (!pageConfig.uiSchema) {
      page.uiSchema = {};
    }
    if (!pageConfig.schema || !Object.keys(pageConfig.schema).length) {
      page.schema = {
        type: 'object',
        properties: {},
      };
    }

    return page;
  };

  pageBuilder.itemPage = pageConfig => {
    const requiredOpts = ['title', 'path', 'uiSchema', 'schema'];
    verifyRequiredPropsPageConfig('itemPage', requiredOpts, pageConfig);
    const { onNavBack, onNavForward } = getNavItem(pageConfig.path);

    const itemPageProps = {
      arrayPath,
      introRoute: introPath,
      summaryRoute: summaryPath,
      reviewRoute: reviewPath,
      required,
      getText,
    };

    // If the user defines their own CustomPage to override ArrayBuilderItemPage,
    // then we should at least give them all the same props that we use for parity.
    // In the future, it would be nice to extract component features as a whole
    // to pass to a consumer's CustomPage as well, e.g. NavButtons, rerouting feature
    const CustomPage = pageConfig.CustomPage
      ? props => (
          <pageConfig.CustomPage {...props} arrayBuilder={itemPageProps} />
        )
      : ArrayBuilderItemPage(itemPageProps);

    return {
      showPagePerItem: true,
      allowPathWithNoItems: true,
      arrayPath,
      CustomPageReview: () => null,
      customPageUsesPagePerItemData: true,
      scrollAndFocusTarget:
        pageConfig.scrollAndFocusTarget || defaultItemPageScrollAndFocusTarget,
      onNavBack,
      onNavForward,
      ...pageConfig,
      ...(pageConfig.depends
        ? { depends: safeDependsItem(pageConfig.depends) }
        : {}),
      CustomPage,
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

  /**
   * @type {ArrayBuilderHelpers}
   */
  const helpers = {
    navBackFirstItem,
    navBackKeepUrlParams: onNavBackKeepUrlParams,
    navForwardIntro,
    navForwardSummary,
    navForwardFinishedItem,
    navForwardKeepUrlParams: onNavForwardKeepUrlParams,
  };

  return pageBuilderCallback(pageBuilder, helpers);
}
