export const generateHealthInsuranceContent = record => {
  return {
    title: record.healthInsuranceCompany,
    details: [
      {
        items: [
          {
            title: 'ID number',
            value: record.idNumber,
            inline: true,
          },
          {
            title: 'Group number',
            value: record.groupNumber,
            inline: true,
          },
          {
            title: 'Primary insurance provider',
            value: record.primaryInsuranceProvider,
            inline: true,
          },
          {
            title: 'Start date',
            value: record.startDate,
            inline: true,
          },
          {
            title: 'Stop date',
            value: record.stopDate,
            inline: true,
          },
          {
            title: 'Insured',
            value: record.insured,
            inline: true,
          },
          {
            title: 'Pre-approval phone number',
            value: record.preApprovalPhoneNumber,
            inline: true,
          },
          {
            title: 'Health insurance company phone number',
            value: record.healthInsCoPhoneNumber,
            inline: true,
          },
          {
            title: 'Comments',
            value: record.comments,
            inline: true,
          },
        ],
      },
    ],
  };
};
