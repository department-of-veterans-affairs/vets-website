export const generateAccountSummaryContent = record => {
  const { authenticationSummary = {}, vaTreatmentFacilities = [] } = record;

  return {
    details: {
      items: [
        {
          title: 'Source',
          value: authenticationSummary.source,
          inline: true,
        },
        {
          title: 'Authentication status',
          value: authenticationSummary.authenticationStatus,
          inline: true,
        },
        {
          title: 'Authentication date',
          value: authenticationSummary.authenticationDate,
          inline: true,
        },
        {
          title: 'Authentication facility name',
          value: authenticationSummary.authenticationFacilityName,
          inline: true,
        },
        {
          title: 'Authentication facility ID',
          value: authenticationSummary.authenticationFacilityID,
          inline: true,
        },
      ],
    },
    results: {
      header: 'VA treatment facilities',
      headerType: 'H3',
      headerIndent: 30,
      sectionSeparators: false,
      items: vaTreatmentFacilities.map(facility => ({
        header: facility.facilityName,
        headerType: 'H4',
        headerGap: 6,
        items: [
          {
            title: 'Type',
            value: facility.type,
            inline: true,
          },
        ],
      })),
    },
  };
};
