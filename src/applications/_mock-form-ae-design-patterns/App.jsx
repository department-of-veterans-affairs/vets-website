import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

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

  return (
    <div>
      {/* Container wrapper to center content like RoutedSavableApp did */}
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">{children}</div>
      </div>
      <FormFooter formConfig={formConfig} />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
};
