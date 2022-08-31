import React from 'react';
import { links } from 'applications/caregivers/definitions/content';

export const FacilityInfoDescription = (
  <div className="vads-u-margin-top--2p5">
    <p className="vads-u-margin-bottom--4">
      <strong>Note:</strong> You should choose the medical center or clinic
      closest to your home.
    </p>

    <a
      href={links.findLocations.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      {links.findLocations.label}
    </a>
  </div>
);

export const LastTreatmentFacilityDescription = (
  <>
    <p>
      Please enter the name of the medical facility where the Veteran{' '}
      <strong>last received medical treatment.</strong>
    </p>
  </>
);

export const PreferredFacilityDescription = (
  <>
    <p>
      Please select the VA medical center or clinic where the{' '}
      <strong>
        Veteran receives or plans to receive health care services.
      </strong>
    </p>

    <p>
      A Caregiver Support Coordinator at this VA medical center will review your
      application.
    </p>
  </>
);
