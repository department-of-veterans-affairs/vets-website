export const setupPages = formConfig => {
  const chapterKeys = Object.keys(formConfig?.chapters || {});
  const chapterTitles = Object.values(formConfig?.chapters || {}).map(
    value => value.title,
  );

  const getChapterPagesFromChapterIndex = chapterIndex => {
    const chapterKey = chapterKeys[chapterIndex];
    const chapter = formConfig.chapters[chapterKey];

    return Object.keys(chapter.pages || {}).map((page, index) => {
      const pg = Array.isArray(chapter.pages[page])
        ? chapter.pages[page][0]
        : chapter.pages[page];

      const { title, path, review, editModeOnReviewPage } = pg;

      return {
        chapterIndex,
        pageIndex: index,
        title,
        review,
        path: `/${path}`,
        editModeOnReviewPage,
        key: page,
        chapterTitle: chapter.title,
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

export const getPageKeysForReview = config => {
  const pages = Object.entries(config.chapters);
  const titles = pages.map(item => Object.keys(item[1].pages));
  return titles.flat();
};
