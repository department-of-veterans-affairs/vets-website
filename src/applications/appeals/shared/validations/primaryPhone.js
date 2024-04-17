import errorMessages from '../content/errorMessages';
import { PRIMARY_PHONE } from '../constants';

export const missingPrimaryPhone = (error, _fieldData, formData) => {
  if (!formData?.[PRIMARY_PHONE]) {
    error.addError?.(errorMessages.missingPrimaryPhone);
  }
};
