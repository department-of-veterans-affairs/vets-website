import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import FormFooter from 'platform/forms/components/FormFooter';

// removes local storage for user profile session indicators
import { teardownProfileSession } from 'platform/user/profile/utilities';

import fallbackFormConfig from '../config/fallbackForm';
import greenFormConfig from '../config/prefill/taskGreen/form';
import yellowFormConfig from '../config/prefill/taskYellow/form';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskButtons } from '../components/TaskButtons';

const getFormConfig = location => {
  if (location.pathname.includes('task-green')) {
    return greenFormConfig;
  }

  if (location.pathname.includes('task-yellow')) {
    return yellowFormConfig;
  }

  return fallbackFormConfig;
};

const handleEditPageDisplayTweaks = location => {
  const navHeader = document.querySelector('#nav-form-header');
  const chapterProgress = document.querySelector(
    '.schemaform-chapter-progress',
  );
  const formTitle = document.querySelector('.schemaform-title');
  if (
    location.pathname.includes(
      'task-green/veteran-information/edit-mailing-address',
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

      if (!window?.VetsGov?.pollTimeout) {
        window.VetsGov.pollTimeout = 5000;
      }
    },
    [location, setHasSession],
  );

  const formConfig = getFormConfig(location);

  dispatch({ type: 'SET_NEW_FORM_CONFIG', formConfig });

  return (
    <div className="vads-u-margin-top--4">
      <RoutedSavableApp
        formConfig={getFormConfig(location)}
        currentLocation={location}
      >
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
      <TaskButtons rootUrl={formConfig.rootUrl} />
    </div>
  );
}
