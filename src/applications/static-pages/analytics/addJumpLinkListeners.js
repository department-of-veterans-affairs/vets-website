import recordEvent from 'platform/monitoring/record-event';
import { isAnchor } from './utilities';

export default function addJumplinkListeners() {
  const selectors = {
    template: '#table-of-contents',
  };

  const container = document.getElementById(selectors.template);

  if (!container) return;

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
