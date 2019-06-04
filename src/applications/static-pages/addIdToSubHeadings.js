/*
 * Add unique ID to H2s and H3s that aren't in WYSIWYG or accordion buttons
 */

export function uniqueId() {
  return `id-${Math.random()
    .toString(36)
    .substr(2, 16)}`;
}

export function generateHeadingIds(headings) {
  headings.forEach(heading => {
    const parent = heading.parentNode;
    const isInWysiwyg = parent.classList.contains('processed-content');
    const isInAccordionButton = parent.classList.contains(
      'usa-accordion-button',
    );
    // skip heading if it already has an id and skip heading if it's in wysiwyg content
    if (!heading.id && !isInWysiwyg && !isInAccordionButton) {
      const headingID = uniqueId();
      heading.setAttribute('id', headingID);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const headings = Array.from(document.querySelectorAll('h2, h3'));
  if (headings.length > 0) {
    generateHeadingIds(headings);
  }
});
