import recordEvent from 'platform/monitoring/record-event';

// This function assumes the accordion element is in a <section> tag
// which has a data-label attribute set.
export const getSectionLabel = node => {
  let currentNode = node;
  while (
    currentNode &&
    currentNode.tagName &&
    currentNode.nodeName.toUpperCase() !== 'SECTION'
  ) {
    currentNode = currentNode.parentNode;
  }
  return currentNode?.dataset?.label;
};

export default function subscribeAccordionEvents() {
  document.body.addEventListener(
    '@department-of-veterans-affairs/formation/accordion/button-clicked',
    e => {
      const data = {
        event: `int-accordion-${e.detail.toggle}`,
      };
      const sectionLabel = getSectionLabel(e.target);

      if (sectionLabel) {
        data['accordion-section-label'] = sectionLabel;
      }

      data['accordion-parent-label'] = e.target.dataset?.label;

      if (e.target.dataset?.childlabel) {
        data['accordion-child-label'] = e.target.dataset.childlabel;
      } else {
        data['accordion-child-label'] = undefined;
      }

      recordEvent(data);
    },
  );
}
