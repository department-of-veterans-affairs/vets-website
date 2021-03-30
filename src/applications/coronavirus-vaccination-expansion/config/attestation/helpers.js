import React from 'react';

const paddingBottom = { paddingBottom: '1em' };

export const title = <strong>Which of these best describes you?</strong>;
export const eligibilityAccordion = (
  <>
    <p>
      We have a limited amount of COVID-19 vaccines. We want to make sure we can
      offer vaccines to as many Veterans, caregivers, spouses, and CHAMPVA
      recipients as we can. We can only offer vaccines to people who are
      eligible under the law. Thank you for helping us to achieve our mission.
    </p>
    <h3 className="vads-u-font-size--h4" style={paddingBottom}>
      Learn about who's eligible for a COVID-19 vaccine at VA
    </h3>
    <va-accordion style={paddingBottom}>
      <va-accordion-item level="4" header="Which Veterans are eligible?">
        <p>
          To be eligible for a COVID-19 vaccine at VA as a Veteran, both of
          these statements must be true for you:
          <ul>
            <li>
              You served on active duty (other than for training) or have a
              service-connected disability, <strong>and</strong>
            </li>
            <li>You didn’t receive a dishonorable discharge.</li>
          </ul>
          Active duty service means you served full-time duty in any of these
          ways (other than for training purposes only):
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
              As a Cadet at the U.S. Military, Air Force, or Coast Guard
              Academy, <strong>or</strong>
            </li>
            <li>As a midshipman at the United States Naval Academy</li>
          </ul>
        </p>
      </va-accordion-item>
      <va-accordion-item level="4" header="Who else is eligible?">
        <p>
          To be eligible for a COVID-19 vaccine at VA as a non-Veteran, at least
          one of these descriptions must fit you:
          <ul>
            <li>
              <strong>Spouse</strong> of an eligible Veteran
            </li>

            <li>
              <strong>Caregiver</strong> of an eligible Veteran. A caregiver is
              a family member or friend who provides care to the Veteran.
              Caregivers may help the Veteran with personal needs like feeding,
              bathing, or dressing. They may also help the Veteran with tasks
              like shopping or transportation.
            </li>

            <li>
              <strong>Recipient of CHAMPVA</strong> (Civilian Health and Medical
              Program of the Department of Veterans Affairs) benefits
            </li>
          </ul>
        </p>
      </va-accordion-item>
      <va-accordion-item level="4" header="What if I'm not eligible?">
        <p>
          We can only offer vaccines to people who are eligible under the law.
          If none of the descriptions on this page fit you, we can’t offer you a
          COVID-19 vaccine.
        </p>
        <p>
          Your employer, pharmacy, health care provider’s office, or local
          public health officials may offer you a COVID-19 vaccine.
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
  </>
);

export const veteranLabel = (
  <>
    <strong>Eligible Veteran</strong> who meets the service requirements listed
    above
  </>
);

export const spouseLabel = (
  <>
    <strong>Spouse</strong> of an eligible Veteran
  </>
);

export const caregiverOfVeteranLabel = (
  <>
    <strong>Caregiver</strong> of an eligible Veteran
  </>
);

export const champvaLabel = (
  <>
    <strong>Recipient of CHAMPVA</strong> (Civilian Health and Medical Program
    of the Department of Veteran Affairs) benefits
  </>
);
