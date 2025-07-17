import React from 'react';
import { useSelector } from 'react-redux';
import { getAgeInYears } from '../helpers';

const EligibilitySummaryInfo = () => {
  const formData = useSelector(state => state.form?.data);

  const validDutyRequirements = ['atLeast3Years', 'byDischarge'];

  const dutyText = validDutyRequirements.includes(formData?.dutyRequirement)
    ? 'I am a Veteran who served at least 3 years (36 months) on active duty'
    : 'Ineligible';
  const dobText =
    formData?.dateOfBirth && getAgeInYears(formData?.dateOfBirth) < 62
      ? 'I am under the age of 62'
      : 'I am over the age of 62';
  const dischargeText =
    formData?.otherThanDishonorableDischarge === true
      ? 'I received a discharge under conditions other than dishonorable'
      : 'I did not receive a discharge under conditions other than dishonorable';

  return (
    <div className="eligibility-summary">
      <va-summary-box>
        <h4 slot="headline">
          Based on your response, you may not be eligible.
        </h4>
        <p>
          <strong>Your responses:</strong>
        </p>
        <li className="vads-u-position--relative">{dutyText}</li>
        <li className="vads-u-position--relative">{dobText}</li>
        <li className="vads-u-position--relative">{dischargeText}</li>
      </va-summary-box>
      <p>
        <strong>
          You must meet the above requirements to qualify for the program.
        </strong>{' '}
        Please consider that ineligible applications delay the processing of
        benefits for eligible applicants.
      </p>
    </div>
  );
};

export default EligibilitySummaryInfo;
