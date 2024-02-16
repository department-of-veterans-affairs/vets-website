import React from 'react';

export const childAttendsCollege = child => child.attendingCollege;
export const childIsDisabled = child => child.disabled;

const SupportingDocument = ({ formId, formName }) => {
  const linkText = `Get VA Form ${formId} to download (opens in new tab)`;
  return (
    <li>
      A completed {formName} (VA Form {formId})<br />
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={`https://www.va.gov/find-forms/about-form-${formId.toLowerCase()}`}
        aria-label={linkText}
      >
        {linkText}
      </a>
    </li>
  );
};

function Description({ formData }) {
  const hasDisabledChild = (formData.dependents || []).some(childIsDisabled);
  const hasSchoolChild = (formData.dependents || []).some(childAttendsCollege);
  const hasSpecialMonthlyPension = formData.specialMonthlyPension;
  const livesInNursingHome = formData.nursingHome;
  const assetsOverThreshold = formData.totalNetWorth; // over $25,000 in assets
  const homeAcreageMoreThanTwo =
    formData.homeOwnership && formData.homeAcreageMoreThanTwo;
  const hasTransferredAssets = formData.transferredAssets;
  const needsIncomeAndAssetStatement =
    assetsOverThreshold || homeAcreageMoreThanTwo || hasTransferredAssets;

  const showDocumentsList =
    hasDisabledChild ||
    hasSchoolChild ||
    hasSpecialMonthlyPension ||
    livesInNursingHome ||
    needsIncomeAndAssetStatement;

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
              <SupportingDocument
                formName="Examination for Housebound Status or Permanent Need
              for Regular Aid and Attendance"
                formId="21-2680"
              />
            )}

            {livesInNursingHome && (
              <SupportingDocument
                formName="Request for Nursing Home Information in Connection
              with Claim for Aid and Attendance"
                formId="21-0779"
              />
            )}

            {hasSchoolChild && (
              <SupportingDocument
                formName="Request for Approval of School Attendance"
                formId="21-674"
              />
            )}

            {hasDisabledChild && (
              <li>
                Private medical records documenting your child's disability
                before the age of 18
              </li>
            )}

            {needsIncomeAndAssetStatement && (
              <SupportingDocument
                formName="Income and Asset Statement in Support of Claim for
              Pension or Parents' Dependency and Indemnity Compensation"
                formId="21P-0969"
              />
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
