import _ from '../../../platform/utilities/data';

export const hasMilitaryRetiredPay = (data) => _.get('view:hasMilitaryRetiredPay', data, false);

export const hasSeparationPay = (data) => _.get('view:hasSeparationPay', data, false);

export const hasTrainingPay = (data) => _.get('view:hasTrainingPay', data, false);

export const hasRatedDisabilities = (data) => !!_.get('ratedDisabilities', data, []).length;
