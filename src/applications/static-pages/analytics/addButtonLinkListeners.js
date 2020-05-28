import recordEvent from 'platform/monitoring/record-event';

export default function addHomepageBannerListeners() {
  const buttonLinks = document.querySelectorAll('a.usa-button');

  buttonLinks.addEventListener('click', event => {
    event.preventDefault();
    recordEvent({
      event: 'cta-default-button-click',
      buttonText: event.target.text
    });
  });
}
