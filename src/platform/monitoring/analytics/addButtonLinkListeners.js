import recordEvent from 'platform/monitoring/record-event';

function getButtonType(className) {
  if (className.indexOf('usa-button-primary') > -1) {
    return 'primary';
  } else if (className.indexOf('usa-button-secondary') > -1) {
    return 'secondary';
  } else if (className.indexOf('usa-button') > -1) {
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
        'button-type': getButtonType(event.target.className),
        'button-click-label': event.target.text,
        'button-background-color': style.getPropertyValue('background-color'),
      });
    });
  });
}
