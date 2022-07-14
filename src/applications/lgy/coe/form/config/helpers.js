import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';

export const customCOEsubmit = (formConfig, form) => {
  const formCopy = cloneDeep(form);

  const { periodsOfService = [], relevantPriorLoans = [] } = formCopy.data;

  const formattedForm = {
    ...formCopy,
    data: {
      ...form.data,
      periodsOfService: periodsOfService.map(period => ({
        ...period,
        dateRange: {
          from: new Date(period.dateRange.from).toISOString(),
          to: new Date(period.dateRange.to).toISOString(),
        },
      })),
      relevantPriorLoans: relevantPriorLoans.map(loan => {
        const [fromYear, fromMonth] = loan.dateRange.from.split('-');
        const [toYear, toMonth] = loan.dateRange.to.split('-');
        return {
          ...loan,
          dateRange: {
            //  our form months are 1-12 (Jan-Dec) but a Date() month starts 0
            from: new Date(fromYear, fromMonth - 1).toISOString(),
            to: new Date(toYear, toMonth - 1).toISOString(),
          },
        };
      }),
    },
  };

  const formData = transformForSubmit(formConfig, formattedForm);

  return JSON.stringify({
    lgyCoeClaim: {
      form: formData,
    },
  });
};

export const updateFilesSchema = (formData, filesSchema) => {
  const schemaCopy = { ...filesSchema };
  const files = formData.files || [];
  files.forEach((file, index) => {
    schemaCopy.items[index].required = ['attachmentType'];
    if (file.attachmentType === 'Other') {
      schemaCopy.items[index].required.push('attachmentDescription');
    }
  });
  return schemaCopy;
};
