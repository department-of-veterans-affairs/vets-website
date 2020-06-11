import recordEvent from 'platform/monitoring/record-event';

export default function addButtonLinkListeners() {
  const ignoreReactWidgets = ':not([data-template="paragraphs/react_widget"])';
  const defaultButtons = 'a.usa-button';
  const ignorePrimaryButtons = ':not(.usa-button-primary)';
  const buttonLinks = [
    ...document.querySelectorAll(
      `${ignoreReactWidgets} ${defaultButtons}${ignorePrimaryButtons}`,
    ),
  ];

  buttonLinks.forEach(buttonLink => {
    buttonLink.addEventListener('click', event => {
      recordEvent({
        event: 'cta-default-button-click',
        buttonText: event.target.text,
      });
    });
  });
}
