import { NOT_ANSWERED } from '../constants';

export const convertBoolResponseToYesNo = response => {
  if (typeof response !== 'boolean') {
    return NOT_ANSWERED;
  }

  return response ? 'Yes' : 'No';
};
