import recordEvent from 'platform/monitoring/record-event';

export default function subscribeAccordionEvents() {
  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/accordion/button-clicked',
    e => {
      recordEvent({
        event: `nav-accordion-${e.detail.toggle}`,
      });
    },
  );
}
