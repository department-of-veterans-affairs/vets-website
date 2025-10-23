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
    const avgDodBah = constants ? constants.AVGDODBAH : 0;
    const tfCap = constants ? constants.TFCAP : 0;

    const { vetTecTuitionFees, vetTecScholarships } = inputs;

    const inputsNull = vetTecTuitionFees === null || vetTecTuitionFees === 0;

    const paysToProviderValue = inputsNull
      ? null
      : Math.max(vetTecTuitionFees - vetTecScholarships, 0);

    const quarterPaysToProviderValue = inputsNull
      ? null
      : paysToProviderValue * 0.25;

    const halfPaysToProviderValue = inputsNull
      ? null
      : paysToProviderValue * 0.5;

    let outOfPocketFees = 0;
    if (inputsNull) {
      outOfPocketFees = null;
    } else if (institution.preferredProvider) {
      outOfPocketFees = 0;
    } else if (!institution.preferredProvider && vetTecTuitionFees > tfCap) {
      outOfPocketFees = vetTecTuitionFees - tfCap - vetTecScholarships;
      if (outOfPocketFees < 0) {
        outOfPocketFees = 0;
      }
    }

    return {
      outputs: {
        vetTecTuitionFees: formatCurrencyNullTBD(
          vetTecTuitionFees === 0 ? null : vetTecTuitionFees,
        ),
        vetTecScholarships: formatCurrency(vetTecScholarships),
        vaPaysToProvider: formatCurrencyNullTBD(paysToProviderValue),
        quarterVetTecPayment: formatCurrencyNullTBD(quarterPaysToProviderValue),
        halfVetTecPayment: formatCurrencyNullTBD(halfPaysToProviderValue),
        outOfPocketTuitionFees: formatCurrencyNullTBD(outOfPocketFees),
        inPersonRate: `${formatCurrency(institution.dodBah)}`,
        onlineRate: `${formatCurrency(avgDodBah * 0.5)}`,
      },
    };
  },
);
