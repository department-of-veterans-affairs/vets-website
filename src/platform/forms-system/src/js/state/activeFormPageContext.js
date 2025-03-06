import environment from 'platform/utilities/environment';
import { convertUrlPathToPageConfigPath, getUrlPathIndex } from '../helpers';

/**
 * @typedef {Object} ActiveFormPageContextState
 * @property {string | null} arrayPath
 * @property {string | null} chapterKey
 * @property {string | null} pageKey
 * @property {string | null} pagePath
 * @property {number | null} index
 */

/**
 * ActiveFormPageContext is local state updated on ROUTE_CHANGE, containing
 * the current page's arrayPath, chapterKey, pageKey, pagePath, and index.
 *
 * Not stored in redux because
 * 1. Doesn't need to cause a rerender
 * 2. Is derived state
 */
class ActiveFormPageContext {
  /**
   * @type {ActiveFormPageContextState}
   */
  context;

  constructor() {
    this.reset();
  }

  update({ arrayPath, chapterKey, index, pageKey, pagePath }) {
    if (environment.isUnitTest()) {
      // This is not essential for most unit tests, so ignore because
      // it would be too easy to pollute the state from one test to another.
      // If you want to test this, you can use sinon to spy or stub
      // on activeFormPageContextInstance
      return;
    }
    this.context = {
      arrayPath,
      chapterKey,
      pageKey,
      pagePath,
      index,
    };
  }

  reset() {
    this.update({
      arrayPath: null,
      chapterKey: null,
      pageKey: null,
      pagePath: null,
      index: null,
    });
  }

  /**
   * @returns {ActiveFormPageContextState}
   */
  get() {
    return { ...this.context };
  }

  updateFromPages(formPagesObj, urlPath) {
    if (!formPagesObj || Object.keys(formPagesObj).length === 0) {
      this.reset();
      return;
    }

    const pagePath = convertUrlPathToPageConfigPath(urlPath);
    const [currentPageKey, currentPageConfig = {}] =
      Object.entries(formPagesObj).find(([_, pageConfig]) => {
        return pageConfig?.path === pagePath;
      }) || [];

    this.update({
      pageKey: currentPageKey,
      pagePath,
      chapterKey: currentPageConfig.chapterKey,
      arrayPath: currentPageConfig.arrayPath,
      index: currentPageConfig.arrayPath ? getUrlPathIndex(urlPath) : null,
    });
  }
}

// can stub or spy on this in tests
export const activeFormPageContextInstance = new ActiveFormPageContext();

/**
 *
 * @param {object} formPagesObj
 * @param {string} urlPath
 */
export const updateActiveFormPageContext = (formPagesObj, urlPath) => {
  activeFormPageContextInstance.updateFromPages(formPagesObj, urlPath);
};

export const resetActiveFormPageContext = () =>
  activeFormPageContextInstance.reset();

/**
 * @returns {ActiveFormPageContext}
 */
export const getActiveFormPageContext = () =>
  activeFormPageContextInstance.get();
