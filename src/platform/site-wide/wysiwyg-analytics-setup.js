/**
 * Attaches onclick events to accordions links for GA tag tracking
 */
export function addClickEvent() {
  const links = Array.from(
    document.querySelectorAll('div.service-accordion-output a'),
  );
  for (const link of links)
    link.setAttribute(
      'onclick',
      "recordEvent({ event: 'nav-accordion-embedded-link-click' })",
    );
}

document.addEventListener('DOMContentLoaded', addClickEvent);
