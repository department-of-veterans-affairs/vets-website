import React from 'react';
import get from 'platform/utilities/data/get';
import { IncomeInformationAlert } from '../../../components/FormAlerts';

export function doesHaveCareExpenses(formData) {
  return formData.hasCareExpenses === true;
}

export function doesHaveMedicalExpenses(formData) {
  return formData.hasMedicalExpenses === true;
}

export function ownsHome(formData) {
  return formData.homeOwnership === true;
}

export function doesReceiveIncome(formData) {
  return formData.receivesIncome === true;
}

export function otherExplanationRequired(formData, index) {
  return get(['incomeSources', index, 'typeOfIncome'], formData) === 'OTHER';
}

export function dependentNameRequired(formData, index) {
  return get(['incomeSources', index, 'receiver'], formData) === 'DEPENDENT';
}

export function childNameRequired(key, formData, index) {
  return get([key, index, 'recipients'], formData) === 'DEPENDENT';
}

export function IncomeSourceDescription() {
  return (
    <>
      <p>
        We want to know more about the gross monthly income you, your spouse,
        and your dependents receive.
      </p>
      <IncomeInformationAlert />
    </>
  );
}

export function MedicalExpenseDescription() {
  return (
    <>
      <p>
        We want to know if you, your spouse, or your dependents pay medical or
        certain other expenses that aren’t reimbursed.
      </p>
      <p>
        Examples include these types of expenses:
        <ul>
          <li>
            Recurring medical expenses for yourself, or someone in your
            household, that insurance doesn’t cover
          </li>
          <li>
            One-time medical expenses for yourself, or someone in your
            household, after you started this online application or after you
            submitted an Intent to File, that insurance doesn’t cover
          </li>
          <li>
            Tuition, materials, and other expenses for educational courses or
            vocational rehabilitation for you or your spouse over the past year
          </li>
          <li> Burial expenses for a spouse or a child over the past year </li>
          <li>
            Legal expenses over the past year that resulted in a financial
            settlement or award (like Social Security disability benefits)
          </li>
        </ul>
      </p>
    </>
  );
}

export function SupportingDocumentsNotice() {
  return (
    <div>
      <p>
        Based on your answer, you’ll need to submit a supporting document about
        your income and assets.
      </p>
      <p>
        We’ll give you instructions for submitting your document at the end of
        this application.
      </p>
    </div>
  );
}
