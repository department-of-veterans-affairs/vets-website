import getPages from './get-pages';
/**
 * Ensures each page has either a CustomReviewPage or populated schema if a
 * CustomPage exists.
 *
 * This is useful to throw
 */
const validateCustomPages = formConfig => {
  getPages(formConfig).forEach(({ chapterName, pageName, pageConfig }) => {
    const { CustomPage, CustomPageReview, schema } = pageConfig;
    if (
      CustomPage &&
      CustomPageReview === undefined &&
      !Object.keys(schema?.properties)?.length
    ) {
      throw new Error(
        `${pageName} in ${chapterName} contains a CustomPage, but is missing a CustomPageReview or schema properties. If you want this page to appear on the Review Page, please supply either a CustomPageReview React component or schema properties. If you do not want this page to appear on the Review Page, set formConfig.chapters.${chapterName}.pages.${pageName}.CustomPageReview to null.`,
      );
    }
  });
};

export default validateCustomPages;
