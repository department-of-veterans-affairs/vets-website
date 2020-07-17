import recordEvent from 'platform/monitoring/record-event';
import { isAnchor } from './utilities';

const selectors = {
  template: '[data-template="paragraphs/q_a_section"]',
  faq: '[data-template="paragraphs/q_a"]',
};

function attachDataToAnchorTags() {
  const faqs = document.querySelectorAll(selectors.faq);

  // Cycle through each FAQ, binding the FAQ data to each anchor
  // tag generated from the WYSIWYG content.
  [...faqs].forEach(faq => {
    const anchors = faq.querySelectorAll('a');

    [...anchors].forEach(anchor => {
      const { dataset: anchorData } = anchor;
      anchorData.faqSection = faq.dataset.analyticsFaqSection;
      anchorData.faqText = faq.dataset.analyticsFaqText;
    });
  });
}

export default function addQaSectionListeners() {
  // Add some data into the dataset of each <a> tag.
  // We could directly attach event listeners to the
  // "selectors.faq" elements and easily access its dataset,
  // but there are sometimes a lot of instances, so that
  // would add up to a lot of listeners. So instead, we
  // attach the listener to the wrapper of the "selectors.faq" elements
  // and access the <a>'s dataset to get the context.

  attachDataToAnchorTags();

  const containers = document.querySelectorAll(selectors.template);

  [...containers].forEach(container => {
    container.addEventListener('click', event => {
      if (!isAnchor(event.target)) {
        return;
      }

      const analytic = {
        event: 'nav-covid-link-click',
        faqText: event.target.dataset.faqText,
        faqSection: event.target.dataset.faqSection,
      };

      recordEvent(analytic);
    });
  });
}
