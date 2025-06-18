import { scrollTo } from 'platform/utilities/scroll';
import {
  focusByOrder,
  waitForRenderThenFocus,
} from 'platform/utilities/ui/focus';

export const pageFocusScroll = () => {
  return () => {
    scrollTo('topScrollElement');
    setTimeout(() => {
      focusByOrder(['va-segmented-progress-bar', 'h2']);
    }, 100);
  };
};

export const pageFocusScrollNoProgressBar = () => {
  return () => {
    scrollTo('topScrollElement');
    setTimeout(() => {
      const radio = document.querySelector('va-radio[label-header-level]');
      waitForRenderThenFocus('h2', radio.shadowRoot);
    }, 100);
  };
};
