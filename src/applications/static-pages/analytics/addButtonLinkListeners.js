import recordEvent from 'platform/monitoring/record-event';

function getButtonType(classList) {
  if (classList.contains('usa-button-primary')) {
    return 'primary';
  } else if (classList.contains('usa-button-secondary')) {
    return 'secondary';
  } else if (classList.contains('usa-button')) {
    return 'default';
  }

  return 'unknown';
}

export default function addButtonLinkListeners() {
  const ignoreReactWidgets = ':not([data-template="paragraphs/react_widget"])';
  const defaultButtons = '.usa-button';
  const primaryButtons = '.usa-button-primary';
  const secondaryButtons = '.usa-button-secondary';
  const buttonLinks = [
    ...document.querySelectorAll(
      `${ignoreReactWidgets} ${defaultButtons}, ${ignoreReactWidgets} ${primaryButtons}, ${ignoreReactWidgets} ${secondaryButtons}`,
    ),
  ];

  buttonLinks.forEach(buttonLink => {
    buttonLink.addEventListener('click', event => {
      const style = window.getComputedStyle(event.target);

      recordEvent({
        event: 'cta-button-click',
        'button-type': getButtonType(event.target.classList),
        'button-click-label': event.target.text,
        'button-background-color': style.getPropertyValue('background-color'),
      });
    });
  });
}
