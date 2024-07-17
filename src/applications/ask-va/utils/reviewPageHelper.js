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

export function createPageListByChapterAskVa(formConfig) {
  const mergedChapters = {};
  const modifiedFormConfig = {
    ...formConfig,
    chapters: { ...formConfig.chapters },
  };

  Object.keys(formConfig.chapters).forEach(chapter => {
    const pages = Object.keys(formConfig.chapters[chapter].pages).map(page => ({
      ...formConfig.chapters[chapter].pages[page],
      pageKey: page,
      chapterKey: chapter,
    }));

    if (chapter === 'yourQuestionPart1' || chapter === 'yourQuestionPart2') {
      if (!mergedChapters.yourQuestion) {
        mergedChapters.yourQuestion = [];
        modifiedFormConfig.chapters.yourQuestion = { pages: {} };
      }
      mergedChapters.yourQuestion.push(...pages);
      pages.forEach(page => {
        modifiedFormConfig.chapters.yourQuestion.pages[page.pageKey] = page;
      });
    } else {
      mergedChapters[chapter] = pages;
    }
  });

  return { pagesByChapter: mergedChapters, modifiedFormConfig };
}

export function getChapterFormConfigAskVa(modifiedFormConfig, chapterName) {
  // Check if the requested chapter is part of the merged chapters
  let chapterNameUpdate = chapterName;
  if (
    chapterName === 'yourQuestionPart1' ||
    chapterName === 'yourQuestionPart2'
  ) {
    chapterNameUpdate = 'yourQuestion';
  }

  // Get the chapter form configuration
  const chapterFormConfig = modifiedFormConfig.chapters[chapterNameUpdate];
  if (!chapterFormConfig) {
    throw new Error(
      `Chapter "${chapterNameUpdate}" does not exist in formConfig.`,
    );
  }

  return chapterFormConfig;
}
