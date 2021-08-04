import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from 'platform/utilities/ui';
import { ContactRules } from './VerbiageHelper';

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
        We have received your information
      </h1>
      <p>
        Thank you for signing up to stay informed about COVID-19 vaccines at VA.
        When we have new information to share about our COVID-19 plans and your
        vaccine options, we'll send you updates by email or text.
      </p>
      <p>
        We may also use your information to contact you about your vaccine
        options. It's always your choice if you want to get a vaccine.
      </p>

      <h2>How will VA contact me about my vaccine options?</h2>
      <ContactRules />
      <p>
        You can also get updates and answers to common questions on our main{' '}
        <a
          href="/health-care/covid-19-vaccine/"
          aria-label="Main COVID-19 vaccines page"
        >
          COVID-19 vaccines page
        </a>
        .
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
