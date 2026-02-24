import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { NON_DIGIT_REGEX, LOAN_INTENT, TOGGLE_KEY } from '../constants';

export const replaceNonDigits = number =>
  (number || '').replace(NON_DIGIT_REGEX, '');

export const customCOEsubmit = (formConfig, form) => {
  const formCopy = cloneDeep(form);

  const { periodsOfService = [], relevantPriorLoans = [] } = formCopy.data;

  const isoDateString = (dateString = '') => {
    const [year, month, setDay = ''] = dateString.split('-');
    // set day to the 1st when not set
    const day = setDay === 'XX' ? '01' : setDay.padStart(2, '0');
    // using new Date().toISOString() includes the timezone offset, so we're building it
    return dateString
      ? `${year}-${month.padStart(2, '0')}-${day}T00:00:00.000Z`
      : '';
  };

  const formattedForm = {
    ...formCopy,
    data: {
      ...form.data,
      periodsOfService: periodsOfService.map(period => ({
        ...period,
        dateRange: {
          from: isoDateString(period.dateRange.from),
          to: isoDateString(period.dateRange.to),
        },
      })),
      relevantPriorLoans: relevantPriorLoans.map(loan => ({
        ...loan,
        dateRange: {
          from: isoDateString(loan.dateRange.from),
          to: isoDateString(loan.dateRange.to),
        },
        vaLoanNumber: replaceNonDigits(loan.vaLoanNumber),
      })),
      version: formCopy.data[`view:${TOGGLE_KEY}`] ? 2 : 1,
    },
  };

  // transformForSubmit returns a JSON string
  const formData = transformForSubmit(formConfig, formattedForm);

  return JSON.stringify({
    lgyCoeClaim: {
      form: formData,
    },
  });
};

export const getLoanIntent = value =>
  Object.values(LOAN_INTENT).find(type => type.value === value);
