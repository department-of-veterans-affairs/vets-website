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

export function createPageListByChapterAskVa(formConfig, pagesToMoveConfig) {
  const pagesByChapter = {};
  const modifiedFormConfig = {
    chapters: {},
  };

  // Process each chapter in pagesToMoveConfig
  Object.keys(pagesToMoveConfig).forEach(targetChapter => {
    if (!pagesByChapter[targetChapter]) {
      pagesByChapter[targetChapter] = [];
      modifiedFormConfig.chapters[targetChapter] = {
        pages: {},
        expandedPages: [],
      };
    }

    pagesToMoveConfig[targetChapter].forEach(pageKey => {
      Object.keys(formConfig.chapters).forEach(chapterKey => {
        const chapter = formConfig.chapters[chapterKey];
        if (chapter.pages && chapter.pages[pageKey]) {
          const page = {
            ...chapter.pages[pageKey],
            pageKey,
            chapterKey: targetChapter,
          };

          pagesByChapter[targetChapter].push(page);
          modifiedFormConfig.chapters[targetChapter].pages[pageKey] = page;
          modifiedFormConfig.chapters[targetChapter].expandedPages.push(page);
        }
      });
    });
  });

  // Extra check for dupes
  Object.keys(pagesByChapter).forEach(chapter => {
    pagesByChapter[chapter] = Array.from(
      new Map(
        pagesByChapter[chapter].map(page => [page.pageKey, page]),
      ).values(),
    );

    modifiedFormConfig.chapters[chapter].pages = Array.from(
      new Map(
        Object.entries(modifiedFormConfig.chapters[chapter].pages),
      ).values(),
    ).reduce((acc, page) => {
      acc[page.pageKey] = page;
      return acc;
    }, {});

    modifiedFormConfig.chapters[chapter].expandedPages = Array.from(
      new Map(
        modifiedFormConfig.chapters[chapter].expandedPages.map(page => [
          page.pageKey,
          page,
        ]),
      ).values(),
    );
  });

  return { pagesByChapter, modifiedFormConfig };
}

export function getChapterFormConfigAskVa(modifiedFormConfig, chapterName) {
  const chapterFormConfig = modifiedFormConfig.chapters[chapterName];
  if (!chapterFormConfig) {
    throw new Error(`Chapter "${chapterName}" does not exist in formConfig.`);
  }

  return chapterFormConfig;
}
