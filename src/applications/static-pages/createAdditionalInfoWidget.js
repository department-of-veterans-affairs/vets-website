import { qS, qSA, removeChildNodes } from './helpers';
import recordEvent from 'platform/monitoring/record-event';

export default function createAdditionalInfoWidget() {
  const widgets = qSA(document, '.additional-info-container');

  if (widgets.length) {
    widgets.forEach(el => {
      const titleNode = qS(el, '.additional-info-title');
      const titleText =
        (titleNode && titleNode.textContent) || 'More information';
      const contentContainer = qS(el, '.additional-info-content').parentNode;
      const contentMarkup = qS(el, '.additional-info-content').innerHTML;
      const expandedContentId = `${contentContainer.id}-expandable`;

      const template = `
          <button type="button" class="additional-info-button va-button-link" aria-controls="${expandedContentId}" aria-expanded="false">
            <span class="additional-info-title">${titleText}
              <i class="fa fa-angle-down"></i>
            </span>
          </button>
          <span id="${expandedContentId}">
            <div class="additional-info-content">
              ${contentMarkup}
            </div>
          </span>`;

      removeChildNodes(el);

      el.insertAdjacentHTML('afterbegin', template);

      const chevron = qS(el, 'i.fa-angle-down');
      const button = qS(el, 'button');
      const analyticsEvent = button.parentNode.getAttribute('data-event');

      button.addEventListener('click', () => {
        const ariaExpanded = JSON.parse(button.getAttribute('aria-expanded'));

        button.setAttribute('aria-expanded', `${!ariaExpanded}`);
        button.parentNode.classList.toggle('form-expanding-group-open');
        chevron.classList.toggle('open');

        if (analyticsEvent) {
          recordEvent({ event: analyticsEvent });
        }
      });
    });
  }
}
