import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from 'platform/utilities/ui';

function Unsubscribe() {
  useEffect(() => {
    focusElement('#covid-vaccination-heading-unsubscribe');
  }, []);
  return (
    <>
      <h1 className="no-outline" id="covid-vaccination-heading-unsubscribe">
        Unsubscribe
      </h1>
      <p>
        Unsubscribing Text. Or do we just want to launch the unsubscribe action
        when the user navigates to this page?
      </p>
    </>
  );
}

const mapStateToProps = state => {
  return {
    formData: state.coronavirusVaccinationApp.formState?.formData,
  };
};

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Unsubscribe),
);

export { Unsubscribe };
