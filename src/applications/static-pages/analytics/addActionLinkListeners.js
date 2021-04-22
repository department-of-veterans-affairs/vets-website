import recordEvent from 'platform/monitoring/record-event';

export function getLinkType(classList) {
  if (classList.contains('vads-c-action-link--blue')) {
    return 'secondary';
  } else if (classList.contains('vads-c-action-link--green')) {
    return 'primary';
  } else if (classList.contains('vads-c-action-link--white')) {
    return 'reverse';
  }

  return 'unknown';
}

export default function addActionLinkListeners() {
  const ignoreReactWidgets = ':not([data-template="paragraphs/react_widget"])';
  const actionLinks = [
    ...document.querySelectorAll(
      `${ignoreReactWidgets} a[class=vads-c-action-link--blue]"]`,
    ),
  ];

  actionLinks.forEach(actionLink => {
    if (!actionLink.data.disableAnalaytics) {
      actionLink.addEventListener('click', event => {
        recordEvent({
          event: 'cta-action-link-click',
          'action-link-type': getLinkType(event.target.classList),
          'action-link-click-label': event.target.text,
        });
      });
    }
  });
}
