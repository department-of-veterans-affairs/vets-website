import { showReviewField } from '../helpers';

export function getChapterTitle(
  chapterFormConfig,
  formData,
  formConfig,
  onReviewPage,
) {
  let chapterTitle = chapterFormConfig?.title;

  if (typeof chapterTitle === 'function') {
    chapterTitle = chapterTitle({
      formData,
      formConfig,
      onReviewPage,
    });
  }

  if (chapterFormConfig?.reviewTitle) {
    chapterTitle =
      typeof chapterFormConfig.reviewTitle === 'function'
        ? chapterFormConfig.reviewTitle({
            formData,
            formConfig,
            onReviewPage,
          })
        : chapterFormConfig.reviewTitle;
  }

  return chapterTitle || '';
}

export function getPageTitle(pageFormConfig, formData) {
  let pageTitle = pageFormConfig?.reviewTitle || pageFormConfig?.title || '';

  if (typeof pageTitle === 'function') {
    pageTitle = pageTitle({ formData });
  }

  return pageTitle || '';
}

export function hasVisibleReviewFields(
  pageSchema,
  pageUiSchema,
  formData,
  formContext,
) {
  if (!pageSchema?.properties) return false;
  return (
    Object.entries(pageSchema.properties).filter(([propName]) =>
      showReviewField(
        propName,
        pageSchema,
        pageUiSchema,
        formData,
        formContext,
      ),
    ).length > 0
  );
}
