import { some } from 'lodash';
import _ from '../../../platform/utilities/data';
import { MILITARY_CITIES, MILITARY_STATE_VALUES, PTSD } from './constants';

export const hasMilitaryRetiredPay = data =>
  _.get('view:hasMilitaryRetiredPay', data, false);

export const hasSeparationPay = data =>
  _.get('view:hasSeparationPay', data, false);

export const hasTrainingPay = data => _.get('view:hasTrainingPay', data, false);

export const hasRatedDisabilities = data =>
  !!_.get('ratedDisabilities', data, []).length;

export function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

export function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError('Please enter a valid 9 digit ZIP (dashes allowed)');
  }
}

export function validateMilitaryCity(
  errors,
  city,
  formData,
  schema,
  messages,
  options,
) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(`${options.addressPath}.state`, formData, ''),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

export function validateMilitaryState(
  errors,
  state,
  formData,
  schema,
  messages,
  options,
) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(`${options.addressPath}.city`, formData, '')
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}

export function validateMilitaryTreatmentCity(
  errors,
  city,
  formData,
  schema,
  messages,
  index,
) {
  const isMilitaryState = MILITARY_STATE_VALUES.includes(
    _.get(
      `vaTreatmentFacilities[${index}].treatmentCenterAddress.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = MILITARY_CITIES.includes(city.trim().toUpperCase());
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
}

export function validateMilitaryTreatmentState(
  errors,
  state,
  formData,
  schema,
  messages,
  index,
) {
  const isMilitaryCity = MILITARY_CITIES.includes(
    _.get(
      `vaTreatmentFacilities[${index}].treatmentCenterAddress.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_VALUES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
}
export const validateIfHasEvidence = (
  errors,
  fieldData,
  formData,
  schema,
  messages,
  options,
  index,
) => {
  const { wrappedValidator } = options;
  if (_.get('view:hasEvidence', formData, true)) {
    wrappedValidator(errors, fieldData, formData, schema, messages, index);
  }
};

export const hasNewPtsdDisability = formData =>
  some(_.get('newDisabilities', formData, []), item => {
    let hasPtsd = false;
    if (item && typeof item.condition === 'string') {
      hasPtsd = item.condition.toLowerCase().includes(PTSD);
    }
    return hasPtsd;
  });
export const isInFuture = (err, fieldData) => {
  const fieldDate = new Date(fieldData);
  if (fieldDate.getTime() < Date.now()) {
    err.addError('Start date must be in the future');
  }
};
