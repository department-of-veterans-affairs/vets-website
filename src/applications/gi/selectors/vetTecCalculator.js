/* eslint-disable no-console */
import { createSelector } from 'reselect';
import { formatCurrency } from '../utils/helpers';

const getConstants = state => state.constants.constants;
const getFormInputs = state => state.calculator;
const getInstitution = state => state.profile.attributes;

const formatCurrencyNullTBD = value =>
  value !== null ? formatCurrency(value) : 'TBD';

export const getCalculatedBenefits = createSelector(
  getFormInputs,
  getConstants,
  getInstitution,
  (inputs, constants, institution) => {
    const vetTecTuitionInputNull =
      inputs.vetTecTuitionFees === null || inputs.vetTecTuitionFees === 0;

    const paysToProviderValue = vetTecTuitionInputNull
      ? null
      : Math.max(inputs.vetTecTuitionFees - inputs.vetTecScholarships, 0);

    const quarterPaysToProviderValue = vetTecTuitionInputNull
      ? null
      : paysToProviderValue * 0.25;

    const halfPaysToProviderValue = vetTecTuitionInputNull
      ? null
      : paysToProviderValue * 0.5;

    const determineOutOfPocketFees = () => {
      let outOfPocketFees;
      if (vetTecTuitionInputNull) {
        outOfPocketFees = null;
      } else if (institution.preferredProvider) {
        outOfPocketFees = 0;
      } else if (inputs.vetTecTuitionFees > constants.TFCAP) {
        outOfPocketFees =
          inputs.vetTecTuitionFees -
          constants.TFCAP -
          inputs.vetTecScholarships;
        if (outOfPocketFees < 0) {
          outOfPocketFees = 0;
        }
      } else {
        outOfPocketFees = 0;
      }
      return outOfPocketFees;
    };

    return {
      outputs: {
        vetTecTuitionFees: formatCurrencyNullTBD(
          inputs.vetTecTuitionFees === 0 ? null : inputs.vetTecTuitionFees,
        ),
        vetTecScholarships: formatCurrency(inputs.vetTecScholarships),
        vaPaysToProvider: formatCurrencyNullTBD(paysToProviderValue),
        quarterVetTecPayment: formatCurrencyNullTBD(quarterPaysToProviderValue),
        halfVetTecPayment: formatCurrencyNullTBD(halfPaysToProviderValue),
        outOfPocketTuitionFees: formatCurrencyNullTBD(
          determineOutOfPocketFees(),
        ),
        inPersonRate: `${formatCurrency(institution.dodBah)}/mo`,
        onlineRate: `${formatCurrency(constants.AVGDODBAH * 0.5)}/mo`,
      },
    };
  },
);
