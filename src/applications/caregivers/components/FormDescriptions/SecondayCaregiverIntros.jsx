import React from 'react';
import PropTypes from 'prop-types';
import SecondaryCaregiverDescription from './SecondaryCaregiverDescription';
import SecondaryRequiredAlert from '../FormAlerts/SecondaryRequiredAlert';
import { hideCaregiverRequiredAlert } from '../../utils/helpers';

const SecondayCaregiverOneIntro = ({ formData }) => {
  return (
    <div aria-live="polite">
      {!hideCaregiverRequiredAlert(formData) && <SecondaryRequiredAlert />}
      <p>
        You can use this application to apply for benefits for a Secondary
        Family Caregiver.
      </p>
      <p>
        <strong>Note:</strong> There can only be 2 Secondary Family Caregivers
        at any one time.
      </p>
      {SecondaryCaregiverDescription}
    </div>
  );
};

const SecondayCaregiverTwoIntro = (
  <>
    <p>You can have up to 2 Secondary Family Caregivers at any one time.</p>
    {SecondaryCaregiverDescription}
  </>
);

SecondayCaregiverOneIntro.propTypes = {
  formData: PropTypes.object,
};

export { SecondayCaregiverOneIntro, SecondayCaregiverTwoIntro };
