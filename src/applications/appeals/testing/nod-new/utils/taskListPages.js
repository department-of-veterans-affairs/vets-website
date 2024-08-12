import formConfig from '../config/form';

export const setupPages = () => {
  const chapterKeys = Object.keys(formConfig?.chapters || {});
  const chapterTitles = Object.values(formConfig?.chapters || {}).map(
    value => value.title,
  );

  const getChapterPagesFromChapterIndex = chapterIndex => {
    const chapterKey = chapterKeys[chapterIndex];
    const chapter = formConfig.chapters[chapterKey];
    // ideally this would filter out visibility using the page depends function
    return Object.keys(chapter.pages || {}).map((page, index) => {
      const pg = Array.isArray(chapter.pages[page])
        ? chapter.pages[page][0]
        : chapter.pages[page];
      // eslint-disable-next-line no-unused-vars
      const { title, taskListTitle, taskListHide, path, depends, review } = pg;
      return {
        chapterIndex,
        pageIndex: index,
        taskListHide,
        title: taskListTitle || title,
        review,
        path: `/${path}`,
        depends,
      };
    });
  };

  const allPages = Object.keys(formConfig?.chapters || {}).reduce(
    (pages, chapter, index) => {
      const pagesInChapter = getChapterPagesFromChapterIndex(index);
      return pages.concat(pagesInChapter);
    },
    [],
  );

  const findPageFromPath = path =>
    allPages.find(page => {
      const pagePath = page.path.includes('/:index')
        ? page.path.replace('/:index', '/')
        : page.path;
      return path.includes(pagePath);
    }) || { chapterIndex: 0 };

  return {
    chapterKeys,
    chapterTitles,
    allPages,
    getChapterPagesFromChapterIndex,
    findPageFromPath,
  };
};
