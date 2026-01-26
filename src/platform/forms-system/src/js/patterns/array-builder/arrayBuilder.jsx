import React from 'react';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import environment from 'platform/utilities/environment';
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
  maxItemsFn,
  getDependsPath,
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

function throwMultiplePagesRequireDepends(pageType) {
  throw new Error(
    `arrayBuilderPages: Only one \`pageBuilder.${pageType}\` is allowed. If you need multiple ${
      pageType === 'introPage' ? 'intro' : 'summary'
    } pages that display conditionally, all ${
      pageType === 'introPage' ? 'intro' : 'summary'
    } pages must use \`depends\` to make them mutually exclusive.`,
  );
}

function throwDuplicatePath(path) {
  throw new Error(
    `arrayBuilderPages: Duplicate path found. Each page must have a unique path. Duplicate path: ${path}`,
  );
}

function throwIntroPageMustBeFirst() {
  throw new Error(
    "arrayBuilderPages `pageBuilder.introPage` must be defined first, before other arrayBuilder pages. Intro page should be used for 'required' flow, and should contain only text",
  );
}

function throwSummaryPageMustComeBeforeItemPages() {
  throw new Error(
    'arrayBuilderPages `pageBuilder.summaryPage` must come before item pages',
  );
}

function validateMultiplePages(totalCount, totalCountDepends, pageType) {
  if (totalCount > 1 && totalCountDepends !== totalCount) {
    throwMultiplePagesRequireDepends(pageType);
  }
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

export function validateIntroPageDependsCount(
  introCount,
  introPagesWithDepends,
  required,
  arrayPath,
) {
  if (!environment.isProduction() && typeof required === 'function') {
    const allIntroPagesHaveDepends = introCount === introPagesWithDepends;
    if (!allIntroPagesHaveDepends) {
      throw new Error(
        `arrayBuilderPages: When \`arrayBuilderOptions\` \`required\` is a function for arrayPath "${arrayPath}", all \`pageBuilder.introPage\` pages must include a \`depends\` function to conditionally display the intro page.`,
      );
    }
  }
}

export function validatePages(orderedPageTypes, required, arrayPath) {
  const pageTypes = {
    summaryCount: 0,
    summaryPagesWithDepends: 0,
    introCount: 0,
    introPagesWithDepends: 0,
  };
  const pathSet = new Set();

  for (const pageTypeObj of orderedPageTypes) {
    const { type: pageType, hasDepends, path } = pageTypeObj;

    if (path) {
      if (pathSet.has(path)) {
        throwDuplicatePath(path);
      }
      pathSet.add(path);
    }

    if (pageType === 'intro') {
      pageTypes.introCount += 1;

      if (hasDepends) {
        pageTypes.introPagesWithDepends += 1;
      } else if (pageTypes.item || pageTypes.summaryCount) {
        throwIntroPageMustBeFirst();
      }
    } else if (pageType === 'summary') {
      pageTypes.summaryCount += 1;

      if (hasDepends) {
        pageTypes.summaryPagesWithDepends += 1;
      }

      if (pageTypes.item) {
        throwSummaryPageMustComeBeforeItemPages();
      }
    } else if (pageType === 'item') {
      pageTypes.item = true;
    }
  }

  validateMultiplePages(
    pageTypes.introCount,
    pageTypes.introPagesWithDepends,
    'introPage',
  );

  validateMultiplePages(
    pageTypes.summaryCount,
    pageTypes.summaryPagesWithDepends,
    'summaryPage',
  );

  if (pageTypes.summaryCount < 1) {
    throw new Error(
      'arrayBuilderPages must include a summary page with `pageBuilder.summaryPage`',
    );
  }

  if (!pageTypes.item) {
    throw new Error(
      'arrayBuilderPages must include at least one item page with `pageBuilder.itemPage`',
    );
  }

  validateIntroPageDependsCount(
    pageTypes.introCount,
    pageTypes.introPagesWithDepends,
    required,
    arrayPath,
  );
}

export function validateRequired(required) {
  if (required == null || typeof required === 'string') {
    throwValidateRequired();
  }
}

export function validateRequiredFlowHasIntroPage(
  required,
  introPages,
  arrayPath,
) {
  if (environment.isProduction()) {
    return;
  }

  const isRequiredFunction = typeof required === 'function';
  const isRequired = isRequiredFunction ? true : required;

  if (isRequired && introPages.length === 0) {
    const message = isRequiredFunction
      ? `arrayBuilderPages: When \`arrayBuilderOptions\` \`required\` is a function for arrayPath "${arrayPath}", you must include at least one \`pageBuilder.introPage\` with a \`depends\` function.`
      : `arrayBuilderPages: When \`arrayBuilderOptions\` \`required\` is true for arrayPath "${arrayPath}", you must include a \`pageBuilder.introPage\`. See ArrayBuilder README.md for more information.';`;
    throw new Error(message);
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
    return (item, index, fullData) => {
      try {
        return getItemFn(item, index, fullData);
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
 * @param {(pageBuilder: ArrayBuilderPages, helpers?: ArrayBuilderHelpers) => FormConfigPages} pageBuilderCallback
 * @returns {FormConfigPages}
 */
export function arrayBuilderPages(options, pageBuilderCallback) {
  let hasItemsKey;
  const itemPages = [];
  const introPages = [];
  const summaryPages = [];
  const orderedPageTypes = [];
  const missingInformationKey = `view:${options?.arrayPath}MissingInformation`;

  const getIntroPath = formData => {
    return getDependsPath(introPages, formData);
  };

  const getSummaryPath = formData => {
    return getDependsPath(summaryPages, formData);
  };

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
    minItems = null, // default to null to avoid enforcing a minimum length on optional arrays
    maxItems = 100,
    hideMaxItemsAlert = false,
    text: userText = {},
    reviewPath = 'review-and-submit',
    required: userRequired,
    useLinkInsteadOfYesNo = false,
    useButtonInsteadOfYesNo = false,
    canEditItem,
    canDeleteItem,
    canAddItem,
    duplicateChecks = {},
  } = options;
  const hasMaxItemsFn = typeof maxItems === 'function';

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
      introPages.push({ ...pageConfig, hasDepends: !!pageConfig.depends });
      validatePath(pageConfig?.path);
      orderedPageTypes.push({
        type: 'intro',
        hasDepends: !!pageConfig.depends,
        path: pageConfig.path,
      });
      return pageConfig;
    },
    summaryPage: pageConfig => {
      summaryPages.push({ ...pageConfig, hasDepends: !!pageConfig.depends });
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
      validatePath(pageConfig?.path);
      orderedPageTypes.push({
        type: 'summary',
        hasDepends: !!pageConfig.depends,
        path: pageConfig.path,
      });
      return pageConfig;
    },
    itemPage: pageConfig => {
      if (!pageConfig?.path?.includes('/:index')) {
        throwIncorrectItemPath();
      }
      validatePath(pageConfig?.path);
      itemPages.push({ ...pageConfig, duplicateChecks });
      orderedPageTypes.push({
        type: 'item',
        hasDepends: !!pageConfig.depends,
        path: pageConfig.path,
      });
      return pageConfig;
    },
  };

  // Verify and setup any initial page options
  pageBuilderCallback(pageBuilderVerifyAndSetup);
  validatePages(orderedPageTypes, userRequired, arrayPath);
  validateRequired(userRequired);
  validateRequiredFlowHasIntroPage(userRequired, introPages, arrayPath);
  validateReviewPath(reviewPath);
  validateMinItems(options.minItems);
  const required =
    typeof userRequired === 'function' ? userRequired : () => userRequired;

  const getActiveItemPages = (formData, index, context = null) => {
    const activePages = itemPages.filter(page => {
      try {
        if (page.depends) {
          return safeDependsItem(page.depends)(formData, index, context);
        }
        return true;
      } catch (e) {
        return false;
      }
    });

    if (activePages.length === 0 && !environment.isProduction()) {
      const contextInfo = context
        ? ` Context: ${JSON.stringify(context)}.`
        : '';
      throw new Error(
        `Array Builder Error: All item pages were filtered out for arrayPath "${arrayPath}" at index ${index}.${contextInfo} ` +
          `This means all of your itemPage depends functions returned false for this item. ` +
          `At least one itemPage must be available for every item in the array. ` +
          `Check your depends conditions to ensure at least one itemPage depends always returns true, ` +
          `or remove the depends condition from at least one itemPage to make it always available.`,
      );
    }

    return activePages;
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
  const navForwardFinishedItem = ({
    formData,
    goPath,
    urlParams,
    pathname,
    index,
  }) => {
    const summaryPath = getSummaryPath(formData);
    let path = summaryPath;
    if (urlParams?.edit || (urlParams?.add && urlParams?.review)) {
      const foundIndex = getArrayIndexFromPathName(pathname);
      const basePath = urlParams?.review ? reviewPath : summaryPath;
      path = createArrayBuilderUpdatedPath({
        basePath,
        index: foundIndex == null ? index : foundIndex,
        arrayPath,
      });
    }
    goPath(path);
  };

  const navForwardSummaryAddItem = ({ formData, goPath, urlParams }) => {
    const nextIndex = formData[arrayPath]?.length || 0;

    const path = createArrayBuilderItemAddPath({
      path: getFirstItemPagePath(
        formData,
        nextIndex,
        arrayBuilderContextObject({
          add: true,
          review: urlParams?.review,
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
    getIntroPath,
    getSummaryPath,
    reviewRoute: reviewPath,
  });

  /** @type {FormConfigPage['onNavForward']} */
  const navForwardSummary = ({ formData, goPath, pageList, urlParams }) => {
    if (formData?.[hasItemsKey]) {
      navForwardSummaryAddItem({ formData, goPath, urlParams });
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
            review: urlParams?.review,
          }),
        ),
        index: 0,
        isReview: urlParams?.review,
      });
      goPath(path);
    } else {
      path = getSummaryPath(formData);
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
      getIntroPath,
      getSummaryPath,
      isItemIncomplete,
      maxItems,
      missingInformationKey,
      hideMaxItemsAlert,
      nounPlural,
      nounSingular,
      required,
      useLinkInsteadOfYesNo,
      useButtonInsteadOfYesNo,
      canEditItem,
      canDeleteItem,
      canAddItem,
      isReviewPage: false,
      duplicateChecks,
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
            renderingCustomPageReview
          />
        )
      : ArrayBuilderSummaryPage(summaryReviewPageProps);

    const page = {
      scrollAndFocusTarget:
        pageConfig.scrollAndFocusTarget ||
        defaultSummaryPageScrollAndFocusTarget,
      onNavForward: navForwardSummary,
      onNavBack: onNavBackKeepUrlParams,
      isArrayBuilderSummary: true,
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
      getIntroPath,
      getSummaryPath,
      reviewRoute: reviewPath,
      required,
      getText,
      duplicateChecks,
      currentPath: pageConfig.path,
    };

    // when options.maxItems is a function, compute numeric maxItems value
    const computeMaxItems = hasMaxItemsFn
      ? formData => {
          const evaluatedMax = maxItemsFn(maxItems, formData);
          return {
            properties: {
              [arrayPath]: {
                ...(Number.isFinite(evaluatedMax)
                  ? { maxItems: evaluatedMax }
                  : {}),
              },
            },
          };
        }
      : null;

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
          ...(computeMaxItems && {
            'ui:options': { updateSchema: computeMaxItems },
          }),
          items: pageConfig.uiSchema,
        },
      },
      schema: {
        type: 'object',
        properties: {
          [arrayPath]: {
            type: 'array',
            minItems,
            ...(hasMaxItemsFn ? {} : { maxItems }), // static only when numeric, else computed at runtime
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
