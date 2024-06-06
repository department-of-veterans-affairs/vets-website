import { makeMegaMenu } from './mega-menu';

export const getMobileHeaderHtml = megaMenuData => {
  return `
    <header role="banner">
      <div id="preview-site-alert"></div>
      
      <!-- start US Gov banner -->
      <div class="usa-accordion">
        <div class="vads-u-display--flex vads-u-flex-direction--column">
          <div class="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
            <img alt="U.S. flag" class="vads-u-margin-right--1" src="https://www.va.gov/img/tiny-usa-flag.png" height="20" width="20">
            <button aria-controls="official-govt-site-explanation" aria-expanded="false" class="expand-official-govt-explanation usa-accordion-button va-button-link vads-u-text-decoration--none">An official website of the United States government.
              <svg
                aria-hidden="true"
                className="vads-u-margin-left--0p5${
                  expanded ? ' govt-expanded-arrow' : ''
                }"
                focusable="false"
                width="12"
                viewBox="6 6 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#005ea2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div aria-hidden="true" class="usa-accordion-content vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-padding--1p5 vads-u-padding-y--2" id="official-govt-site-explanation">
          <div class="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-start">
            <img alt="Dot gov" class="usa-banner-icon usa-media_block-img" src="https://www.va.gov/img/icon-dot-gov.svg">
            <p class="vads-u-margin-top--0 vads-u-padding--0">
            <strong>The .gov means it’s official.</strong>
            <br>Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you’re on a federal government site.</p>
          </div>
          <div class="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--flex-start vads-u-margin-top--2">
            <img alt="SSL" class="usa-banner-icon usa-media_block-img" src="https://www.va.gov/img/icon-https.svg">
            <p class="vads-u-margin-top--0">
            <strong>The site is secure.</strong>
            <br> The <strong>https://</strong> ensures that you’re connecting to the official website and that any information you provide is encrypted and sent securely.</p>
          </div>
        </div>
      </div>
      <!-- end US Gov banner -->

      <!-- start Veterans Crisis Line banner -->
      <div class="vads-u-background-color--secondary-darkest vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center vads-u-text-align--center vads-u-padding--0p5">
        <button class="va-crisis-line va-button-link vads-u-color--white vads-u-text-decoration--none va-overlay-trigger" data-show="#ts-modal-crisisline">Talk to the <strong>Veterans Crisis Line</strong> now
          <svg
            aria-hidden="true"
            className="vads-u-margin-left--1"
            focusable="false"
            width="16"
            viewBox="7 1 17 17"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"
            />
          </svg>
        </button>
      </div>
      <!-- end Veterans Crisis Line banner -->      

      <nav class="vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0">
        <div class="header-logo-row vads-u-background-color--primary-darkest vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-padding-y--1p5 vads-u-padding-left--1p5 vads-u-padding-right--1">
          
          <!-- start VA logo -->
          <a aria-label="VA logo" class="header-logo vads-u-display--flex vads-u-align-items--center vads-u-justify-content--center" href="https://www.va.gov">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.6 35.2" role="img">
            <title>VA</title>
            <g fill="#FFF">
              <path d="M11.1 35.2L0 0h8.6l4.2 14.9c1.2 4.2 2.2 8.2 3.1 12.6h.1c.9-4.2 1.9-8.4 3.1-12.4L23.5 0h8.3L20.2 35.2h-9.1zM36.6 26.2l-2.5 9h-8L36.6 0h10.2l10.8 35.2h-8.5l-2.7-9h-9.8zm8.8-6l-2.2-7.5c-.6-2.1-1.2-4.7-1.7-6.8h-.1c-.5 2.1-1 4.8-1.6 6.8l-2 7.5h7.6z">
              </path>
            </g>
            </svg>
          </a>
          <!-- end VA logo -->

          <div class="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
            <div class="profile-nav-container">
              
              <!-- start Sign In button -->
              <div class="hidden-header vads-u-display--flex vads-u-align-items--center">
                <div class="sign-in-nav">
                  <div class="sign-in-links">
                    <button class="sign-in-link">Sign in</button>
                  </div>
                </div>
              </div>
              <!-- end Sign In button -->

            </div>

            <!-- start Menu button -->
            <button aria-controls="header-nav-items" aria-expanded="false" id="header-menu-button" class="vads-u-background-color--gray-lightest vads-u-color--link-default vads-u-padding-y--1 vads-u-padding-x--1p5 vads-u-margin--0 vads-u-margin-left--2 vads-u-position--relative" type="button">
              <span id="mobile-menu-button" aria-hidden="false">
                Menu<svg
                aria-hidden="true"
                className="vads-u-margin-left--0p5"
                focusable="false"
                viewBox="1 2 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#005ea2"
                  d="M4 17V15H22V17H4ZM4 12V10H22V12H4ZM4 7V5H22V7H4Z"
                />
              </svg>
              </span>
              <span id="mobile-close-button" aria-hidden="true" hidden>
                Close<svg
                aria-hidden="true"
                className="vads-u-margin-left--0p5"
                focusable="false"
                viewBox="3 3 16 16"
                width="15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#005ea2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                />
              </svg>
              </span>
              <div class="header-menu-button-overlay vads-u-background-color--gray-lightest vads-u-position--absolute vads-u-width--full" hidden></div>
            </button>
            <!-- end Menu button -->

          </div>
        </div>
        ${makeMegaMenu(megaMenuData)}
      </nav>
    </header>
  `;
};
