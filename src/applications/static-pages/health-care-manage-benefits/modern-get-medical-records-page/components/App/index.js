// Node modules.
import React from 'react';
import { connect } from 'react-redux';
import {
  MhvSimpleSigninCallToAction,
  mapStateToProps,
} from 'applications/static-pages/mhv-simple-signin-cta';

export const linkText = 'Go to your medical records';
export const linkUrl = '/my-health/medical-records';

export const App = () => {
  const Widget = connect(mapStateToProps)(MhvSimpleSigninCallToAction);
  return <Widget headingLevel="4" linkText={linkText} linkUrl={linkUrl} />;
};

export default App;
