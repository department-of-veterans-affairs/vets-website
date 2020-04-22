import recordEvent from 'platform/monitoring/record-event';
import { isAnchor } from './utilities';

export default function addHomepageBannerListeners() {
  const selectors = {
    template: '[data-template="includes/homepage-banner"]',
  };

  const container = document.querySelector(selectors.template);

  if (!container) return;

  container.addEventListener('click', event => {
    if (!isAnchor(event.target)) {
      return;
    }

    recordEvent({
      event: 'nav-warning-alert-box-content-link-click',
      alertBoxHeading: container.dataset.alertBoxHeading,
    });
  });
}
