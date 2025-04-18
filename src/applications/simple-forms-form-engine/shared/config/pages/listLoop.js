import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { camelCase, kebabCase } from 'lodash';
import { employmentHistory } from '.';
import { componentKey } from './customStepPage';

/** @type {Record<string, ListLoopVariation>} */
const variations = {
  listLoopEmploymentHistory: {
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
 * @returns {Partial<NormalizedChapter>}
 */
const hydrateVariations = chapter => {
  const attrs = ['maxItems', 'nounPlural', 'nounSingular', 'optional'];
  const variation = findVariation(chapter);

  return attrs.reduce((acc, attr) => {
    acc[attr] = chapter[attr] || (variation && variation[attr]);
    return acc;
  }, {});
};

/**
 *
 * @param {NormalizedChapter} chapter
 * @returns {Array<string>}
 */
const hydrateComponentLists = chapter => {
  if (chapter.type !== 'digital_form_list_loop') {
    return findVariation(chapter).requiredFields;
  }

  const requiredComponents = [];

  chapter.pages.forEach(page =>
    page.components.forEach(component => {
      if (component.required) {
        requiredComponents.push(componentKey(component));
      }
    }),
  );

  return requiredComponents;
};

/**
 * @param {NormalizedChapter} chapter
 * @param {Function} arrayBuilder
 * @returns {FormConfigPages}
 */
export const listLoopPages = (chapter, arrayBuilder = arrayBuilderPages) => {
  const { maxItems, nounPlural, nounSingular, optional } = hydrateVariations(
    chapter,
  );

  /** @type {Array<string>} */
  const requiredProps = hydrateComponentLists(chapter);

  /** @type {ArrayBuilderOptions} */
  const options = {
    arrayPath: kebabCase(nounPlural),
    nounSingular,
    nounPlural,
    required: !optional,
    isItemIncomplete: item => requiredProps.some(prop => !item[prop]),
    maxItems,
    text: {
      getItemName: item => item.name,
      cardDescription: item =>
        `${formatReviewDate(item?.dateRange?.from)} - ${formatReviewDate(
          item?.dateRange?.to,
        )}`,
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
