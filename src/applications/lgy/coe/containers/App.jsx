import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import FormFooter from 'platform/forms/components/FormFooter';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';

import { generateCoe } from '../actions';

function App(props) {
  const { location, children } = props;

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
      <header className="row">
        <div className="usa-width-two-thirds medium-12 columns">
          <FormTitle title="Apply for a VA home loan Certificate of Eligibility" />
          <p className="vads-u-padding-bottom--4">
            Request for a Certificate of Eligibility (VA Form 26-1880)
          </p>
        </div>
      </header>
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
