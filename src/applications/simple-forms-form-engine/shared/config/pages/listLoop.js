import React from 'react';
import { camelCase, kebabCase } from 'lodash';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import { employmentHistory } from '.';
import { buildComponents, componentKey } from './customStepPage';

/** @type {Record<string, ListLoopVariation>} */
const variations = {
  listLoopEmploymentHistory: {
    options: {
      arrayPath: 'employers',
      nounSingular: 'employer',
      nounPlural: 'employers',
      required: false,
      isItemIncomplete: item =>
        ['name', 'address', 'dateRange'].some(prop => !item[prop]),
      maxItems: 4,
      text: {
        getItemName: item => item.name,
        cardDescription: item =>
          `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
            item?.dateRange?.to,
          )}`,
      },
    },
    get pageBuilderCallback() {
      return pageBuilder => ({
        employerSummary: pageBuilder.summaryPage(
          employmentHistory.summaryPage(this.options),
        ),
        employerNamePage: pageBuilder.itemPage(
          employmentHistory.namePage(this.options),
        ),
        employerDatePage: pageBuilder.itemPage(employmentHistory.datePage),
        employerDetailPage: pageBuilder.itemPage(employmentHistory.detailPage),
      });
    },
  },
};

/**
 * @param {string} chapterType
 * @returns {?ListLoopVariation}
 */
const findVariation = chapterType => variations[camelCase(chapterType)];

/**
 * Traverses all List & Loop components once to get all components that are
 * required and/or used in summary cards.
 *
 * @param {NormalizedChapter} chapter
 * @returns {{
 *   requiredComponents: Array<string>,
 *   summaryComponents: {[key: string]: string},
 * }}
 */
const hydrateComponentLists = chapter => {
  /** @type {Array<string>} */
  const requiredComponents = [];
  /** @type {{[key:string]: string}} */
  const summaryComponents = {};

  chapter.pages?.forEach(page =>
    page.components.forEach(component => {
      const key = componentKey(component);

      if (component.required) {
        requiredComponents.push(key);
      }

      if (component.summaryCard) {
        summaryComponents[key] = component.type;
      }
    }),
  );

  return { requiredComponents, summaryComponents };
};

/**
 * @param {ArrayBuilderOptions} options
 * @param {NormalizedPage} page
 * @returns {PageSchema}
 */
const itemPageBuilder = (options, { bodyText, components, pageTitle }) => {
  const { schema, uiSchema } = buildComponents(components);

  return {
    path: `${kebabCase(options.nounPlural)}/:index/${kebabCase(pageTitle)}`,
    schema,
    title: pageTitle,
    uiSchema: {
      ...uiSchema,
      ...webComponentPatterns.arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          formData?.name ? `${pageTitle} for ${formData.name}` : pageTitle,
        bodyText,
      ),
    },
  };
};

/**
 * Yes, this function name is awful. You got a better one?
 * @param {ArrayBuilderOptions} options
 * @param {NormalizedChapter} chapter
 * @returns {(pageBuilder: ArrayBuilderPages, helpers?: ArrayBuilderHelpers) => FormConfigChapter}
 */
const pageBuilderCallbackBuilder = (options, chapter) => pageBuilder => {
  const { nounPlural, nounSingular, required } = options;

  /** @type {PageSchema} */
  const introPage = {
    path: options.nounPlural,
    title: chapter.chapterTitle,
    uiSchema: {
      ...webComponentPatterns.titleUI(
        chapter.chapterTitle,
        chapter.sectionIntro,
      ),
    },
    schema: {
      type: 'object',
      properties: {},
    },
  };

  /**
   * @type {string}
   */
  const summaryProperty = `view:${camelCase(`has ${nounPlural}`)}`;

  /** @type {PageSchema} */
  const summaryPage = {
    path: kebabCase(required ? `${nounPlural} summary` : nounPlural),
    schema: {
      type: 'object',
      properties: {},
      required: [summaryProperty],
    },
    title: required ? `Review your ${nounPlural}` : chapter.chapterTitle,
    uiSchema: {},
  };
  summaryPage.schema.properties[summaryProperty] =
    webComponentPatterns.arrayBuilderYesNoSchema;
  summaryPage.uiSchema[
    summaryProperty
  ] = webComponentPatterns.arrayBuilderYesNoUI(options, {}, {});

  /** @type {PageSchema} */
  const namePage = {
    title: chapter.itemNameLabel,
    path: `${kebabCase(nounPlural)}/:index/name`,
    uiSchema: {
      ...webComponentPatterns.arrayBuilderItemFirstPageTitleUI({
        title: chapter.itemNameLabel,
        nounSingular: options.nounSingular,
      }),
      name: webComponentPatterns.textUI('Name'),
    },
    schema: {
      type: 'object',
      properties: {
        name: webComponentPatterns.textSchema,
      },
      required: ['name'],
    },
  };

  // Build pages
  /** @type {FormConfigPages} */
  const pages = {};
  if (options.required) {
    pages[nounSingular] = pageBuilder.introPage(introPage);
  }
  pages[camelCase(`${nounSingular} summary`)] = pageBuilder.summaryPage(
    summaryPage,
  );
  pages[camelCase(`${nounSingular} name page`)] = pageBuilder.itemPage(
    namePage,
  );

  chapter.pages.forEach(page => {
    pages[`${nounSingular}${page.id}`] = pageBuilder.itemPage(
      itemPageBuilder(options, page),
    );
  });

  return pages;
};

/**
 * @param {NormalizedChapter} chapter
 * @param {Function} arrayBuilder
 * @returns {FormConfigPages}
 */
export const listLoopPages = (chapter, arrayBuilder = arrayBuilderPages) => {
  const variation = findVariation(chapter.type);
  const { maxItems, nounPlural, nounSingular, optional } = chapter;
  const { requiredComponents, summaryComponents } = hydrateComponentLists(
    chapter,
  );

  /** @type {ArrayBuilderOptions} */
  const options = variation?.options || {
    arrayPath: kebabCase(nounPlural),
    nounSingular,
    nounPlural,
    required: !optional,
    isItemIncomplete: item => requiredComponents.some(prop => !item[prop]),
    maxItems,
    text: {
      getItemName: item => item.name,
      cardDescription: item =>
        // item is null when cardDescription is first rendered
        item && (
          <ul>
            {Object.entries(summaryComponents).map(([key, type]) => (
              <li key={key}>
                {type === 'digital_form_date_component'
                  ? formatReviewDate(item[key])
                  : item[key]}
              </li>
            ))}
          </ul>
        ),
    },
  };

  /** @returns {FormConfigPages} */
  const pageBuilderCallback =
    variation?.pageBuilderCallback ||
    pageBuilderCallbackBuilder(options, chapter);

  return arrayBuilder(options, pageBuilderCallback);
};
