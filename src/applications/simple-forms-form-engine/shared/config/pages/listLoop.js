import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { camelCase, kebabCase } from 'lodash';
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
      // Use a variation's card description if it exists, otherwise create an
      // unordered list of summary components.
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

  const {
    datePage,
    detailPage,
    introPage,
    namePage,
    summaryPage,
  } = employmentHistory;

  /** @returns {FormConfigPages} */
  const pageBuilderCallback = pageBuilder => {
    /** @type {FormConfigPages} */
    const pages = {};

    if (options.required) {
      pages.employer = pageBuilder.introPage(introPage(options));
    }

    return {
      ...pages,
      employerSummary: pageBuilder.summaryPage(summaryPage(options)),
      employerNamePage: pageBuilder.itemPage(namePage(options)),
      employerDatePage: pageBuilder.itemPage(datePage),
      employerDetailPage: pageBuilder.itemPage(detailPage),
    };
  };

  return arrayBuilder(options, pageBuilderCallback);
};
