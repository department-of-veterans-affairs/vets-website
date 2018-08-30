// @flow
import _ from '../../../platform/utilities/data';

export const hasMilitaryRetiredPay = (data: {}): boolean => _.get('view:hasMilitaryRetiredPay', data, false);

export const hasSeparationPay = (data: {}): boolean => _.get('view:hasSeparationPay', data, false);

export const hasTrainingPay = (data: {}): boolean => _.get('view:hasTrainingPay', data, false);
