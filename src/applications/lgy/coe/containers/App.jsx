import React from 'react';
import { connect } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import formConfig from '../config/form';
import { getFormPagePaths } from '../utils';

const FORM_PATHS = getFormPagePaths(formConfig);

function App({ location, children, loggedIn, router }) {
  const formPath = window.location.pathname.split('/').pop();
  if (!loggedIn && FORM_PATHS.includes(formPath)) {
    router.push('/introduction');
  }
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  loggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(App);
