const STATIC_FORM_PATHS = ['review-and-submit', 'confirmation'];

export const getFormPagePaths = formConfig => {
  const configPaths = Object.keys(formConfig.chapters)
    .map(chapter => {
      const currentChapterPages = formConfig.chapters[chapter].pages;
      return Object.keys(currentChapterPages).map(page => {
        return currentChapterPages[page].path;
      });
    })
    .flat();
  return [...configPaths, ...STATIC_FORM_PATHS];
};

export const getTopPosition = elem => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop);
};
