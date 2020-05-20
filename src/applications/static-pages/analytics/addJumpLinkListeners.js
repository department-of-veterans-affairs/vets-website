import recordEvent from 'platform/monitoring/record-event';
import { isAnchor } from './utilities';

export default function addJumplinkListeners() {
  const selectors = {
    heading: '[data-template="paragraphs/wysiwyg"] #on-this-page',
  };

  const jumplinkHeading = document.querySelector(selectors.heading);
  const container = jumplinkHeading.parentElement;

  container.addEventListener('click', event => {
    if (!isAnchor(event.target)) {
      return;
    }

    const analytic = {
      event: 'nav-jumplink-click',
    };

    recordEvent(analytic);
  });
}
