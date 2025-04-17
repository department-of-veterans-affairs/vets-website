import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { camelCase, kebabCase } from 'lodash';
import { employmentHistory } from '.';

/** @type {Record<string, ArrayBuilderOptions>} */
const variations = {
  listLoopEmploymentHistory: {
    nounPlural: 'employers',
  },
};

const setVars = chapter => {
  const variation = variations[camelCase(chapter.type)];

  return {
    nounPlural: chapter.nounPlural || variation?.nounPlural,
    optional: chapter.optional,
  };
};

/**
 * @param {NormalizedChapter} chapter
 * @param {Function} arrayBuilder
 * @returns {FormConfigPages}
 */
export const listLoopPages = (chapter, arrayBuilder = arrayBuilderPages) => {
  const { nounPlural, optional } = setVars(chapter);

  /** @type {Array<string>} */
  const requiredProps = ['name', 'address', 'dateRange'];

  /** @type {ArrayBuilderOptions} */
  const options = {
    arrayPath: kebabCase(nounPlural),
    nounSingular: 'employer',
    nounPlural: 'employers',
    required: !optional,
    isItemIncomplete: item => requiredProps.some(prop => !item[prop]),
    maxItems: 4,
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

    if (!optional) {
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
