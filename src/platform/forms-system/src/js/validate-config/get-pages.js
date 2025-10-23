/**
 * A helper function to easily iterate over each page in a form config and
 * preserve the path for debugging output.
 *
 * @typedef {Object} PageSpec
 * @property {string} chapterName
 * @property {string} pageName
 * @property {Object} pageConfig
 * @property {Object} chapterConfig
 *
 * @param {object} formConfig - The formConfig
 * @return {PageSpec[]}
 */
const getPages = formConfig => {
  const pageConfigs = [];
  Object.keys(formConfig.chapters).forEach(chapterName => {
    Object.keys(formConfig.chapters[chapterName].pages).forEach(pageName => {
      pageConfigs.push({
        chapterName,
        pageName,
        pageConfig: formConfig.chapters[chapterName].pages[pageName],
        chapterConfig: formConfig.chapters[chapterName],
      });
    });
  });

  return pageConfigs;
};

export default getPages;
