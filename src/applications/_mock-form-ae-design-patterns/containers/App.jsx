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
