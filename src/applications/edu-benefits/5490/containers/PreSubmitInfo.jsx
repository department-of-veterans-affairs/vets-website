import React from 'react';
import PreSubmitInfo from '../../containers/PreSubmitInfo';
import { eighteenOrOver } from '../helpers';

function PreSubmitNotice({
  formData,
  showError,
  onSectionComplete,
  setPreSubmit,
}) {
  const allServicePeriodsHaveEndDate =
    formData?.toursOfDuty &&
    formData.toursOfDuty.every(tour => tour.dateRange.to);

  const hasServed = formData['view:applicantServed'];

  const activeDutyNote = () => {
    if (
      eighteenOrOver(formData.relativeDateOfBirth) &&
      (!hasServed || (hasServed && allServicePeriodsHaveEndDate))
    ) {
      return (
        <p>
          <strong>By submitting this form</strong> you certify that all
          statements in this application are true and correct to the best of
          your knowledge and belief.
        </p>
      );
    }
    if (
      !eighteenOrOver(formData.relativeDateOfBirth) &&
      (!hasServed || (hasServed && allServicePeriodsHaveEndDate))
    ) {
      return (
        <div>
          <p>
            <strong>By submitting this form</strong> you certify that:
          </p>
          <ul>
            <li>You are the parent, guardian, or custodian of the applicant</li>
            <li>
              All statements in this application are true and correct to the
              best of your knowledge and belief
            </li>
          </ul>
        </div>
      );
    }
    if (
      !eighteenOrOver(formData.relativeDateOfBirth) &&
      hasServed &&
      !allServicePeriodsHaveEndDate
    ) {
      return (
        <div>
          <p>
            <strong>By submitting this form</strong> you certify that:
          </p>
          <ul>
            <li>You are the parent, guardian, or custodian of the applicant</li>
            <li>
              All statements in this application are true and correct to the
              best of your knowledge and belief
            </li>
            <li>
              Since the applicant is an active-duty service member, he or she
              has consulted with an Education Service Officer (ESO) regarding
              their education program
            </li>
          </ul>
        </div>
      );
    }
    return (
      // AC 7d
      <div>
        <p>
          <strong>By submitting this form</strong> you certify that:
        </p>
        <ul>
          <li>
            All statements in this application are true and correct to the best
            of your knowledge and belief
          </li>
          <li>
            As an active-duty service member, you have consulted with an
            Education Service Officer (ESO) regarding your education program
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {activeDutyNote()}
      <PreSubmitInfo
        formData={formData}
        showError={showError}
        onSectionComplete={onSectionComplete}
        setPreSubmit={setPreSubmit}
      />
    </>
  );
}

export default PreSubmitNotice;
