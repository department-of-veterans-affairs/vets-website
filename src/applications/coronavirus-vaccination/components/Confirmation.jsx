import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from 'platform/utilities/ui';
import {
  CaregiverMessage,
  ConfirmationMessage,
  ContactRules,
} from './VerbiageHelper';

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
      <ConfirmationMessage />
      <CaregiverMessage />
      <h2>How will VA contact me when I can get a COVID-19 vaccine?</h2>
      <ContactRules />
      <p>
        <strong>Please know:</strong> By sharing your plans for getting a
        vaccine, you help us better plan our efforts. But we’ll still contact
        every eligible Veteran in each risk group to ask if they want to get a
        vaccine. You don’t need to call or come to a VA facility to request or
        reserve a vaccine.
      </p>
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
