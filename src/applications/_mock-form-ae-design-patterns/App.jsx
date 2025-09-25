import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { RoutedSavableApp } from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';

import {
  LOCATIONS_TO_REMOVE_FORM_HEADER,
  LOCATIONS_TO_HIDE_PROGRESS_BAR_ONLY,
} from './utils/constants';
import { PatternConfigContext } from './shared/context/PatternConfigContext';

const isPathIncludedInPossibleLocations = (location, possibleLocations) => {
  return possibleLocations.some(possibleLocation =>
    location.pathname.includes(possibleLocation),
  );
};

const mockSignedInUser = () => {
  // Find all sign-in navigation containers (desktop and mobile)
  const signInNavContainers = document.querySelectorAll('.sign-in-nav');

  signInNavContainers.forEach(container => {
    // Check if already signed in - just update the name
    const userDropdownSpan = container.querySelector('.user-dropdown-email');
    if (userDropdownSpan) {
      userDropdownSpan.textContent = 'Leslie';
      return;
    }

    // Replace sign-in button with signed-in dropdown
    const signedInDropdownHTML = `
      <div>
        <div class="va-dropdown">
          <button class="sign-in-drop-down-panel-button va-btn-withicon va-dropdown-trigger" aria-controls="account-menu" aria-expanded="false" type="button">
            <span>
              <svg aria-hidden="true" focusable="false" class="vads-u-display--block vads-u-margin-right--0 medium-screen:vads-u-margin-right--0p5" viewBox="0 2 21 21" xmlns="http://www.w3.org/2000/svg" style="width: 26px; height: 24px;">
                <path fill="#fff" d="M12 12c-1.1 0-2.04-.4-2.82-1.18A3.85 3.85 0 0 1 8 8c0-1.1.4-2.04 1.18-2.83A3.85 3.85 0 0 1 12 4c1.1 0 2.04.4 2.82 1.17A3.85 3.85 0 0 1 16 8c0 1.1-.4 2.04-1.18 2.82A3.85 3.85 0 0 1 12 12Zm-8 8v-2.8c0-.57.15-1.09.44-1.56a2.9 2.9 0 0 1 1.16-1.09 13.76 13.76 0 0 1 9.65-1.16c1.07.26 2.12.64 3.15 1.16.48.25.87.61 1.16 1.09.3.47.44 1 .44 1.56V20H4Z"></path>
              </svg>
              <span class="user-dropdown-email" data-dd-privacy="mask" data-dd-action-name="First Name">Leslie</span>
            </span>
          </button>
          <div class="va-dropdown-panel" id="account-menu" hidden="">
            <ul>
              <li><a href="#" data-demo-processed="true">My VA</a></li>
              <li><a class="my-health-link" href="#" data-demo-processed="true">My HealtheVet</a></li>
              <li><a href="#" data-demo-processed="true">Profile</a></li>
              <li><a href="#" data-demo-processed="true">Dependents</a></li>
              <li class="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-padding-bottom--1">
                <a href="#" data-demo-processed="true">Letters</a>
              </li>
              <li><a href="#" onclick="return false;" data-demo-processed="true">Sign Out</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // eslint-disable-next-line no-param-reassign
    container.innerHTML = signedInDropdownHTML;
  });

  // eslint-disable-next-line no-console
  console.log('Updated all sign-in containers to show Leslie as signed in');
};

const interceptDemoNavigation = () => {
  // Intercept all click events on the document to block navigation
  document.addEventListener(
    'click',
    e => {
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#')) return;

      // Check if this is a demo navigation button we want to allow
      const isDemoNavigation =
        target.closest('va-button') ||
        target.closest('va-button-pair') ||
        target.closest('[class*="vads-c-action-link"]') ||
        target.classList.contains('usa-button') ||
        target.classList.contains('va-button') ||
        // Allow skip-to-content for accessibility
        href === '#main' ||
        // Allow demo internal navigation
        (href.includes('/7/copy-of-submission/') || href.includes('pattern7'));

      if (!isDemoNavigation) {
        e.preventDefault();
        e.stopPropagation();
        // eslint-disable-next-line no-console
        console.log('Demo: Blocked click navigation to', href);
      }
    },
    true,
  ); // Use capture phase to catch events early

  // Also intercept form submissions that might navigate away
  document.addEventListener(
    'submit',
    e => {
      const form = e.target;
      const action = form.getAttribute('action');

      if (
        action &&
        !action.includes('/7/copy-of-submission/') &&
        action !== '#'
      ) {
        e.preventDefault();
        e.stopPropagation();
        // eslint-disable-next-line no-console
        console.log('Demo: Blocked form submission to', action);
      }
    },
    true,
  );
};

export const handleEditPageDisplayTweaks = location => {
  const navHeader = document.querySelector('#nav-form-header');
  const chapterProgress = document.querySelector(
    '.schemaform-chapter-progress',
  );
  const formTitle = document.querySelector('.schemaform-title');

  const shouldRemoveAll = isPathIncludedInPossibleLocations(
    location,
    LOCATIONS_TO_REMOVE_FORM_HEADER,
  );
  const shouldHideProgressBarOnly = isPathIncludedInPossibleLocations(
    location,
    LOCATIONS_TO_HIDE_PROGRESS_BAR_ONLY,
  );

  const isPattern7 = location.pathname.includes('/7/copy-of-submission/');
  if (isPattern7) {
    const fixDemoIssues = attempt => {
      setTimeout(() => {
        // Fix broken demo image URLs
        const brokenImages = document.querySelectorAll('img');
        brokenImages.forEach(img => {
          if (
            img.src.includes('va-logo-white.png') &&
            !img.src.startsWith('https://www.va.gov/')
          ) {
            // eslint-disable-next-line no-param-reassign
            img.src = 'https://www.va.gov/img/homepage/va-logo-white.png';
            // eslint-disable-next-line no-console
            console.log('Fixed VA logo image URL');
          }
        });

        // Intercept all navigation attempts to keep users on demo pages
        interceptDemoNavigation();

        // Mock signed-in user for review and confirmation pages
        const isReviewOrConfirmation =
          location.pathname.includes('/review') ||
          location.pathname.includes('/confirmation');

        if (isReviewOrConfirmation) {
          mockSignedInUser();

          // Also run on window resize to handle responsive breakpoint changes
          const handleResize = () => {
            mockSignedInUser();
          };

          // Remove any existing resize listener to avoid duplicates
          window.removeEventListener('resize', handleResize);
          window.addEventListener('resize', handleResize);
        }

        // Retry if needed for dynamically loaded content
        if (attempt < 10) {
          fixDemoIssues(attempt + 1);
        }
      }, attempt * 200);
    };

    fixDemoIssues(0);
  }

  if (shouldRemoveAll) {
    // Hide everything (original behavior)
    if (navHeader) {
      navHeader.style.display = 'none';
    }
    if (chapterProgress) {
      chapterProgress.style.display = 'none';
    }
    if (formTitle) {
      formTitle.style.display = 'none';
    }
  } else if (shouldHideProgressBarOnly) {
    // Hide only progress bar and chapter progress, keep form titles
    if (navHeader) {
      navHeader.style.display = 'none';
    }
    if (chapterProgress) {
      chapterProgress.style.display = 'none';
    }
    if (formTitle) {
      formTitle.style.display = 'block';
    }
  } else {
    // Show everything (original behavior)
    if (navHeader) {
      navHeader.style.display = 'block';
    }
    if (chapterProgress) {
      chapterProgress.style.display = 'block';
    }
    if (formTitle) {
      formTitle.style.display = 'block';
    }
  }
};

export default function App({ location, children }) {
  const formConfig = useContext(PatternConfigContext);

  useEffect(
    () => {
      handleEditPageDisplayTweaks(location);
    },
    [location],
  );

  // Check if we're on pattern 7 - use simple wrapper instead of RoutedSavableApp
  const isPattern7 = location.pathname.includes('/7/copy-of-submission/');

  if (isPattern7) {
    // Pattern 7: Simple wrapper without save-in-progress functionality
    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            {children}
          </div>
        </div>
        <FormFooter formConfig={formConfig} />
      </div>
    );
  }

  // All other patterns: Use RoutedSavableApp with full save-in-progress functionality
  return (
    <div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
