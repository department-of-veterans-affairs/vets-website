import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';

// removes local storage for user profile session indicators

import { teardownProfileSession } from 'platform/user/profile/utilities';

import fallbackFormConfig from '../config/fallbackForm';
import greenFormConfig from '../config/prefill/taskGreen/form';
import yellowFormConfig from '../config/prefill/taskYellow/form';
import purpleFormConfig from '../config/prefill/taskPurple/form';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskTabs } from '../components/TaskTabs';
import { Portal } from '../components/Portal';

const getFormConfig = location => {
  if (location.pathname.includes('task-green')) {
    return greenFormConfig;
  }

  if (location.pathname.includes('task-yellow')) {
    return yellowFormConfig;
  }

  if (location.pathname.includes('task-purple')) {
    return purpleFormConfig;
  }

  return fallbackFormConfig;
};

const locationsWhereFormHeaderShouldBeRemoved = [
  'task-green/veteran-information/edit-mailing-address',
  '/complete',
];

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
    isPathIncludedInPossibleLocations(
      location,
      locationsWhereFormHeaderShouldBeRemoved,
    )
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
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (location?.query?.loggedIn === 'true') {
        setHasSession('hasSession', 'true');
      }

      if (location?.query?.loggedIn === 'false') {
        teardownProfileSession();
      }
      handleEditPageDisplayTweaks(location);

      // having the pollTimeout allows api calls locally
      if (!window?.VetsGov?.pollTimeout) {
        window.VetsGov.pollTimeout = 5000;
      }
    },
    [location, setHasSession],
  );

  const formConfig = getFormConfig(location);

  dispatch({ type: 'SET_NEW_FORM_CONFIG', formConfig });

  // we need to get the header element to append the tabs to it
  const header = document.getElementById('header-default');

  return (
    <div className="vads-u-margin-top--4">
      <Portal target={header}>
        <TaskTabs location={location} formConfig={formConfig} />,
      </Portal>

      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </div>
  );
}
