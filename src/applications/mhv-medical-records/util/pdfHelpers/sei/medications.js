export const generateMedicationsContent = record => {
  return {
    title: record.drugName,
    details: [
      {
        items: [
          {
            title: 'Category',
            value: record.category,
            inline: true,
          },
          {
            title: 'Prescription number',
            value: record.prescriptionNumber,
            inline: true,
          },
          {
            title: 'Strength',
            value: record.strength,
            inline: true,
          },
          {
            title: 'Dose',
            value: record.dose,
            inline: true,
          },
          {
            title: 'Frequency',
            value: record.frequency,
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
            title: 'Pharmacy name',
            value: record.pharmacyName,
            inline: true,
          },
          {
            title: 'Pharmacy phone',
            value: record.pharmacyPhone,
            inline: true,
          },
          {
            title: 'Reason for taking',
            value: record.reasonForTaking,
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
