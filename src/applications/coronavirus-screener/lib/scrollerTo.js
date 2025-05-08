import scrollTo from '@department-of-veterans-affairs/platform-utilities/scrollTo';
// disable smooth scrolling for a11y https://github.com/department-of-veterans-affairs/va.gov-team/issues/9601
export function scrollerTo(name) {
  scrollTo(name, {
    duration: 0,
    delay: 0,
    smooth: false,
  });
}
