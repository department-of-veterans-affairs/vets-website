import Scroll from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

const scroller = Scroll.scroller;

export default function scrollTo(elem, options = getScrollOptions()) {
  scroller.scrollTo(elem, options);
}
