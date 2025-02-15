import React from 'react';
import { LAST_YEAR } from '../../utils/constants';

const CombatOperationServiceDescription = props => {
  const { formData } = props;
  return (
    <>
      <h4>Your annual income from {LAST_YEAR}</h4>
      <p>Gross annual income: {formData.veteranGrossIncome}</p>
      <p>Net annual income: {formData.veteranNetIncome}</p>
      <p>Other income: {formData.veteranOtherIncome}</p>
      <h4>Spouse’s annual income from {LAST_YEAR}</h4>
      <p>Gross annual income: {formData.spouseGrossIncome}</p>
      <p>Net annual income: {formData.spouseNetIncome}</p>
      <p>Other income: {formData.spouseOtherIncome}</p>
      <h4>Deductible expenses from {LAST_YEAR}</h4>
      <p>Gross annual income: {formData.deductibleMedicalExpenses}</p>
      <p>Net annual income: {formData.deductibleEducationExpenses}</p>
      <p>Other income: {formData.deductibleFuneralExpenses}</p>
    </>
  );
};

export default CombatOperationServiceDescription;
