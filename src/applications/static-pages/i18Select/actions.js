export const LANG_SELECTED = 'LANG_SELECTED';

export function langSelectedAction(lang) {
  return {
    type: LANG_SELECTED,
    lang,
  };
}
