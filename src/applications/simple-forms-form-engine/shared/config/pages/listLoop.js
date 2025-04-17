import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { camelCase, kebabCase } from 'lodash';
import { employmentHistory } from '.';

/** @type {Record<string, ArrayBuilderOptions>} */
const variations = {
  listLoopEmploymentHistory: {
    maxItems: 4,
    nounPlural: 'employers',
    nounSingular: 'employer',
    optional: true,
  },
};

/**
 * @param {NormalizedChapter} chapter
 * @returns {Partial<NormalizedChapter>}
 */
const hydrateVariations = chapter => {
  const attrs = ['maxItems', 'nounPlural', 'nounSingular', 'optional'];
  const variation = variations[camelCase(chapter.type)];

  return attrs.reduce((acc, attr) => {
    acc[attr] = chapter[attr] || (variation && variation[attr]);
    return acc;
  }, {});
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
  const requiredProps = ['name', 'address', 'dateRange'];

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
