import { makeMegaMenu } from './mega-menu';

export const getDesktopHeaderHtml = megaMenuData => {
  return `
    <header role="banner">
      <div id="preview-site-alert">
      </div>
      
      <!-- US Govt banner -->
      <div class="va-notice--banner">
        <div class="va-notice--banner-inner">
          <div class="usa-banner expand-official-govt-explanation">
            <div class="usa-accordion">
              <div class="usa-banner-header">
                <div class="usa-grid usa-banner-inner">
                  <img src="https://www.va.gov/img/tiny-usa-flag.png" alt="U.S. flag" height="20" width="20">
                  <p>An official website of the United States government</p>
                  <button id="usa-banner-toggle" class="usa-accordion-button usa-banner-button" aria-expanded="false" aria-controls="gov-banner">
                    <span class="usa-banner-button-text">Here’s how you know</span>
                  </button>
                </div>
              </div>
              <div class="usa-banner-content usa-grid usa-accordion-content" id="gov-banner" aria-hidden="true">
                <div class="usa-banner-guidance-gov usa-width-one-half">
                  <img class="usa-banner-icon usa-media_block-img" src="https://www.va.gov/img/icon-dot-gov.svg" alt="Dot gov">
                  <div class="usa-media_block-body">
                    <p>
                      <strong>The .gov means it’s official.</strong>
                      <br>
                      Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you're on a federal government site.
                    </p>
                  </div>
                </div>
                <div class="usa-banner-guidance-ssl usa-width-one-half">
                  <img class="usa-banner-icon usa-media_block-img" src="https://www.va.gov/img/icon-https.svg" alt="SSL">
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
        </div>
      </div>
      <!-- end US Govt banner -->

      <!-- start Veterans Crisis Line banner -->
      <div class="va-crisis-line-container vads-u-background-color--secondary-darkest">
        <button class="va-crisis-line va-overlay-trigger vads-u-background-color--secondary-darkest" data-show="#ts-modal-crisisline">
          <div class="va-crisis-line-inner">
            <span class="va-crisis-line-icon" aria-hidden="true"></span>
            <span class="va-crisis-line-text">
              Talk to the <strong>Veterans Crisis Line</strong> now
            </span>
            <img alt="" class="va-crisis-line-arrow" src="https://www.va.gov/img/arrow-right-white.svg" />
          </div>
        </button>
      </div>
      <!-- end Veterans Crisis Line banner -->

      <div class="vads-u-padding-top--3 vads-u-display--flex usa-grid vads-u-font-size--base" id="va-header-logo-menu">
        <div class="va-header-logo-wrapper">
          <a href="https://www.va.gov" class="va-header-logo">
            <img src="https://www.va.gov/img/header-logo.png" alt="VA logo and Seal, U.S. Department of Veterans Affairs" />
          </a>
        </div>
        <div id="login-root" class="vet-toolbar">
          <div class="profile-nav-container">
            <div class="hidden-header vads-u-display--flex vads-u-align-items--center vads-u-padding-top--1">
              
              <!-- start Search -->
              <div class="va-dropdown">
                <button id="search-dropdown-button" class="va-btn-withicon va-btn-withicon va-dropdown-trigger" aria-controls="search" aria-expanded="false">
                  <span>
                    <svg aria-hidden="true" class="vads-u-margin-right--0p5" focusable="false" width="24" viewBox="2 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"></path></svg>
                    Search
                  </span>
                </button>
                <div id="search-dropdown" class="va-dropdown-panel vads-u-padding--0 vads-u-margin--0" hidden></div>
              </div>
              <!-- end Search -->

              <a class="va-header-contact vads-u-color--white vads-u-text-decoration--none vads-u-padding-x--1 vads-u-font-weight--bold" href="https://www.va.gov/contact-us/">Contact us</a>
              <div class="sign-in-nav">
                <div class="sign-in-links">
                  <button class="sign-in-link">Sign in</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${makeMegaMenu(megaMenuData)}
    </header>
  `;
};
