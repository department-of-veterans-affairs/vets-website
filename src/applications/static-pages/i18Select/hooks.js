export const onThisPageHook = (content, lang) => {
  if (lang && lang !== 'en') {
    const onThisPageEl = document?.getElementById('on-this-page');
    onThisPageEl.innerText = content[lang].onThisPage;
  }
};

export const setLangAttribute = lang => {
  const contentDiv = document?.getElementById('content');
  if (contentDiv) {
    contentDiv.setAttribute('lang', lang);
  }
};
