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
        Your local VA health facility may also use the information you provided
        to determine when to contact you about getting a vaccine once your risk
        group becomes eligible. If you told us you plan to get a vaccine, your
        facility may contact you sooner. You can always change your mind about
        getting a vaccine. And you can submit a new form to update your
        information at any time.
      </p>
      <p>
        <strong>Note for caregivers:</strong>
        If you’re a designated primary or secondary caregiver in our{' '}
        <a
          href="/family-member-benefits/comprehensive-assistance-for-family-caregivers/"
          target="_blank"
        >
          Program of Comprehensive Assistance for Family Caregivers
        </a>
        , your facility will tell you if you can get a vaccine at the same time
        as the Veteran you care for.
      </p>
      <h2>How will VA contact me when I can get a COVID-19 vaccine?</h2>
      <p>
        Your local VA health facility may contact you by phone, email, or text
        message. If you’re eligible and want to get a vaccine, we encourage you
        to respond.
      </p>
      <p>
        But before you provide any personal information or click on any links,
        be sure the call, email, or text is really from VA.
        <ul>
          <li>
            Text messages will always come from <strong>53079</strong>.
          </li>
          <li>
            Emails will always come from a <strong>va.gov</strong> email
            address.
          </li>
          <li>
            If someone calls you from VA and you don’t recognize the phone
            number, ask for a number to call them back. Then call your local VA
            health facility to verify.
          </li>
        </ul>
      </p>
      <p>
        Your facility may invite you to get a vaccine in different ways:
        <ul>
          <li>
            They may invite you to a large vaccination event, like a drive-thru
            clinic.
          </li>
          <li>They may offer you a specific date and time to get a vaccine.</li>
          <li>They may ask you to schedule an appointment.</li>
        </ul>
      </p>

      <p>
        <strong>Please know:</strong> By sharing your plans for getting a
        vaccine, you help us better plan our efforts. But we’ll still contact
        every eligible Veteran in each risk group to ask if they want to get a
        vaccine. You don’t need to call or come to a VA facility to request or
        reserve a vaccine.
      </p>
      <p>
        You can also get updates and answers to common questions on our main
        <a href="/health-care/covid-19-vaccine/" target="_blank">
          {' '}
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
