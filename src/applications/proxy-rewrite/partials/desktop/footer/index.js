import VeteransCrisisLineModal from '../../crisis-line-modal';
import {
  buildBottomRail,
  buildColumn,
  getFormattedFooterData,
} from '../../../utilities/footer';

export const getDesktopFooterHtml = footerData => {
  const columns = getFormattedFooterData(footerData);
  const bottomRail = columns.bottom_rail;

  return `
    <footer id="ts-desktop-footer" class="vads-u-margin-bottom--8 footer ts-footer-container" role="contentinfo">
      <div data-minimal-footer="false">
        <div>
          <div class="footer-inner">
            <div aria-hidden="false" class="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content">
              <div class="va-footer-linkgroup">
                <h2 class="va-footer-linkgroup-title">Veteran programs and services</h2>
                <ul class="va-footer-links">
                  ${buildColumn(columns, 1)}
                </ul>
              </div>
              <div class="va-footer-linkgroup" id="footer-services">
                <h2 class="va-footer-linkgroup-title">More VA resources</h2>
                <ul class="va-footer-links">
                  ${buildColumn(columns, 2)}
                </ul>
              </div>
              <div class="va-footer-linkgroup" id="footer-popular">
                <h2 class="va-footer-linkgroup-title">Get VA updates</h2>
                <ul class="va-footer-links">
                  ${buildColumn(columns, 3)}
                </ul>
              </div>
              <div class="va-footer-linkgroup" id="veteran-crisis">
                <h2 class="va-footer-linkgroup-title">In crisis? Talk to someone now</h2>
                <ul class="va-footer-links">
                  <li>
                  <button class="va-button-link va-overlay-trigger" data-show="#ts-modal-crisisline">Veterans Crisis Line</button>
                  </li>
                </ul>
                <h2 class="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">Get answers</h2>
                <ul class="va-footer-links">
                ${buildColumn(columns, 4)}
                </ul>
              </div>
            </div>
            <!-- Language section -->
            <div class="usa-grid usa-grid-full va-footer-links-bottom vads-u-border-color--white vads-u-border-bottom--1px vads-u-border-top--1px vads-u-padding-top--2 vads-u-padding-bottom--1p5 vads-u-padding-left--0">
              <h2 class="va-footer-linkgroup-title vads-u-padding-bottom--1">Language assistance</h2>
              <ul class="vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-padding-bottom--0">
                <li>
                  <a href="https://va.gov/asistencia-y-recursos-en-espanol" lang="es" hreflang="es">Español</a>
                </li>
                <li>
                  <a href="https://va.gov/tagalog-wika-mapagkukunan-at-tulong" lang="tl" hreflang="tl">Tagalog</a>
                </li>
                <li>
                  <a href="https://va.gov/resources/how-to-get-free-language-assistance-from-va/" lang="en" hreflang="en">Other languages</a>
                </li>
              </ul>
            </div>
  
            <!-- Bottom rail -->
            <div class="usa-grid usa-grid-full footer-banner">
              <a href="https://va.gov" title="Go to VA.gov">
                <img src="https://www.va.gov/img/homepage/va-logo-white.png" alt="VA logo and Seal, U.S. Department of Veterans Affairs" width="200" class="vads-u-height--auto">
              </a>
            </div>
            <div class="usa-grid usa-grid-full va-footer-links-bottom">
              <div class="usa-grid usa-grid-full va-footer-links-bottom">
              <ul>
                ${buildBottomRail(bottomRail)}
              </ul>
            </div>
            </div>
            ${VeteransCrisisLineModal}
          </div>
        </div>
      </div>
    </footer>
  `;
};
