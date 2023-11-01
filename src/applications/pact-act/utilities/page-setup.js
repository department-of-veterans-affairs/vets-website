import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { customizeTitle } from './customize-title';

export const pageSetup = H1 => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  waitForRenderThenFocus('h1');
  document.title = customizeTitle(H1);
};
