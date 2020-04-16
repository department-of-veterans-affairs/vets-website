import recordEvent from 'platform/monitoring/record-event';

export default function addTeaserListeners() {
  const selectors = {
    template: '[data-template="paragraphs/linkTeaser"]',
  };

  const containers = document.querySelectorAll(selectors.template);

  [...containers].forEach(container => {
    container.addEventListener('click', event => {
      // We need to use "currentTarget" because we're
      // attaching the event listener to the whole container
      // instead of the <a> tags.
      const node = event.currentTarget;

      const analytic = {
        event: 'nav-linkslist',
        'links-list-header': node.dataset.linksListHeader,
        'links-list-section-header': node.dataset.linksListSectionHeader,
      };

      recordEvent(analytic);
    });
  });
}
