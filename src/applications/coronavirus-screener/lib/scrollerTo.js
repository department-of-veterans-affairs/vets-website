import { scroller } from 'react-scroll';

// disable smooth scrolling for a11y https://github.com/department-of-veterans-affairs/va.gov-team/issues/9601
export function scrollerTo(name) {
  scroller.scrollTo(name, {
    duration: 0,
    delay: 0,
    smooth: false,
  });
}
