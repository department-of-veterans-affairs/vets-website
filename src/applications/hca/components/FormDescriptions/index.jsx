import React from 'react';

export const AmericanIndianDescription = () => (
  <>
    <p>
      If you’re recognized as an American Indian or Alaska Native, you may not
      need to pay a copay for care or services.
    </p>

    <div
      className="vads-u-margin-top--3 vads-u-margin-bottom--4"
      data-testid="aiq-addl-info"
    >
      <va-additional-info trigger="What it means to be recognized as an American Indian or Alaska Native">
        <p>
          For the purposes of this application, we consider this to mean that
          one of these descriptions is true for you:
        </p>

        <ul>
          <li>
            You’re a member of a Federally recognized Indian tribe,{' '}
            <strong>or</strong>
          </li>
          <li>
            The Secretary of the Interior considers you to be an Indian for any
            purpose, <strong>or</strong>
          </li>
          <li>
            You’re eligible for Indian Health Service (including as a California
            Indian, Eskimo, Aleut, or another Alaska Native)
          </li>
        </ul>

        <p className="vads-u-margin-bottom--2">
          <strong>Or</strong>
        </p>

        <p>
          You live in an urban area and you meet at least one of these
          requirements:
        </p>

        <ul>
          <li>
            You’re a member or the first- or second-degree descendant of a
            tribe, band, or other organized group of Indians (including a tribe,
            band, or group terminated after 1940 or one that’s recognized by the
            state where you live), <strong>or</strong>
          </li>
          <li>
            You’re an Eskimo, Aleut, or another Alaska Native,{' '}
            <strong>or</strong>
          </li>
          <li>
            The Secretary of the Interior considers you to be an Indian for any
            purpose, <strong>or</strong>
          </li>
          <li>
            An official regulation from the Secretary of Health and Human
            Services considers you an Indian for any purpose
          </li>
        </ul>

        <p>
          We’ve based these descriptions on the Indian Health Care Improvement
          Act (IHCIA), U.S.C. regulations 1603(13) and 1603(28).
        </p>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ihs.gov/ihcia/"
        >
          Learn more about the IHCIA on the Indian Health Service website
        </a>
      </va-additional-info>
    </div>
  </>
);

export const BirthInfoDescription = () => (
  <>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
      Enter your place of birth, including city and state, province or region.
    </p>
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-bottom--4"
    >
      We ask for place of birth as an identity marker for record keeping. This
      will not impact your health care eligibility.
    </va-additional-info>
  </>
);

export const ContactInfoDescription = () => (
  <div className="vads-u-margin-bottom--5">
    <p>
      Adding your email and phone number is optional. But this information helps
      us contact you faster if we need to follow up with you about your
      application. If you don’t add this information, we’ll use your address to
      contact you by mail.
    </p>
    <p>
      <strong>Note:</strong> We’ll always mail you a copy of our decision on
      your application for your records.
    </p>
  </div>
);
