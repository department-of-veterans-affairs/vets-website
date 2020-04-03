import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryCaregiverInfo as PrimaryAdditional } from 'applications/caregivers/components/AdditionalInfo/index';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

export const VetInfo = () => (
  <p>
    Complete the following information about the Veteran or Service member. You
    aren’t required to fill in all fields, but we can review your application
    faster if you provide more information.
  </p>
);

export const PrimaryCaregiverInfo = ({ additionalInfo }) => (
  <div>
    <p>
      Complete the following information about the Caregiver or Family member
      who is helping the Veteran or Service member. You can also include
      information about up to two Secondary Family Caregivers.
    </p>

    {additionalInfo && (
      <section>
        <PrimaryAdditional />
      </section>
    )}
  </div>
);

PrimaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
};

PrimaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
};

export const SecondaryCaregiverInfo = () => (
  <p>
    Complete the following information about the Secondary Caregiver or Family
    member who is helping the Veteran or Service member. You can include
    information about up to two Secondary Family Caregivers.
  </p>
);

export const FacilityInfo = () => (
  <>
    <div className="vads-u-margin-bottom--4">
      <AdditionalInfo triggerText="Can't find your clinic">
        We only include certain facilities. You should pick the medical center
        or clinic closest to your home.
      </AdditionalInfo>
    </div>

    <a
      href="https://www.va.gov/find-locations"
      rel="noopener noreferrer"
      target="_blank"
    >
      Find locations with the VA facility locator
    </a>
  </>
);
