import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { formatReviewDate } from 'platform/forms-system/exportsFile';
import { employmentHistory } from '.';

/** @returns {FormConfigPages} */
export const listLoopPages = (
  { optional },
  arrayBuilder = arrayBuilderPages,
) => {
  /** @type {Array<string>} */
  const requiredProps = ['name', 'address', 'dateRange'];

  /** @type {ArrayBuilderOptions} */
  const options = {
    arrayPath: 'employers',
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
