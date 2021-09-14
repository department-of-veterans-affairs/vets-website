import Scroll from 'react-scroll';

import { getScrollOptions } from 'platform/utilities/ui';

const scroller = Scroll.animateScroll;

export default function scrollToTop(
  position = 0,
  options = getScrollOptions(),
) {
  scroller.scrollTo(position, options);
}
