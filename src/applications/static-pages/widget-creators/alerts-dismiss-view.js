/**
 * Attaches onclick and page load logic to alerts.
 */
export default function alertsBuildShow() {
  // This controls the text expanders.
  function expanderFire() {
    // Toggle aria-expanded for the button
    const ariaExpanded =
      this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false';
    this.setAttribute('aria-expanded', ariaExpanded);
    const content = this.parentNode.getElementsByClassName(
      'field--type-text-long',
    )[0];

    // Toggle the expander class for the content
    content.classList.toggle('expander-content-open');

    // Toggle aria-hidden for the content
    const ariaHidden =
      content.getAttribute('aria-hidden') === 'false' ? 'true' : 'false';
    content.setAttribute('aria-hidden', ariaHidden);
  }

  // Create our cookie and dismiss the alert.
  function cookieLogic() {
    const target = this.getAttribute('data-parentWrap');
    const frequency = this.getAttribute('data-frequency');
    const date = new Date();
    date.setTime(date.getTime() + 3650 * 24 * 60 * 60 * 1000);
    let expires = `expires=${date.toUTCString()}`;
    if (frequency === 'always') {
      expires = '';
    }
    document.getElementById(target).classList.add('dismissed');
    document.cookie = `${target}=dismissed;${expires};path=/`;
  }

  const alerts = document.querySelectorAll('.usa-alert-text');

  if (alerts.length) {
    Array.from(alerts)
      .filter(
        el => el.querySelector('.field--name-field-text-expander') !== null,
      )
      .forEach(el => {
        const clicker = el.querySelector('.field--name-field-text-expander');

        // Toggle the expander info
        clicker.addEventListener('click', expanderFire);
      });

    // Build our array of dismissed alerts.
    const dismissedAlerts = document.cookie
      .split(';')
      .filter(c => c.trim().indexOf('usa') === 0)
      .map(c => c.trim().replace(/=dismissed/g, ''));

    // Iterate through the alerts array, and dismiss.
    dismissedAlerts.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('dismissed');
      }
    });
  }

  const alertDismisses = document.querySelectorAll('.usa-alert-dismiss');

  if (alertDismisses) {
    // add click handler to each alert's dismiss button
    Array.from(alertDismisses).forEach(el => {
      el.addEventListener('click', cookieLogic);
    });

    // Show alerts that don't have dismissed class - doing this way
    // prevents flash on page load before styles / js are available.
    const wrapsShower = document.querySelectorAll('.dismissable-option-header');
    let l;
    // Iterate through the wraps, and show.
    for (l = 0; l < wrapsShower.length; l++) {
      if (!wrapsShower[l].classList.contains('dismissed')) {
        wrapsShower[l].classList.add('show-alert');
      }
    }
  }
}
