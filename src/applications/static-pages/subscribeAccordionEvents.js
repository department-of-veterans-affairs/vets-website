import recordEvent from 'platform/monitoring/record-event';

export default function subscribeAccordionEvents() {
  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/accordion/button-clicked',
    e => {
      recordEvent({
        event:
          e.detail.toggle === 'expand'
            ? 'nav-accordion-expand'
            : 'nav-accordion-collapse',
      });
    },
  );
}
