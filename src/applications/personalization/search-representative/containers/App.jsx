import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';

import formConfig from '../config/form';
import {
  getSchema,
  getUiSchema,
} from '../config/chapters/personal-information';

const App = ({ children, location, loggedIn }) => {
  useEffect(() => {
    formConfig.chapters.personalInformation.pages.personalInformation.schema = getSchema(
      loggedIn,
    );
    formConfig.chapters.personalInformation.pages.personalInformation.uiSchema = getUiSchema(
      loggedIn,
    );
  });

  return (
    <>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <FormFooter formConfig={formConfig} />
    </>
  );
};

const mapStateToProps = state => {
  const loggedIn = isLoggedIn(state);

  return { loggedIn };
};

export default connect(mapStateToProps)(App);
