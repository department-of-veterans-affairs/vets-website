import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const activeDutyAccordianContent = (
  <>
    <p>
      Active-duty service means you served full-time duty in any of these ways
      (other than for training only):
    </p>
    <ul>
      <li>In the U.S. Armed Forces (including Reserves)</li>
      <li>
        As a commissioned officer of the Regular or Reserve Corp of the Public
        Health Service, <strong>or</strong>
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
  </>
);

export const veteranLabel = (
  <>
    <p>
      <strong>Eligible Veteran</strong>. To be eligible for a COVID-19 vaccine
      at VA, both of these statements must be true for you:
    </p>
    <ul>
      <li>
        You served on active duty (other than for training) or have a
        service-connected disability, <strong>and</strong>
      </li>
      <li>You didn't receive a dishonorable discharge.</li>
    </ul>
    <AdditionalInfo triggerText="What counts as active duty service?">
      {activeDutyAccordianContent}
    </AdditionalInfo>
  </>
);

export const spouseLabel = (
  <p>
    <strong>Spouse</strong> of an eligible Veteran
  </p>
);

export const caregiverEnrolledLabel = (
  <>
    <p>
      <strong>Eligible caregiver</strong> enrolled in an official VA caregiver
      program
    </p>
    <AdditionalInfo triggerText="What programs does this include?">
      <p>This includes caregivers enrolled in these programs:</p>
      <ul>
        <li>The Program of Comprehensive Assistance for Family Caregivers</li>
        <li>The General Caregiver Support Services program</li>
      </ul>
    </AdditionalInfo>
  </>
);

export const caregiverOfVeteranLabel = (
  <>
    <p>
      <strong>Eligible caregiver</strong> of a Veteran who is enrolled in an
      official VA home-based or long-term care program
    </p>
    <AdditionalInfo triggerText="What programs does this include?">
      <p>This includes caregivers enrolled in these programs:</p>
      <ul>
        <li>Medical Foster Home program</li>
        <li>Bowel and Bladder program</li>
        <li>Home Based Primary Care program</li>
        <li>Veteran Directed Care program</li>
      </ul>
    </AdditionalInfo>
  </>
);

export const champvaLabel = (
  <p>
    <strong>Recipient of CHAMPVA</strong> (Civilian Health and Medical Program
    of the Department of Veteran Affairs) benefits
  </p>
);
