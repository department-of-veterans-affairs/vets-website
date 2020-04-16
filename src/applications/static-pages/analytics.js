import recordEvent from 'platform/monitoring/record-event';

const ANCHOR_ELEMENT = 'A';

const SELECTORS = {
  QA_SECTION: '[data-template="paragraphs/q_a_section"]',
  LIST_OF_LINK_TEASERS: '[data-template="paragraphs/list_of_link_teasers"]',
  NAV_JUMPLINK_CLICK: '[data-template="paragraphs/wysiwyg"] #on-this-page',
};

function addQaSectionListeners() {

}

function addTeaserListeners() {

}

function addJumplinkListeners() {
  const jumplinkHeading = document.querySelector(SELECTORS.NAV_JUMPLINK_CLICK);
  const container = jumplinkHeading.parentElement;

  container.addEventListener('click', event => {
    if (event.target.nodeName.toUpperCase() === ANCHOR_ELEMENT) {
      const analytic = {
        event: 'nav-jumplink-click',
      };
      recordEvent(analytic);
    }
  })
}

const coronavirusFaqUrl = '/coronavirus-veteran-frequently-asked-questions/';
const isCoronavirusFaq = document.location.pathname === coronavirusFaqUrl;

if (isCoronavirusFaq) {
  addJumplinkListeners();
}
