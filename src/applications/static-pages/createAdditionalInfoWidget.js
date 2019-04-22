import { uniqueId } from 'lodash';
import { qS, qSA, removeChildNodes } from './helpers';
import { recordEventOnce } from 'platform/monitoring/record-event';

export default function createAdditionalInfoWidget() {
  const widgets = qSA(document, '.additional-info-container');

  if (widgets.length) {
    widgets.forEach(el => {
      const titleNode = qS(el, '.additional-info-title');
      const titleText =
        (titleNode && titleNode.textContent) || 'More information';
      const contentContainer = qS(el, '.additional-info-content').parentNode;
      const contentMarkup = qS(el, '.additional-info-content').innerHTML;
      const additionalInfoId = uniqueId('additional-info-');
      const eventName =
        contentContainer.dataset && contentContainer.dataset.analytics;

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

      button.addEventListener('click', () => {
        const ariaExpanded = JSON.parse(button.getAttribute('aria-expanded'));

        button.setAttribute('aria-expanded', `${!ariaExpanded}`);
        button.parentNode.classList.toggle('form-expanding-group-open');
        chevron.classList.toggle('open');

        if (eventName) {
          const key = 'additional-info-expander-label';
          const analytic = {
            event: eventName,
            [key]: `Additional Info - ${titleText}`,
          };

          recordEventOnce(analytic, key);
        }
      });
    });
  }
}
