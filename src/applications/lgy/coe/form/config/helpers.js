import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';

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
      })),
    },
  };

  // transformForSubmit returns a JSON string
  const formData = JSON.parse(transformForSubmit(formConfig, formattedForm));

  return JSON.stringify({
    lgyCoeClaim: {
      form: formData,
    },
  });
};

export const validateDocumentDescription = (errors, fileList) => {
  fileList.forEach((file, index) => {
    const error =
      file.attachmentType === 'Other' && !file.attachmentDescription
        ? 'Please provide a description'
        : null;
    if (error && !errors[index]) {
      /* eslint-disable no-param-reassign */
      errors[index] = {
        attachmentDescription: {
          __errors: [],
          addError(msg) {
            this.__errors.push(msg);
          },
        },
      };
      /* eslint-enable no-param-reassign */
    }
    if (error) {
      errors[index].attachmentDescription.addError(error);
    }
  });
};
