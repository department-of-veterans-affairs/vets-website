import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { camelCase, kebabCase } from 'lodash';
import { employmentHistory } from '.';
import { componentKey } from './customStepPage';

/** @type {Record<string, ListLoopVariation>} */
const variations = {
  listLoopEmploymentHistory: {
    cardDescription: item =>
      `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
        item?.dateRange?.to,
      )}`,
    maxItems: 4,
    nounPlural: 'employers',
    nounSingular: 'employer',
    optional: true,
    requiredFields: ['name', 'address', 'dateRange'],
  },
};

/**
 * @param {NormalizedChapter} chapter
 * @returns {string}
 */
const findVariation = chapter => variations[camelCase(chapter.type)];

/**
 * @param {NormalizedChapter} chapter
 * @returns {Partial<ListLoopVariation>}
 */
const hydrateVariations = chapter => {
  const attrs = [
    'cardDescription',
    'maxItems',
    'nounPlural',
    'nounSingular',
    'optional',
  ];
  const variation = findVariation(chapter);

  return attrs.reduce((acc, attr) => {
    acc[attr] = chapter[attr] || (variation && variation[attr]);
    return acc;
  }, {});
};

/**
 *
 * @param {NormalizedChapter} chapter
 * @returns {{
 *   requiredComponents: Array<string>,
 *   summaryComponents?: {[key: string]: string},
 * }}
 */
const hydrateComponentLists = chapter => {
  if (chapter.type !== 'digital_form_list_loop') {
    return { requiredComponents: findVariation(chapter).requiredFields };
  }

  /** @type {Array<string>} */
  const requiredComponents = [];
  /** @type {{[key:string]: string}} */
  const summaryComponents = {};

  chapter.pages.forEach(page =>
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
  const {
    cardDescription,
    maxItems,
    nounPlural,
    nounSingular,
    optional,
  } = hydrateVariations(chapter);

  const { requiredComponents, summaryComponents } = hydrateComponentLists(
    chapter,
  );

  /** @type {ArrayBuilderOptions} */
  const options = {
    arrayPath: kebabCase(nounPlural),
    nounSingular,
    nounPlural,
    required: !optional,
    isItemIncomplete: item => requiredComponents.some(prop => !item[prop]),
    maxItems,
    text: {
      getItemName: item => item.name,
      cardDescription: item =>
        typeof cardDescription === 'function' ? (
          cardDescription(item)
        ) : (
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
