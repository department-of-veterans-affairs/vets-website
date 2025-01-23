import scrollTo from 'platform/utilities/ui/scrollTo';
import { focusByOrder, waitForRenderThenFocus } from 'platform/utilities/ui';

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
