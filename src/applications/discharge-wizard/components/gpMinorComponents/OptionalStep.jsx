// Dependencies
import React from 'react';
import PropTypes from 'prop-types';

const OptionalStep = ({ formValues }) => {
  const validReason = ['1', '2'].indexOf(formValues['4_reason']) > -1;
  const dischargeYear = parseInt(formValues['2_dischargeYear'], 10);
  const validYear = dischargeYear >= 2001 && dischargeYear <= 2009;

  if (validReason && validYear) {
    return (
      <section className="feature">
        <h4>
          (Optional): Apply to the Physical Disability Board of Review (PDBR)
        </h4>
        <p>
          If you believe your disability rating for TBI, PTSD, or mental health
          conditions is too low, consider applying to the Physical Disability
          Board of Review (PDBR). The DoD created the PDBR specifically to
          review appeals about low disability ratings for Veterans discharged
          between 2001 and 2009. Some Veterans discharged during this period of
          time received lower disability ratings than they deserved, especially
          if they suffered from TBI, PTSD, or other mental health conditions. If
          you were discharged during this period of time and previously received
          a disability rating of 20% or lower, you’re eligible to apply to the
          PDBR for review. The PDBR does not issue discharge upgrades and cannot
          review conditions not listed in your military record before your
          separation. But, if the PDBR finds that your disability rating was
          unjustly low, it may help you make your case to upgrade your
          discharge.{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://health.mil/PDBR"
          >
            Learn more about PBDR reviews (opens in a new tab)
          </a>
          .{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://health.mil/Military-Health-Topics/Conditions-and-Treatments/Physical-Disability/Disability-Evaluation/Physical-Disability-Board-of-Review/PDBR-Application-Process"
          >
            Apply for a PBDR review (opens in a new tab)
          </a>
          .
        </p>
      </section>
    );
  }
  return null;
};

OptionalStep.propTypes = {
  formValues: PropTypes.object.isRequired,
};

export default OptionalStep;
