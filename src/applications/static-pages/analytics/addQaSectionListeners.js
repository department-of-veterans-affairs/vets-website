import recordEvent from 'platform/monitoring/record-event';
import { isAnchor } from './utilities';

const qaSelectors = {
  template: '[data-template="paragraphs/q_a_section"]',
  qa: '[data-template="paragraphs/q_a"]',
  // "qaCollapsiblePanel" is the same content model as "qa" but rendered as a collapsible panel.
  qaCollapsiblePanel: '[data-template="paragraphs/q_a.collapsible_panel__qa"]',
};

// There is also a totally separate "collapsible panel" paragraph-type.
const collapsiblePanelSelectors = {
  template: '[data-template="paragraphs/collapsible_panel"]',
  panel: '[data-template="paragraphs/collapsible_panel__panel"]',
};

function attachDataToAnchorTags(qaSelector) {
  const questionAndAnswerBlocks = document.querySelectorAll(qaSelector);

  // Cycle through each FAQ, binding the FAQ data to each anchor
  // tag generated from the WYSIWYG content.
  [...questionAndAnswerBlocks].forEach(faq => {
    const anchors = faq.querySelectorAll('a');

    [...anchors].forEach(anchor => {
      const { dataset: anchorData } = anchor;
      if (faq.dataset.analyticsFaqSection) {
        anchorData.faqSection = faq.dataset.analyticsFaqSection;
      }
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

  attachDataToAnchorTags(qaSelectors.qa);
  attachDataToAnchorTags(qaSelectors.qaCollapsiblePanel);

  attachDataToAnchorTags(collapsiblePanelSelectors.panel);

  const containers = [
    ...document.querySelectorAll(qaSelectors.template),
    ...document.querySelectorAll(collapsiblePanelSelectors.template),
  ];

  containers.forEach(container => {
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
