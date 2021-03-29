import React from 'react';

export const CaregiverMessage = () => {
  return (
    <>
      <p>
        <strong>Note for caregivers:</strong> If you’re a designated primary or
        secondary caregiver in our{' '}
        <a
          href="/family-member-benefits/comprehensive-assistance-for-family-caregivers/"
          aria-label="Program of Comprehensive Assistance for Family Caregivers"
        >
          Program of Comprehensive Assistance for Family Caregivers
        </a>
        , your facility will tell you if you can get a vaccine at the same time
        as the Veteran you care for.
      </p>
    </>
  );
};

export const ConfirmationMessage = () => {
  return (
    <>
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
    </>
  );
};

export const WhatIfIDontSignUp = () => {
  return (
    <>
      <p>This depends on whether you currently receive care through VA.</p>
      <p>
        <strong>If you're a Veteran currently receiving care through VA</strong>
        , we’ll contact you when we have a vaccine for you, even if you don’t
        sign up. But if you do sign up and tell us you plan to get a vaccine, we
        may contact you sooner.
      </p>
      <p>
        If you signed up before and want to update your information, you can
        submit a new form at any time.
      </p>
      <span>
        If you want to learn more before you decide your plans:
        <p>
          <a
            href="/health-care/covid-19-vaccine/"
            aria-label="Main COVID-19 vaccines page"
          >
            Get answers to common questions about COVID-19 vaccines at VA
          </a>
        </p>
        <p>
          <a
            href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/facts.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facts about COVID-19 from the center for disease control and prevention (Open in a new window)"
          >
            Get more facts about COVID-19 vaccines from the Centers for Disease
            Control and Prevention (CDC)
          </a>
        </p>
        <p>
          <a
            href="https://blogs.va.gov/VAntage/83031/va-nurse-tuskegee-daughter-urges-veterans-learn-vaccines/"
            aria-label="Blog post about a VA nurse's decision to get a COVID-19 vaccine"
          >
            Read about one VA nurse’s decision to get a COVID-19 vaccine
          </a>
        </p>
      </span>
      <p>
        <strong>If you don’t currently receive care through VA,</strong> you’ll
        need to sign up to tell us you want to get a vaccine. If you're
        eligible, we'll contact you when we have a vaccine for you. At this
        time, we don't know when that will be.
      </p>
    </>
  );
};

export const WhyContact = () => {
  return (
    <>
      <p>
        At this time, we still have a limited supply of COVID-19 vaccines. And
        we must follow strict requirements for how to store and handle these
        vaccines. Because of this, we often need to bring Veterans in quickly to
        get a vaccine so we don’t waste any doses.
      </p>
      <p>
        Contacting Veterans who we know plan to get a vaccine helps us do the
        most good with our limited supply.
      </p>
    </>
  );
};

export const ProvideSSNAndDOB = () => {
  return (
    <>
      <p>
        <strong>If you’re a Veteran currently receiving care at VA,</strong> you
        don’t have to provide your Social Security number. But when you provide
        this information, we can match your information to your Veteran records.
        We can then tell your local VA facility about your vaccine plans. If you
        signed up before and didn’t provide this information, you can submit a
        new form at any time.
      </p>
      <p>
        <strong>If you’re not currently receiving care at VA,</strong> you’ll
        need to provide your Social Security number and date of birth. We use
        this information to add you to our records and confirm your eligibility
        for a vaccine.
      </p>
    </>
  );
};

export const ContactRules = () => {
  return (
    <>
      <p>
        Your local VA health facility may contact you by phone, email, or text
        message. If you’re eligible and want to get a vaccine, we encourage you
        to respond.
      </p>
      <span>
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
      </span>
      <span>
        Your facility may invite you to get a vaccine in different ways:
        <ul>
          <li>
            They may invite you to a large vaccination event, like a drive-thru
            clinic.
          </li>
          <li>They may offer you a specific date and time to get a vaccine.</li>
          <li>They may ask you to schedule an appointment.</li>
        </ul>
      </span>
    </>
  );
};
