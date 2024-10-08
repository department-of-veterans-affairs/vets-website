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

export function childNameRequired(formData, index) {
  return get(['careExpenses', index, 'recipients'], formData) === 'DEPENDENT';
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
