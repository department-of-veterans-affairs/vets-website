import scrollTo from 'platform/utilities/ui/scrollTo';
import { focusByOrder } from 'platform/utilities/ui';

export const pageFocusScroll = () => {
  return () => {
    scrollTo('topScrollElement');
    setTimeout(() => {
      focusByOrder(['va-segmented-progress-bar', 'h2']);
    }, 100);
  };
};
