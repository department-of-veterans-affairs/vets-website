import _ from '../../../platform/utilities/data';

export const hasMilitaryRetiredPay = (data) => _.get('view:hasMilitaryRetiredPay', data, false);

export const hasSeparationPay = (data) => _.get('view:hasSeparationPay', data, false);
