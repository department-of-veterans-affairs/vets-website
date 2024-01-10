import React from 'react';

function Description({ formData }) {
  const hasSchoolChild = (formData.dependents || []).some(
    child => child.attendingCollege,
  );

  const hasDisabledChild = (formData.dependents || []).some(
    child => child.disabled,
  );

  const hasSpecialMonthlyPension = formData.specialMonthlyPension;

  const livesInNursingHome = formData.nursingHome;

  const showDocumentsList =
    hasSchoolChild ||
    hasDisabledChild ||
    hasSpecialMonthlyPension ||
    livesInNursingHome;

  return (
    <>
      <p>
        On the next screen, we’ll ask you to submit supporting documents for
        your claim. If you upload all of your supporting documents online now,
        you may be able to get a faster decision on your claim.
      </p>

      {showDocumentsList && (
        <>
          <p> You'll need to upload these documents: </p>

          <ul>
            {hasSpecialMonthlyPension && (
              <li>
                a completed Examination for Housebound Status or Permanent Need
                for Regular Aid and Attendance (VA Form 21-2680)
                <br />
                <va-link
                  href="https://www.va.gov/find-forms/about-form-21-2680"
                  text="Get VA Form 21-2680 to download"
                />
              </li>
            )}

            {livesInNursingHome && (
              <li>
                a completed Request for Nursing Home Information in Connection
                with Claim for Aid and Attendance (VA Form 21-0779)
                <br />
                <va-link
                  href="https://www.va.gov/find-forms/about-form-21-0779"
                  text="Get VA Form 21-0779 to download"
                />
              </li>
            )}

            {hasSchoolChild && (
              <li>
                a completed Request for Approval of School Attendance (VA Form
                21-674)
                <br />
                <va-link
                  href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf"
                  text="Get VA Form 21-674 to download"
                />
              </li>
            )}

            {hasDisabledChild && (
              <li>
                private medical records documenting your child's disability
                before the age of 18
              </li>
            )}
          </ul>
        </>
      )}

      {hasSpecialMonthlyPension && (
        <>
          <p>
            <strong>
              You’ll also need to submit additional evidence depending on your
              situation:
            </strong>
          </p>

          <va-accordion>
            <va-accordion-item header="If you need the help of another person for daily living">
              <p>
                You’ll need to submit evidence that shows at least one of these
                is true for you:
                <ul>
                  <li>
                    You need another person to help you perform daily
                    activities, like bathing, feeding, and dressing,{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    You have to stay in bed—or spend a large portion of the day
                    in bed—because of illness, <strong>or</strong>
                  </li>
                  <li>
                    You’re a patient in a nursing home due to the loss of mental
                    or physical abilities related to a disability,{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    Your eyesight is limited (even with glasses or contact
                    lenses you have only 5/200 or less in both eyes, or
                    concentric contraction of the visual field to 5 degrees or
                    less)
                  </li>
                </ul>
              </p>
            </va-accordion-item>

            <va-accordion-item header="If you’re housebound and you live independently ">
              <p>
                You’ll need to submit evidence that shows at least one of these
                is true for you:
                <ul>
                  <li>
                    You have a single, permanent disability that’s rated as 100%
                    disabling, and this means you’ll always need to be in your
                    home or another living space most of the time,{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    You have a single, permanent disability rated as 100%
                    disabling and at least one other disability rated as 60% or
                    more disabling
                  </li>
                </ul>
              </p>
            </va-accordion-item>
          </va-accordion>
        </>
      )}
    </>
  );
}

export default {
  uiSchema: {
    'ui:title': 'Supporting documents',
    'ui:description': Description,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
