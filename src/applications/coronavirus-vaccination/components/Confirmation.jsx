import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

function Confirmation({ router: _router, formData }) {
  useEffect(() => {
    if (!formData) {
      // Redirect to the homepage if there isn't any form data in state.
      // This is the case for direct navigation to "/confirmation/".
      // @todo this next line is commented out only for visibility purposes,
      // so we can see the content w/o submitting a new form
      // we should uncomment it before launch.
      // router.replace('/');
    }
  });

  return (
    <>
      <h1>We've received your information</h1>
      <p>
        Thank you for signing up to stay informed about COVID-19 vaccines at VA.
        When we have new information to share about our COVID-19 plans and your
        vaccine options, we'll send you updates by email or text.
      </p>
      <p>
        You can also visit our main{' '}
        <a href="/covid-19-vaccine/">COVID-19 vaccines at VA page</a> for the
        latest information and answers to common questions.
      </p>
      <p>
        <strong>Remember:</strong> You don’t need to sign up to get a vaccine.
        And you can change your mind about getting a vaccine at any time. We’ll
        use the information you provide to understand your interest and
        communicate with you. If you want to update your information later, you
        can submit a new form.
      </p>
    </>
  );
}

const mapStateToProps = state => {
  return {
    formData: state.coronavirusVaccinationApp.formData,
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
