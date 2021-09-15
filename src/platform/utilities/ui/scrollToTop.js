import Scroll from 'react-scroll';

const scroller = Scroll.animateScroll;

export default function scrollToTop(position = 0, duration = 500) {
  scroller.scrollTo(position, {
    duration,
    delay: 0,
    smooth: true,
  });
}
