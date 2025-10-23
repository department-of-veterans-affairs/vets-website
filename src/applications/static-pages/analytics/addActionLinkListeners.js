import recordEvent from 'platform/monitoring/record-event';

export function getLinkType(classList) {
  if (classList.contains('vads-c-action-link--blue')) {
    return { type: 'secondary', iconColor: 'blue' };
  } else if (classList.contains('vads-c-action-link--green')) {
    return { type: 'primary', iconColor: 'green' };
  } else if (classList.contains('vads-c-action-link--white')) {
    return { type: 'reverse', iconColor: 'white' };
  }

  return { type: 'unknown', iconColor: 'unknown' };
}

export default function addActionLinkListeners() {
  const ignoreReactWidgets = ':not([data-template="paragraphs/react_widget"])';
  const actionLinks = [
    ...document.querySelectorAll(
      `${ignoreReactWidgets} a[class^="vads-c-action-link"]`,
    ),
  ];

  actionLinks.forEach(actionLink => {
    if (!actionLink.dataset.disableAnalaytics) {
      actionLink.addEventListener('click', event => {
        const { type, iconColor } = getLinkType(event.target.classList);
        recordEvent({
          event: 'cta-action-link-click',
          'action-link-type': type,
          'action-link-click-label': event.target.text.trim(),
          'action-link-icon-color': iconColor,
        });
      });
    }
  });
}
