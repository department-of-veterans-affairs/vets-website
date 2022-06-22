import { isBrowserIE } from '~/platform/site-wide/helpers/detection/is-browser';
import { replaceWithStagingDomain } from '~/platform/utilities/environment/stagingDomains';

export default `
  <!-- Header -->
  <header class="header merger" role="banner">
    <!-- Mobile Layout -->
    <div
      data-widget-type="header"
      data-show="{{ !noHeader }}"
      data-show-nav-login="{{ !noNavOrLogin }}"
      data-show-mega-menu="{{ !noMegamenu }}"
      id="header-v2"
    ></div>

    <!-- Tablet/Desktop Layout -->
    <div id="legacy-header" class="vads-u-display--none">
      <div class="incompatible-browser-warning">
        <div class="row full">
          <div class="small-12">
            Your browser is out of date. To use this website, please <a href="https://browsehappy.com/">update your browser</a> or use a different device.
          </div>
        </div>
      </div>

      <div id="preview-site-alert"></div>

      <div class="va-notice--banner">
        <div class="va-notice--banner-inner">
          <!-- /va-gov/includes/usa-website-header.html -->
          <div class="usa-banner">
            <div class="usa-accordion">
              <div class="usa-banner-header">
                <div class="usa-grid usa-banner-inner">
                <img src="${replaceWithStagingDomain(
                  'https://www.va.gov/img/tiny-usa-flag.png',
                )}" alt="U.S. flag">
                <p>An official website of the United States government</p>
                <button id="usa-banner-toggle" class="usa-accordion-button usa-banner-button" aria-expanded="false" aria-controls="gov-banner">
                  <span class="usa-banner-button-text">Here&rsquo;s how you know</span>
                </button>
                </div>
              </div>
              <div class="usa-banner-content usa-grid usa-accordion-content" id="gov-banner" aria-hidden="true">
                <div class="usa-banner-guidance-gov usa-width-one-half">
                  <img class="usa-banner-icon usa-media_block-img" src="${replaceWithStagingDomain(
                    'https://www.va.gov/img/icon-dot-gov.svg',
                  )}" alt="Dot gov">
                  <div class="usa-media_block-body">
                    <p>
                      <strong>The .gov means it&rsquo;s official.</strong>
                      <br>
                      Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you're on a federal government site.
                    </p>
                  </div>
                </div>
                <div class="usa-banner-guidance-ssl usa-width-one-half">
                  <img class="usa-banner-icon usa-media_block-img" src="${replaceWithStagingDomain(
                    'https://www.va.gov/img/icon-https.svg',
                  )}" alt="SSL">
                  <div class="usa-media_block-body">
                    <p>
                      <strong>The site is secure.</strong>
                      <br> The <strong>https://</strong> ensures that you're connecting to the official website and that any information you provide is encrypted and sent securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- /va-gov/includes/usa-website-header.html -->
        </div>
        <div class="va-crisis-line-container">
          <button data-show="#modal-crisisline" class="va-crisis-line va-overlay-trigger">
            <div class="va-crisis-line-inner">
              <span class="va-crisis-line-icon" aria-hidden="true"></span>
              <span class="va-crisis-line-text">Talk to the <strong>Veterans Crisis Line</strong> now</span>
              <img class="va-crisis-line-arrow" src="${replaceWithStagingDomain(
                'https://www.va.gov/img/arrow-right-white.svg',
              )}" aria-hidden="true"></img>
            </div>
          </button>
        </div>
      </div>
      <!-- /header alert box -->

      <div class="row va-flex usa-grid" id="va-header-logo-menu">
        <div class="va-header-logo-wrapper">
          <a href="${replaceWithStagingDomain(
            'https://www.va.gov',
          )}" class="va-header-logo">
          <img src="${replaceWithStagingDomain(
            'https://www.va.gov/img/header-logo.png',
          )}" alt="Go to VA.gov"/>
          </a>
        </div>
        <div id="va-nav-controls"></div>
        <div id="login-root" class="vet-toolbar"></div>
      </div>
      <div class="usa-grid usa-grid-full">
        <div class="menu-rule usa-one-whole"></div>
        <div id="mega-menu"></div>
      </div>

      <!-- Hidden for modern browsers. -->
      <va-banner
        class="ie-deprecation-warning"
        headline="You'll need to use a different web browser"
        show-close
        type="warning"
        visible="false"
      >
        You're using Internet Explorer right now to access VA.gov. Microsoft stopped supporting all versions of this browser on June 15, 2022. This means that you'll need to switch to another browser, like Microsoft Edge, Google Chrome, Mozilla Firefox, or Apple Safari.
      </va-banner>
    </div>
  </header>
`;

// In the case of IE display the IE deprecation notice to the user.
// Solutioned for: https://github.com/department-of-veterans-affairs/va.gov-cms/issues/9075
if (isBrowserIE()) {
  window.addEventListener('load', () => {
    const ieMessageEl = document.body.querySelector('.ie-deprecation-warning');
    ieMessageEl.setAttribute('visible', '');
  });
}
