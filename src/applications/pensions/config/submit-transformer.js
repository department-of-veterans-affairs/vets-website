import { isMarried } from '../helpers';
import {
  hasNoSocialSecurityDisability,
  hasFederalTreatmentHistory,
  hasVaTreatmentHistory,
  isInNursingHome,
  medicaidDoesNotCoverNursingHome,
  isUnder65,
  isEmployedUnder65,
  isUnemployedUnder65,
  currentSpouseHasFormerMarriages,
  ownsHome,
  isHomeAcreageMoreThanTwo,
  doesReceiveIncome,
  doesHaveCareExpenses,
  doesHaveMedicalExpenses,
} from './form';

export function transform(formConfig, form) {
  const mainTransform = formData => {
    const result = { ...formData };

    const propertiesToDeleteWithFalseCondition = [
      {
        condition: hasNoSocialSecurityDisability,
        properties: ['medicalCondition'],
      },
      { condition: isInNursingHome, properties: ['medicaidCoverage'] },
      {
        condition: medicaidDoesNotCoverNursingHome,
        properties: ['medicaidStatus'],
      },
      { condition: hasVaTreatmentHistory, properties: ['vaMedicalCenters'] },
      {
        condition: hasFederalTreatmentHistory,
        properties: ['federalMedicalCenters'],
      },
      { condition: isUnder65, properties: ['currentEmployment'] },
      { condition: isEmployedUnder65, properties: ['currentEmployers'] },
      { condition: isUnemployedUnder65, properties: ['previousEmployers'] },
      {
        condition: isMarried,
        properties: [
          'marriages',
          'spouseDateOfBirth',
          'spouseSocialSecurityNumber',
          'spouseIsVeteran',
          'spouseVaFileNumber',
          'spouseAddress',
          'reasonForCurrentSeparation',
          'currentSpouseAddress',
          'otherExplanation',
          'currentSpouseMonthlySupport',
          'currentSpouseMaritalHistory',
          'spouseMarriages',
        ],
      },
      {
        condition: currentSpouseHasFormerMarriages,
        properties: ['spouseMarriages'],
      },
      {
        condition: ownsHome,
        properties: ['homeAcreageMoreThanTwo'],
      },
      {
        condition: isHomeAcreageMoreThanTwo,
        properties: ['homeAcreageValue', 'landMarketable'],
      },
      { condition: doesReceiveIncome, properties: ['incomeSources'] },
      { condition: doesHaveCareExpenses, properties: ['careExpenses'] },
      { condition: doesHaveMedicalExpenses, properties: ['medicalExpenses'] },
    ];

    propertiesToDeleteWithFalseCondition.forEach(
      ({ condition, properties }) => {
        if (!condition(formData.data)) {
          properties.forEach(property => {
            if (Object.prototype.hasOwnProperty.call(result.data, property)) {
              delete result.data[property];
            }
          });
        }
      },
    );

    const propertiesToDeleteWithTruthyCondition = [
      {
        condition: formData.data && formData.data.maritalStatus === 'Married',
        properties: [
          'reasonForCurrentSeparation',
          'otherExplanation',
          'currentSpouseMonthlySupport',
        ],
      },
      {
        condition:
          formData.data && formData.data['view:hasDependents'] === false,
        properties: ['dependents'],
      },
      {
        condition: formData.data && formData.data.totalNetWorth,
        properties: ['netWorthEstimation'],
      },
    ];

    propertiesToDeleteWithTruthyCondition.forEach(
      ({ condition, properties }) => {
        if (condition) {
          properties.forEach(property => {
            if (Object.prototype.hasOwnProperty.call(result.data, property)) {
              delete result.data[property];
            }
          });
        }
      },
    );

    return result;
  };

  const transformedData = mainTransform(form.data || {});
  return JSON.stringify(transformedData);
}
