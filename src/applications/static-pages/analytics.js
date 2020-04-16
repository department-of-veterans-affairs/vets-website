import recordEvent from 'platform/monitoring/record-event';

function isAnchor(node) {
  return node?.nodeName === 'A';
}

function addQaSectionListeners() {
  const selectors = {
    template: '[data-template="paragraphs/q_a_section"]',
    faq: '[data-template="paragraphs/q_a"]',
  };

  const faqs = document.querySelectorAll(selectors.faq);

  // Cycle through each FAQ, binding the FAQ data to each anchor
  // tag generated from the WYSIWYG content.
  [...faqs].forEach(faq => {
    const anchors = faq.querySelectorAll('a');

    [...anchors].forEach(anchor => {
      anchor.dataset.faqSection = faq.dataset.analyticsFaqSection; // eslint-disable-line no-param-reassign
      anchor.dataset.faqText = faq.dataset.analyticsFaqText; // eslint-disable-line no-param-reassign
    });
  });

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

function addTeaserListeners() {
  const selectors = {
    template: '[data-template="paragraphs/list_of_link_teasers"]',
  };
}

function addJumplinkListeners() {
  const selectors = {
    heading: '[data-template="paragraphs/wysiwyg"] #on-this-page',
  };

  const jumplinkHeading = document.querySelector(selectors.heading);
  const container = jumplinkHeading.parentElement;

  container.addEventListener('click', event => {
    if (!isAnchor(event.target)) {
      return;
    }

    const analytic = {
      event: 'nav-jumplink-click',
    };

    recordEvent(analytic);
  });
}

const coronavirusFaqUrl = '/coronavirus-veteran-frequently-asked-questions/';
const isCoronavirusFaq = document.location.pathname === coronavirusFaqUrl;

if (isCoronavirusFaq) {
  addJumplinkListeners();
  addQaSectionListeners();
}
