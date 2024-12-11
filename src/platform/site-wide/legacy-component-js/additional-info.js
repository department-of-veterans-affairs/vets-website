const { name: PACKAGE_NAME } = require('../package.json');

const EVENT_NAMES = {
  EXPAND: `${PACKAGE_NAME}/additional-info/expand`,
  COLLAPSE: `${PACKAGE_NAME}/additional-info/collapse`,
};

function qSA(rootNode, selector) {
  return Array.from(rootNode.querySelectorAll(selector));
}

export function qS(rootNode, selector) {
  return rootNode.querySelector(selector);
}

function removeChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export default function createAdditionalInfoWidget() {
  const widgets = qSA(document, '.additional-info-container');

  if (widgets.length) {
    widgets.forEach((el, index) => {
      const titleNode = qS(el, '.additional-info-title');
      const titleText =
        (titleNode && titleNode.textContent) || 'More information';
      const contentMarkup = qS(el, '.additional-info-content').innerHTML;
      const additionalInfoId = `additional-info-${index}`;

      const template = `
          <button type="button" class="additional-info-button va-button-link" aria-controls="${additionalInfoId}" aria-expanded="false">
            <span class="additional-info-title">${titleText}
              <i class="fa fa-angle-down"></i>
            </span>
          </button>
          <span id="${additionalInfoId}">
            <div class="additional-info-content">
              ${contentMarkup}
            </div>
          </span>`;

      removeChildNodes(el);

      el.insertAdjacentHTML('afterbegin', template);

      const chevron = qS(el, 'i.fa-angle-down');
      const button = qS(el, 'button');

      const additionalInfoExpandEvent = document.createEvent('Event');
      additionalInfoExpandEvent.initEvent(EVENT_NAMES.EXPAND, true, true);

      const additionalInfoCollapseEvent = document.createEvent('Event');
      additionalInfoCollapseEvent.initEvent(EVENT_NAMES.COLLAPSE, true, true);

      button.addEventListener('click', () => {
        const ariaExpanded = JSON.parse(button.getAttribute('aria-expanded'));
        const isExpanded = !ariaExpanded;

        button.setAttribute('aria-expanded', `${isExpanded}`);
        button.parentNode.classList.toggle(
          'form-expanding-group-open',
          isExpanded,
        );
        chevron.classList.toggle('open', isExpanded);

        el.dispatchEvent(
          isExpanded ? additionalInfoExpandEvent : additionalInfoCollapseEvent,
        );
      });
    });
  }
}
