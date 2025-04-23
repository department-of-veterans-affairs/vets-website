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
            <va-icon class="additional-arrow" icon="chevron_right" />
          </span>
        </button>
        <span id="${additionalInfoId}">
          <div class="additional-info-content">
            ${contentMarkup}
          </div>
        </span>`;

      removeChildNodes(el);

      el.insertAdjacentHTML('afterbegin', template);

      const chevron = qS(el, 'va-icon.additional-arrow');
      const button = qS(el, 'button');

      const additionalInfoExpandEvent = document.createEvent('Event');
      additionalInfoExpandEvent.initEvent(EVENT_NAMES.EXPAND, true, true);

      const additionalInfoCollapseEvent = document.createEvent('Event');
      additionalInfoCollapseEvent.initEvent(EVENT_NAMES.COLLAPSE, true, true);

      const iconShadowRoot = chevron.shadowRoot;

      // Use MutationObserver to watch for changes in the shadow DOM
      const observer = new MutationObserver(() => {
        const svgInside = iconShadowRoot?.querySelector('.usa-icon');

        if (svgInside) {
          svgInside.style =
            'transform: rotate(90deg); fill: #07648d; height: 1.5rem; width: 1.5rem; transition: transform 0.15s linear, -webkit-transform 0.15s linear;';

          observer.disconnect();
        }
      });

      if (iconShadowRoot) {
        observer.observe(iconShadowRoot, { childList: true, subtree: true });
      }

      button.addEventListener('click', () => {
        const ariaExpanded = JSON.parse(button.getAttribute('aria-expanded'));
        const isExpanded = !ariaExpanded;

        button.setAttribute('aria-expanded', `${isExpanded}`);
        button.parentNode.classList.toggle(
          'form-expanding-group-open',
          isExpanded,
        );

        chevron.classList.toggle('open', isExpanded);

        const svgInside = iconShadowRoot?.querySelector('.usa-icon');

        if (Array.from(chevron.classList).includes('open')) {
          svgInside.style.transform = 'rotate(270deg)';
        } else {
          svgInside.style.transform = 'rotate(90deg)';
        }

        el.dispatchEvent(
          isExpanded ? additionalInfoExpandEvent : additionalInfoCollapseEvent,
        );
      });
    });
  }
}
