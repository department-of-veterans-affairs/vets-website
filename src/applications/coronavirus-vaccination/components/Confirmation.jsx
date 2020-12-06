import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

function Confirmation({ router, formIsSubmitted }) {
  if (formIsSubmitted) {
    return (
      <AlertBox
        status={ALERT_TYPE.SUCCESS}
        headline="Your application has been received"
        content="Thank you"
      />
    );
  }

  // Redirect to the homepage if there isn't any form data in state.
  // This is the case for direct navigation to "/confirmation/".

  router.replace('/');
  return null;
}

const mapStateToProps = state => {
  return {
    formIsSubmitted: state.coronavirusVaccinationApp.formState !== null,
  };
};

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Confirmation),
);

export { Confirmation };
