import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from 'platform/utilities/ui';

function Confirmation({ router, formData }) {
  useEffect(() => {
    focusElement('#covid-vaccination-heading-confirmation');

    if (!formData) {
      // Redirect to the homepage if there isn't any form data in state.
      // This is the case for direct navigation to "/confirmation/".
      router.replace('/');
    }
  }, []);

  return (
    <>
      <h1 className="no-outline" id="covid-vaccination-heading-confirmation">
        We've received your information
      </h1>
      <p>
        Thank you for signing up to stay informed about COVID-19 vaccines at VA.
        When we have new information to share about our COVID-19 plans and your
        vaccine options, we'll send you updates by email or text.
      </p>
      <p>
        You can also visit our main{' '}
        <a href="/health-care/covid-19-vaccine/">
          COVID-19 vaccines at VA page
        </a>{' '}
        for the latest information and answers to common questions.
      </p>
      <p>
        <strong>Remember:</strong> This form doesn’t sign you up to get a
        vaccine. And you can change your mind about getting a vaccine at any
        time. We’ll use the information you provided to understand your interest
        and keep you informed. If you want to update your information later, you
        can submit a new form.
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
  )(Confirmation),
);

export { Confirmation };
