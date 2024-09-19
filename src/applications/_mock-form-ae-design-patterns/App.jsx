import React, { useContext, useEffect } from 'react';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';

// removes local storage for user profile session indicators
import { teardownProfileSession } from 'platform/user/profile/utilities';

import { useLocalStorage } from './hooks/useLocalStorage';

import { LOCATIONS_TO_REMOVE_FORM_HEADER } from './utils/constants';
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

  if (
    isPathIncludedInPossibleLocations(location, LOCATIONS_TO_REMOVE_FORM_HEADER)
  ) {
    if (navHeader) {
      // hide header on edit pages
      navHeader.style.display = 'none';
    }
    if (chapterProgress) {
      chapterProgress.style.display = 'none';
    }
    if (formTitle) {
      formTitle.style.display = 'none';
    }
  } else {
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
  const [, setHasSession] = useLocalStorage('hasSession', '');

  useEffect(
    () => {
      if (location?.query?.loggedIn === 'true') {
        setHasSession('hasSession', 'true');
      }

      if (location?.query?.loggedIn === 'false') {
        teardownProfileSession();
      }
      handleEditPageDisplayTweaks(location);

      // having the pollTimeout present triggers some api calls to be made locally and in codespaces
      if (!window?.VetsGov?.pollTimeout) {
        window.VetsGov.pollTimeout = 500;
      }
    },
    [location, setHasSession],
  );

  const formConfig = useContext(PatternConfigContext);

  return (
    <div className="vads-u-margin-top--4">
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </div>
  );
}
