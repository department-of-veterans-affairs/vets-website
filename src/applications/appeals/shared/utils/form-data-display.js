import { NOT_ANSWERED } from '../../995/constants';

export const convertBoolResponseToYesNo = response => {
  if (typeof response !== 'boolean') {
    return NOT_ANSWERED;
  }

  return response ? 'Yes' : 'No';
};
