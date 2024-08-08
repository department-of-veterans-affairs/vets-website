import React from 'react';

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
