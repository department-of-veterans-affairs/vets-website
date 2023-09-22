import { scrollTo, waitForRenderThenFocus } from 'platform/utilities/ui';

export const focusAlertH3 = () => {
  scrollTo('h3');
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  waitForRenderThenFocus('h3');
};
