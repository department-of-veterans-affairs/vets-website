import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { getScrollOptions, scrollTo } from 'platform/utilities/scroll';

export const pageFocusScroll = () => {
  const focusSelector =
    'va-segmented-progress-bar[uswds][heading-text][header-level="2"]';
  const scrollToName = 'v3SegmentedProgressBar';
  return () => {
    waitForRenderThenFocus(focusSelector);
    setTimeout(() => {
      scrollTo(scrollToName, getScrollOptions({ offset: 0 }));
    }, 100);
  };
};
