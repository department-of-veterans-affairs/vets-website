import React from 'react';
import { CONTACTS } from '../../../../utils/imports';

// Declare content blocks for export
const explainBlock1 = (
  <p data-testid="hca-enrollment-text-1">
    Our records show that you served on active duty for less than 24 continuous
    months. To qualify for VA health care without other special eligibility
    factors, you must have served on active duty for at least 24 months all at
    once, without a break in service.
  </p>
);

const explainBlock2 = (
  <p data-testid="hca-enrollment-text-2">
    Our records show that you don’t have a high enough Character of Discharge to
    qualify for VA health care.
  </p>
);

const explainBlock3 = (
  <p data-testid="hca-enrollment-text-3">
    We determined that you’re not eligible for VA health care because we didn’t
    have proof of your military service (like your DD214 or other separation
    papers).
  </p>
);

const explainBlock4 = (
  <p data-testid="hca-enrollment-text-4">
    Our records show that you served in the National Guard or Reserves, and
    weren’t activated to federal active duty for at least 24 continuous months.
    To qualify for VA health care without other special eligibility factors, you
    must have served on active duty for at least 24 months all at once, without
    a break in service.
  </p>
);

const explainBlock5 = (
  <p data-testid="hca-enrollment-text-5">
    Our records show that you’re enrolled in CHAMPVA. We couldn’t accept your
    application because the VA medical center you applied to doesn’t offer
    services to CHAMPVA recipients.
  </p>
);

const explainBlock6 = (
  <p data-testid="hca-enrollment-text-6">
    Our records show that you didn’t serve in the U.S. military or an eligible
    foreign military. To qualify for VA health care, you must meet this service
    requirement.
  </p>
);

const explainBlock7 = (
  <p data-testid="hca-enrollment-text-7">
    We can’t accept an application for this Veteran. If this information is
    incorrect, please call our enrollment case management team at{' '}
    <va-telephone contact={CONTACTS['222_VETS']} />.
  </p>
);

const explainBlock8 = (
  <p data-testid="hca-enrollment-text-8">
    We need you to submit a financial disclosure so we can determine if you’re
    eligible for VA health care based on your income.
  </p>
);

const explainBlock9 = (
  <p data-testid="hca-enrollment-text-9">
    We’re in the process of verifying your military service. We’ll contact you
    by mail if we need you to submit supporting documents (like your DD214 or
    other discharge papers or separation documents).
  </p>
);

const explainBlock10 = (
  <span data-testid="hca-enrollment-text-10">
    <p>
      You included on your application that you’ve received a Purple Heart
      medal. We need an official document showing that you received this award
      so we can confirm your eligibility for VA health care.
    </p>
    <p>
      <va-link
        href="/records/get-military-service-records/"
        text="Find out how to request your military records"
      />
    </p>
  </span>
);

const explainBlock11 = (
  <span data-testid="hca-enrollment-text-11">
    <p>
      Our records show that we couldn’t enroll you when you applied for VA
      health care in the past. But eligibility can change based on changes in
      your life or income or changes in VA eligibility requirements. And as of
      March 5, 2024, we have new options to enroll Veterans.
    </p>
    <p>
      We encourage you to apply again to help us determine if we can enroll you
      now.
    </p>
  </span>
);

// Export blocks
export default {
  explainBlock1,
  explainBlock2,
  explainBlock3,
  explainBlock4,
  explainBlock5,
  explainBlock6,
  explainBlock7,
  explainBlock8,
  explainBlock9,
  explainBlock10,
  explainBlock11,
};
