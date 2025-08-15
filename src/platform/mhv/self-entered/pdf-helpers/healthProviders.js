export const generateHealthProvidersContent = record => {
  return {
    title: record.providerName,
    details: [
      {
        items: [
          {
            title: 'Type of provider',
            value: record.typeOfProvider,
            inline: true,
          },
          {
            title: 'Other clinical information',
            value: record.otherClinicianInformation,
            inline: true,
          },
          {
            title: 'Phone number',
            value: record.phoneNumber,
            inline: true,
          },
          {
            title: 'Email',
            value: record.email,
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
