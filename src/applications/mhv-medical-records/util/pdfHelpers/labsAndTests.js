export const generateLabsIntro = record => {
  return {
    title: `Lab and test results: ${record.name} on ${record.date}`,
    subject: 'VA Medical Record',
    preface:
      'If you have questions about these results, send a secure message to your care team.',
  };
};

export const generateChemHemContent = record => ({
  details: {
    header: 'Details about this test',
    items: [
      {
        title: 'Type of test',
        value: record.type,
        inline: true,
      },
      {
        title: 'Site or sample tested',
        value: record.sampleTested,
        inline: true,
      },
      {
        title: 'Ordered by',
        value: record.orderedBy,
        inline: true,
      },
      {
        title: 'Location',
        value: record.collectingLocation,
        inline: true,
      },
      {
        title: 'Lab comments',
        value: record.comments,
        inline: !record.comments,
      },
    ],
  },
  results: {
    header: 'Results',
    sectionSeparators: true,
    items: record.results.map(item => ({
      header: item.name,
      items: [
        {
          title: 'Result',
          value: item.result,
          inline: true,
        },
        {
          title: 'Reference range',
          value: item.standardRange,
          inline: true,
        },
        {
          title: 'Status',
          value: item.status,
          inline: true,
        },
        {
          title: 'Interpretation',
          value: item.labComments,
          inline: true,
        },
      ],
    })),
  },
});

export const generateMicrobioContent = record => {
  const data = {
    details: {
      header: 'Details about this test',
      sectionSeparators: true,
      items: [
        {
          title: 'Sample or sample tested',
          value: record.sampleTested,
          inline: true,
        },
        {
          title: 'Collection sample',
          value: record.sampleFrom,
          inline: true,
        },
        {
          title: 'Ordered by',
          value: record.orderedBy,
          inline: true,
        },
        {
          title: 'Location',
          value: record.collectingLocation,
          inline: true,
        },
        {
          title: 'Date completed',
          value: record.dateCompleted,
          inline: true,
        },
      ],
    },
    results: {
      header: 'Results',
      sectionSeparators: false,
      items: [
        {
          items: [
            {
              value: record.results,
              monospace: true,
            },
          ],
        },
      ],
    },
  };
  if (record.category) {
    data.details.items.unshift({
      title: 'Lab type',
      value: record.category,
      inline: true,
    });
  }
  return data;
};

export const generatePathologyContent = record => ({
  details: {
    header: 'Details about this test',
    items: [
      {
        title: 'Sample tested',
        value: record.sampleTested,
        inline: true,
      },
      {
        title: 'Location',
        value: record.labLocation,
        inline: true,
      },
      { title: 'Date completed', value: record.date, inline: true },
    ],
  },
  results: {
    header: 'Results',
    sectionSeparators: true,
    items: [
      {
        items: [
          {
            value: record.results,
            monospace: true,
          },
        ],
      },
    ],
  },
});

export const generateEkgContent = record => ({
  results: {
    sectionSeparators: true,
    items: [
      {
        items: [
          {
            title: 'Date',
            value: record.date,
            inline: true,
          },
          {
            title: 'Location',
            value: record.facility,
            inline: true,
          },
          {
            title: 'Provider',
            value: record.orderedBy,
            inline: true,
          },
        ],
      },
    ],
  },
});

export const generateRadiologyContent = record => ({
  details: {
    header: 'Details about this test',
    items: [
      {
        title: 'Reason for test',
        value: record.reason,
        inline: true,
      },
      {
        title: 'Clinical history',
        value: record.clinicalHistory,
        inline: true,
      },
      {
        title: 'Ordered by',
        value: record.orderedBy,
        inline: true,
      },
      {
        title: 'Imaging location',
        value: record.imagingLocation,
        inline: true,
      },
      {
        title: 'Imaging provider',
        value: record.imagingProvider,
        inline: true,
      },
    ],
  },
  results: {
    header: 'Results',
    sectionSeparators: true,
    items: [{ items: [{ value: record.results, monospace: true }] }],
  },
});
