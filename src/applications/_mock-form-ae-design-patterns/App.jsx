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

  // Replace Mitchell with Leslie for pattern 7 pages
  const isPattern7 = location.pathname.includes('/7/copy-of-submission/');
  if (isPattern7) {
    const replaceUserNameWithLeslie = attempt => {
      setTimeout(() => {
        const userDropdownSpan = document.querySelector('.user-dropdown-email');
        if (
          userDropdownSpan &&
          userDropdownSpan.textContent.trim() !== 'Leslie'
        ) {
          const originalName = userDropdownSpan.textContent.trim();
          userDropdownSpan.textContent = 'Leslie';
          // eslint-disable-next-line no-console
          console.log(
            `Successfully replaced "${originalName}" with "Leslie" in user dropdown`,
          );
        } else if (
          attempt < 50 &&
          (!userDropdownSpan || userDropdownSpan.textContent.trim() === '')
        ) {
          // Keep trying if element doesn't exist or is empty
          replaceUserNameWithLeslie(attempt + 1);
        }
      }, attempt * 100); // Check every 100ms for up to 5 seconds
    };

    replaceUserNameWithLeslie(0);
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
