import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormFooter from 'platform/forms/components/FormFooter';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';

import { generateCoe } from '../actions';

function App(props) {
  const { children, location } = props;

  useEffect(() => {
    props.generateCoe();
  }, []);

  const content = (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );

  return (
    <>
      {content}
      <FormFooter formConfig={formConfig} />
    </>
  );
}

const mapStateToProps = state => ({
  certificateOfEligibility: state.certificateOfEligibility,
});

const mapDispatchToProps = {
  generateCoe,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export { App };
