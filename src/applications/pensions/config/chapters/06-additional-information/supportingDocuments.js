import React from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export const childAttendsCollege = child => child.attendingCollege;
export const childIsDisabled = child => child.disabled;
export const childIsAdopted = child => child.childRelationship === 'ADOPTED';

const SupportingDocument = ({ formId, formName }) => (
  <li>
    A completed {formName} (VA Form {formId})<br />
    <va-link
      href={`https://www.va.gov/find-forms/about-form-${formId.toLowerCase()}`}
      external
      text={`Get VA Form ${formId} to download`}
    />
  </li>
);

SupportingDocument.propTypes = {
  formId: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
};

const SpecialMonthlyPensionAccordionItems = () => (
  <>
    <va-accordion-item header="If you need the help of another person for daily living">
      <p>
        You’ll need to submit evidence that shows one of these is true:
        <ul>
          <li>
            You need another person to help you perform daily activities, like
            bathing, feeding, and dressing, <strong>or</strong>
          </li>
          <li>
            You have to stay in bed—or spend a large portion of the day in
            bed—because of illness, <strong>or</strong>
          </li>
          <li>
            You’re a patient in a nursing home due to the loss of mental or
            physical abilities related to a disability, <strong>or</strong>
          </li>
          <li>
            Your eyesight is limited (even with glasses or contact lenses you
            have only 5/200 or less in both eyes, or concentric contraction of
            the visual field to 5 degrees or less)
          </li>
        </ul>
      </p>
    </va-accordion-item>
    <va-accordion-item header="If you’re housebound and you live independently ">
      <p>
        You’ll need to submit additional evidence that shows one of these is
        true:
        <ul>
          <li>
            You have a single, permanent disability that’s rated as 100%
            disabling, and this means you’ll always need to be in your home or
            another living space most of the time, <strong>or</strong>
          </li>
          <li>
            You have a single, permanent disability rated as 100% disabling and
            at least one other disability rated as 60% or more disabling
          </li>
        </ul>
      </p>
    </va-accordion-item>
  </>
);

/**
 * @typedef {object} DocumentsProps
 * @property {object} formData - The form data
 *
 * @param {DocumentsProps} props - The component props
 * @returns {React.Element} The Documents component
 */
function Documents({ formData }) {
  const hasDisabledChild = (formData.dependents || []).some(childIsDisabled);
  const hasSchoolChild = (formData.dependents || []).some(childAttendsCollege);
  const hasAdoptedChild = (formData.dependents || []).some(childIsAdopted);
  const hasSpecialMonthlyPension = formData.specialMonthlyPension;
  const hasSocialSecurityDisability = formData.socialSecurityDisability;
  const livesInNursingHome = formData.nursingHome;
  const assetsOverThreshold = formData.totalNetWorth;
  const homeAcreageMoreThanTwo =
    formData.homeOwnership && formData.homeAcreageMoreThanTwo;
  const hasTransferredAssets = formData.transferredAssets;
  const needsIncomeAndAssetStatement =
    assetsOverThreshold || homeAcreageMoreThanTwo || hasTransferredAssets;

  const showDocumentsList =
    hasSchoolChild ||
    hasSpecialMonthlyPension ||
    livesInNursingHome ||
    needsIncomeAndAssetStatement;

  const showAccordionsList =
    hasAdoptedChild ||
    hasDisabledChild ||
    hasSocialSecurityDisability ||
    hasSpecialMonthlyPension;

  return (
    <>
      {showDocumentsList && (
        <>
          <p> You'll need to submit these supporting documents: </p>
          <ul data-testid="supporting-documents-list">
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

      {showAccordionsList && (
        <>
          <p className="vads-u-margin-top--6">
            You’ll also need to submit certain additional evidence depending on
            your situation.
          </p>
          <va-accordion data-testid="additional-evidence-list">
            {hasAdoptedChild && (
              <va-accordion-item header="If you have any dependent children who are adopted">
                <p>You’ll need to submit copies of one of these documents:</p>
                <ul>
                  <li>
                    Adoption papers, <strong>or</strong>
                  </li>
                  <li>An amended birth certificate</li>
                </ul>
              </va-accordion-item>
            )}
            {hasDisabledChild && (
              <va-accordion-item header="If you have any dependent children who are seriously disabled">
                <p>
                  You’ll need to submit medical evidence that shows the child
                  became permanently disabled because of a physical or mental
                  disability before their 18th birthday.
                </p>
                <p>
                  The medical evidence you submit will need to show the nature
                  and extent of the child’s disability. You can submit these
                  types of medical evidence:
                </p>
                <ul>
                  <li>Doctor’s reports</li>
                  <li>Medical labs</li>
                  <li>Test results</li>
                </ul>
              </va-accordion-item>
            )}
            {hasSocialSecurityDisability && (
              <va-accordion-item header="If you receive Social Security disability payments">
                <p>
                  You’ll need to submit additional evidence that shows one of
                  these is true:
                </p>
                <ul>
                  <li>
                    You’re unemployed due to a permanent disability (a
                    disability that’s not expected to improve),{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    You have a permanent and total disability (a disability that
                    we’ve rated as 100% disabling and that’s not expected to
                    improve)
                  </li>
                </ul>
              </va-accordion-item>
            )}
            {hasSpecialMonthlyPension && (
              <SpecialMonthlyPensionAccordionItems />
            )}
          </va-accordion>
        </>
      )}
    </>
  );
}

Documents.propTypes = {
  formData: PropTypes.shape({
    dependents: PropTypes.arrayOf(PropTypes.object),
    specialMonthlyPension: PropTypes.bool,
    socialSecurityDisability: PropTypes.bool,
    nursingHome: PropTypes.bool,
    totalNetWorth: PropTypes.bool,
    homeOwnership: PropTypes.bool,
    homeAcreageMoreThanTwo: PropTypes.bool,
    transferredAssets: PropTypes.bool,
  }).isRequired,
};

export default {
  title: 'Supporting documents',
  path: 'additional-information/supporting-documents',
  uiSchema: {
    ...titleUI(
      'Supporting documents',
      'On the next screen, we’ll ask you to submit supporting documents and additional evidence for your pension claim. If you upload all this information online now, you may be able to get a faster decision on your claim.',
    ),
    'ui:description': Documents,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
