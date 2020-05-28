import recordEvent from 'platform/monitoring/record-event';
import { isAnchor } from './utilities';

export default function addHomepageBannerListeners() {
  const container = document.querySelector('main');

  if (!container) return;

  container.addEventListener('click', event => {
    if (!isAnchor(event.target)) {
      return;
    }

    if (event.target.classList?.contains('usa-button')) {
      event.preventDefault();
      recordEvent({
        event: 'cta-default-button-click',
        buttonText: event.target.text
      });
    }
  });
}
