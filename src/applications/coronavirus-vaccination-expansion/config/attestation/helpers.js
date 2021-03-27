import React from 'react';

export const eligibilityAccordion = (
  <va-accordion>
    <va-accordion-item header="Which Veterans are eligible?">
      <p>
        To be eligible for a COVID-19 vaccine at VA as a Veteran, both of these
        statements must be true for you:
        <ul>
          <li>
            You served on active duty (other than for training) or have a
            service-connected disability, <strong>and</strong>
          </li>
          <li>You didn’t receive a dishonorable discharge.</li>
        </ul>
        Active duty service means you served full-time duty in any of these ways
        (other than for training purposes only):
        <ul>
          <li>In the U.S. Armed Forces (including Reserves)</li>
          <li>
            As a commissioned officer of the Regular or Reserve Corp of the
            Public Health Service, <strong>or</strong>
          </li>
          <li>
            As a commissioned officer of the National Oceanic and Atmospheric
            Administration (or Coast and Geodetic Survey), <strong>or</strong>
          </li>
          <li>
            As a Cadet at the U.S. Military, Air Force, or Coast Guard Academy,{' '}
            <strong>or</strong>
          </li>
          <li>As a midshipman at the United States Naval Academy</li>
        </ul>
      </p>
    </va-accordion-item>
    <va-accordion-item header="Who else is eligible?">
      <p>Our caregiver programs include these 2 programs:</p>
      <ul>
        <li>The Program of Comprehensive Assistance for Family Caregivers</li>
        <li>The General Caregiver Support Services program</li>
      </ul>
      <p>
        Our home-based and long-term care programs include these 4 programs:
      </p>
      <ul>
        <li>Medical Foster Home program</li>
        <li>Bowel and Bladder program</li>
        <li>Home Based Primary</li>
        <li>Care program Veteran Directed Care program</li>
      </ul>
    </va-accordion-item>
    <va-accordion-item header="What if I'm not eligible?">
      <p>
        We can only offer vaccines to people who are eligible under the law. If
        none of the descriptions on this page fit you, we can’t offer you a
        COVID-19 vaccine.
      </p>
      <p>
        Your employer, pharmacy, health care provider’s office, or local public
        health officials may offer you a COVID-19 vaccine.
      </p>
      <p>
        The Centers for Disease Control and Prevention’s (CDC) online vaccine
        finder tool can help you find COVID-19 vaccines near you.
      </p>
      <a href="https://www.cdc.gov/vaccines/covid-19/reporting/vaccinefinder/about.html">
        Go to the CDC’s COVID-19 vaccine finder
      </a>
    </va-accordion-item>
  </va-accordion>
);

export const veteranLabel = <strong>Eligible Veteran</strong>;

export const spouseLabel = (
  <>
    <strong>Spouse</strong> of an eligible Veteran
  </>
);

export const caregiverEnrolledLabel = (
  <>
    <strong>Eligible caregiver</strong> enrolled in an official VA caregiver
    program
  </>
);

export const caregiverOfVeteranLabel = (
  <>
    <strong>Eligible caregiver</strong> of a Veteran who is enrolled in an
    official VA home-based or long-term care program
  </>
);

export const champvaLabel = (
  <>
    <strong>Recipient of CHAMPVA</strong> (Civilian Health and Medical Program
    of the Department of Veteran Affairs) benefits
  </>
);
