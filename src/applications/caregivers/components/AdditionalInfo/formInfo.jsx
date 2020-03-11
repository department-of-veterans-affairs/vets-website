import React from 'react';
import PropTypes from 'prop-types';
import {
  PrimaryCaregiverInfo as PrimaryAdditional,
  SecondaryCaregiverInfo as SecondaryAdditional,
} from 'applications/caregivers/components/AdditionalInfo/index';

export const VetInfo = () => (
  <p>
    Complete the following information about the Veteran or Service member. You
    aren’t required to fill in all fields, but we can review your application
    faster if you provide more information.
  </p>
);

export const PrimaryCaregiverInfo = ({ additionalInfo }) => (
  <article>
    <p>
      Complete the following information about the Caregiver or Family member
      who is helping the Veteran or Service member. You can also include
      information about up to two Secondary Family Caregivers.
    </p>

    {additionalInfo && (
      <section>
        <PrimaryAdditional />
        <SecondaryAdditional />
      </section>
    )}
  </article>
);

PrimaryCaregiverInfo.propTypes = {
  additionalInfo: PropTypes.bool,
};

PrimaryCaregiverInfo.defaultProps = {
  additionalInfo: false,
};

export const SecondaryCaregiverInfo = () => (
  <span>
    Complete the following information about the Secondary Caregiver or Family
    member who is helping the Veteran or Service member. You can include
    information about up to two Secondary Family Caregivers.
  </span>
);
