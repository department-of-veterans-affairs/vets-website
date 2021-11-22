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
    <va-accordion multi style={paddingBottom}>
      <va-accordion-item level="4" header="Which Veterans are eligible?">
        <p>
          <strong>All Veterans</strong> are now eligible for a COVID-19 vaccine
          at VA. This includes anyone who served in the U.S. military, including
          the U.S. National Guard, Reserves, or Coast Guard. This also includes
          those who served as:
          <ul>
            <li>
              Commissioned officers of the Regular or Reserve Corp of the Public
              Health Service, <strong>or</strong>
            </li>
            <li>
              Commissioned officers of the National Oceanic and Atmospheric
              Administration (or Coast and Geodetic Survey), <strong>or</strong>
            </li>
            <li>
              Cadets at the U.S. Military, Air Force, or Coast Guard Academy,{' '}
              <strong>or</strong>
            </li>
            <li>Midshipmen at the United States Naval Academy</li>
          </ul>
        </p>
      </va-accordion-item>
      <va-accordion-item level="4" header="Who else is eligible?">
        <p>
          To be eligible for a COVID-19 vaccine at VA as a non-Veteran, at least
          one of these descriptions must fit you:
          <ul>
            <li>
              <strong>Spouse</strong> of a Veteran, including surviving spouses
            </li>

            <li>
              <strong>Caregiver</strong> of a Veteran. A caregiver is a family
              member or friend who provides care to a Veteran. Caregivers may
              help a Veteran with personal needs like feeding, bathing, or
              dressing. They may also help a Veteran with tasks like shopping or
              transportation.
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
    <strong>Veteran</strong>
  </>
);

export const spouseLabel = (
  <>
    <strong>Spouse or surviving spouse</strong> of a Veteran
  </>
);

export const caregiverOfVeteranLabel = (
  <>
    <strong>Caregiver</strong> of a Veteran
  </>
);

export const champvaLabel = (
  <>
    <strong>Recipient of CHAMPVA</strong> (Civilian Health and Medical Program
    of the Department of Veteran Affairs) benefits
  </>
);
