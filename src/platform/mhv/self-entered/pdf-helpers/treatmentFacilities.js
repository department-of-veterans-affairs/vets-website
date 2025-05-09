export const generateTreatmentFacilitiesContent = record => {
  return {
    title: record.facilityName,
    details: [
      {
        items: [
          {
            title: 'Facility type',
            value: record.facilityType,
            inline: true,
          },
          {
            title: 'VA home facility',
            value: record.vaHomeFacility,
            inline: true,
          },
          {
            title: 'Phone number',
            value: record.phoneNumber,
            inline: true,
          },
          {
            title: 'Fax number',
            value: record.faxNumber,
            inline: true,
          },
          {
            title: 'Mailing address',
            value: record.mailingAddress,
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
