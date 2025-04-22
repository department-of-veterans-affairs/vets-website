import React from 'react';
import { camelCase, kebabCase } from 'lodash';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import * as webComponentPatterns from 'platform/forms-system/src/js/web-component-patterns';
import { employmentHistory } from '.';
import { componentKey } from './customStepPage';

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

const { datePage, detailPage, namePage, summaryPage } = employmentHistory;

/**
 * Yes, this function name is awful. You got a better one?
 * @param {ArrayBuilderOptions} options
 * @param {NormalizedChapter} chapter
 * @returns {(pageBuilder: ArrayBuilderPages, helpers?: ArrayBuilderHelpers) => FormConfigChapter}
 */
const pageBuilderCallbackBuilder = (options, chapter) => pageBuilder => {
  /** @type {FormConfigPages} */
  const pages = {};

  /** @returns {PageSchema} */
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

  if (options.required) {
    pages[options.nounSingular] = pageBuilder.introPage(introPage);
  }

  return {
    ...pages,
    employerSummary: pageBuilder.summaryPage(summaryPage(options)),
    employerNamePage: pageBuilder.itemPage(namePage(options)),
    employerDatePage: pageBuilder.itemPage(datePage),
    employerDetailPage: pageBuilder.itemPage(detailPage),
  };
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
      cardDescription: item => (
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
