/**
 * A helper function to easily iterate over each page in a form config and
 * preserve the path for debugging output.
 *
 * Returns an array of tuples containing the stringified path for debug logs the
 * page config, and the chapter config. E.g.
 * [
 *   ["chapterName.pageName", { path: "path-to-page", ... }, { title: 'Chapter Title' }]
 * ]
 *
 * @typedef {Object} PageSpec
 * @property {string} chapterName
 * @property {string} pageName
 * @property {Object} pageConfig
 * @property {Object} chapterConfig
 *
 * @param {object} formConfig - The formConfig
 * @return {PageSpec}
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
