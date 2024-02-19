import VeteransCrisisLineModal from '../../crisis-line-modal';
import {
  buildBottomRail,
  buildColumn,
  getFormattedFooterData,
} from '../../../utilities/footer';

export const getMobileFooterHtml = footerData => {
  const columns = getFormattedFooterData(footerData);
  const bottomRail = columns.bottom_rail;

  return `
    <footer class="footer" id="ts-mobile-footer">
      <div id="footerNav" data-minimal-footer="false">
        <div>
          <div class="footer-inner">
            <div aria-hidden="false" class="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content">
              <ul class="usa-accordion va-footer-accordion">
                <li>
                  <div class="vads-u-background-color--secondary-darkest vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
                    <button class="va-button-link vads-u-color--white vads-u-text-decoration--none va-overlay-trigger" data-show="#ts-modal-crisisline" id="footer-crisis-line">Talk to the <strong>Veterans Crisis Line</strong> now<i aria-hidden="true" class="fa fa-chevron-right vads-u-margin-left--1"></i></button>
                  </div>
                </li>
                <li>
                  <button class="usa-button-unstyled usa-accordion-button va-footer-button" aria-controls="veteran-contact" itemprop="name" aria-expanded="false">Contact us</button>
                  <div class="usa-accordion-content va-footer-accordion-content" id="veteran-contact" aria-hidden="true">
                    <h2 class="va-footer-linkgroup-title vads-u-padding-bottom--1">Get answers</h2>
                    <ul class="va-footer-links">
                      ${buildColumn(columns, 4)}
                    </ul>
                  </div>
                </li>
                <li>
                  <button class="usa-button-unstyled usa-accordion-button va-footer-button" aria-controls="footer-veteran-programs" itemprop="name" aria-expanded="false">Veteran programs and services</button>
                  <div class="usa-accordion-content va-footer-accordion-content" aria-hidden="true" id="footer-veteran-programs">
                    <ul class="va-footer-links">
                      ${buildColumn(columns, 1)}
                    </ul>
                  </div>
                </li>
                <li>
                  <button class="usa-button-unstyled usa-accordion-button va-footer-button" aria-controls="veteran-resources" itemprop="name" aria-expanded="false">More VA resources</button>
                  <div class="usa-accordion-content va-footer-accordion-content" aria-hidden="true" id="veteran-resources">
                    <ul class="va-footer-links">
                      ${buildColumn(columns, 2)}
                    </ul>
                  </div>
                </li>
                <li>
                  <button class="usa-button-unstyled usa-accordion-button va-footer-button" aria-controls="veteran-connect" itemprop="name" aria-expanded="false">Get VA updates</button>
                  <div class="usa-accordion-content va-footer-accordion-content" id="veteran-connect" aria-hidden="true">
                    <ul class="va-footer-links">
                      ${buildColumn(columns, 3)}
                    </ul>
                  </div>
                </li>
                <li>
                <h2 class="va-footer-linkgroup-title">
                  <button class="usa-button-unstyled usa-accordion-button va-footer-button" aria-controls="veteran-language-support" itemprop="name" aria-expanded="false">Language assistance</button>
                </h2>
                <div class="usa-accordion-content va-footer-accordion-content vads-u-padding-bottom--0 vads-u-padding-left--0p5" id="veteran-language-support" aria-hidden="true">
                  <div class="usa-grid usa-grid-full va-footer-links-bottom">
                    <ul class="vads-u-margin-top--0 vads-u-margin-bottom--0 vads-u-padding-bottom--0">
                      <li>
                        <a href="https://va.gov/asistencia-y-recursos-en-espanol" lang="es" hreflang="es"> Español</a>
                      </li>
                      <li>
                        <a href="https://va.gov/tagalog-wika-mapagkukunan-at-tulong" lang="tl" hreflang="tl"> Tagalog</a>
                      </li>
                      <li>
                        <a href="https://va.gov/resources/how-to-get-free-language-assistance-from-va/" lang="en" hreflang="en"> Other languages</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="usa-grid usa-grid-full footer-banner">
            <a href="https://va.gov" title="Go to VA.gov">
              <img src="https://www.va.gov/img/homepage/va-logo-white.png" alt="VA logo and Seal, U.S. Department of Veterans Affairs" width="200" class="vads-u-height--auto">
            </a>
          </div>
          <div class="usa-grid usa-grid-full va-footer-links-bottom">
            <ul>
              ${buildBottomRail(bottomRail)}
            </ul>
          </div>
        </div>
        ${VeteransCrisisLineModal}
      </div>
    </footer>
  `;
};
