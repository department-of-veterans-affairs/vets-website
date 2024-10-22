import React, { createContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchInProgressForm } from 'platform/forms/exportsFile';
import greenFormConfig from '../../patterns/pattern1/TaskGreen/config/form';
import yellowFormConfig from '../../patterns/pattern1/TaskYellow/config/form';
import purpleFormConfig from '../../patterns/pattern1/TaskPurple/config/form';
import ezrFormConfig from '../../patterns/pattern1/ezr/config/form';
import grayFormConfig from '../../patterns/pattern2/TaskGray/form/config/form';
import blueFormConfig from '../../patterns/pattern2/TaskBlue/config/form';
import { formConfigForOrangeTask } from '../../patterns/pattern2/TaskOrange/config/form';
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

  if (location.pathname.includes('/2/task-gray')) {
    return grayFormConfig;
  }

  if (location.pathname.includes('/2/task-orange')) {
    return formConfigForOrangeTask;
  }

  if (location.pathname.includes('/2/task-blue')) {
    return blueFormConfig;
  }

  return fallbackForm;
};

export const PatternConfigContext = createContext();

export const PatternConfigProvider = ({ location, children }) => {
  useMockedLogin(location);
  const formConfig = getFormConfig(location);

  const dispatch = useDispatch();
  dispatch({ type: 'SET_NEW_FORM_CONFIG', formConfig });

  // go get the form data if it hasn't been loaded yet
  // this is used when the form is refreshed on an inner page
  const loadedData = useSelector(state => state?.form?.loadedData);
  const isIntroductionPage = location.pathname.includes('introduction');

  if (loadedData) {
    const { formId, prefillEnabled, prefillTransformer } = formConfig;
    const migrations = formConfig?.migrations || [];
    const { metadata } = loadedData;
    if (Object.keys(metadata).length === 0 && !isIntroductionPage) {
      dispatch(
        fetchInProgressForm(
          formId,
          migrations,
          prefillEnabled,
          prefillTransformer,
        ),
      );
    }
  }

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
