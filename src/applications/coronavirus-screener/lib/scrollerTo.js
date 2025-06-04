import { scrollTo } from 'platform/utilities/scroll';
// disable smooth scrolling for a11y https://github.com/department-of-veterans-affairs/va.gov-team/issues/9601
export function scrollerTo(name) {
  scrollTo(name, { behavior: 'instant' });
}
