import React, { createContext } from 'react';

import { useDispatch } from 'react-redux';
import greenFormConfig from '../../patterns/pattern1/TaskGreen/config/form';
import yellowFormConfig from '../../patterns/pattern1/TaskYellow/config/form';
import purpleFormConfig from '../../patterns/pattern1/TaskPurple/config/form';
import ezrFormConfig from '../../patterns/pattern1/ezr/config/form';
import redFormConfig from '../../patterns/pattern2/TaskRed/form/config/form';
import fallbackForm from '../config/fallbackForm';
import { TaskTabs } from '../components/TaskTabs';
import { Portal } from '../components/Portal';
import { useMockedLogin } from '../../hooks/useMockedLogin';

export const getFormConfig = location => {
  if (location.pathname.includes('/1/task-green')) {
    return greenFormConfig;
  }

  if (location.pathname.includes('/1/task-yellow')) {
    return yellowFormConfig;
  }

  if (location.pathname.includes('/1/task-purple')) {
    return purpleFormConfig;
  }

  if (location.pathname.includes('/1/ezr')) {
    return ezrFormConfig;
  }

  if (location.pathname.includes('/2/task-red')) {
    return redFormConfig;
  }

  return fallbackForm;
};

export const PatternConfigContext = createContext();

export const PatternConfigProvider = ({ location, children }) => {
  useMockedLogin(location);
  const formConfig = getFormConfig(location);

  const dispatch = useDispatch();
  dispatch({ type: 'SET_NEW_FORM_CONFIG', formConfig });

  // we need to get the header element to append the tabs to it
  const header = document.getElementById('header-default');
  return formConfig ? (
    <PatternConfigContext.Provider value={formConfig}>
      <Portal target={header}>
        <TaskTabs location={location} formConfig={formConfig} />
      </Portal>
      {children}
    </PatternConfigContext.Provider>
  ) : null;
};
