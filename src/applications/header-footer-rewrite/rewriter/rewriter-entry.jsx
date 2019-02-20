import 'platform/polyfills';
import createCommonStore from 'platform/startup/store';

import headerPartial from '../partials/header';
import footerPartial from '../partials/footer';

import startUserNavWidget from 'platform/site-wide/user-nav';
import addMenuListeners from 'platform/site-wide/accessible-menus';
import startMegaMenuWidget from 'platform/site-wide/mega-menu';
import startMobileMenuButton from 'platform/site-wide/mobile-menu-button';

import startFeedbackWidget from 'platform/site-wide/feedback';
import startVAFooter, { footerElemementId } from 'platform/site-wide/va-footer';
import addFocusBehaviorToCrisisLineModal from 'platform/site-wide/accessible-VCL-modal';
import { addOverlayTriggers } from 'platform/site-wide/legacy/menu';

function activateHeaderFooter() {
  // Set up elements for the new header and footer
  const headerContainer = document.createElement('div');
  headerContainer.innerHTML = headerPartial;
  headerContainer.classList.add('consolidated');

  const footerContainer = document.createElement('div');
  footerContainer.innerHTML = footerPartial;
  footerContainer.classList.add('consolidated');

  // observer.disconnect();
  document.body.insertBefore(headerContainer, document.body.firstChild);
  document.body.appendChild(footerContainer);
}

function renderFooter() {
  const subFooter = document.querySelectorAll('#sub-footer .small-print');
  const lastUpdated = subFooter && subFooter.item(0).textContent;

  startVAFooter(() => {
    addOverlayTriggers();
    addFocusBehaviorToCrisisLineModal();

    if (lastUpdated) {
      const lastUpdatedPanel = document.createElement('div');
      const lastUpdatedDate = lastUpdated.replace('Last updated ', '');

      lastUpdatedPanel.innerHTML = `
        <div class="footer-lastupdated">
          <div class="usa-grid">
            <div class="col-md-3"></div>
            <div class="col-md-9">
              Last updated: ${lastUpdatedDate}
            </div>
          </div>
        </div>
      `;

      const footer = document.getElementById(footerElemementId);

      footer.parentElement.insertBefore(lastUpdatedPanel, footer);
    }
  });
}

function mountReactComponents(commonStore) {
  const crisisModal = document.getElementById('modal-crisisline');
  if (crisisModal) {
    crisisModal.parentNode.removeChild(crisisModal);
  }
  if (document.querySelector('#vetnav-menu') !== null) {
    addMenuListeners(document.querySelector('#vetnav-menu'), true);
  }

  // New navigation menu
  if (document.querySelector('#vetnav')) {
    require('platform/site-wide/legacy/mega-menu.js');
  }

  // set up sizes for rem
  document.documentElement.style.fontSize = '10px';
  document.getElementsByTagName('body')[0].style.fontSize = '12px';

  startUserNavWidget(commonStore);
  startMegaMenuWidget(commonStore);
  startMobileMenuButton(commonStore);
  startFeedbackWidget(commonStore);
  renderFooter();
}

activateHeaderFooter();
mountReactComponents(createCommonStore());
