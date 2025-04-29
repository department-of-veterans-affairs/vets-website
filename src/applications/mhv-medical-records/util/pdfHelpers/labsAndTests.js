export const generateLabsIntro = record => {
  return {
    title: `Lab and test results: ${record.name}`,
    subject: 'VA Medical Record',
    subtitles: [
      'If you have questions about these results, send a secure message to your care team.',
    ],
  };
};

export const generateChemHemContent = record => ({
  details: {
    header: 'Details about this test',
    items: [
      {
        title: 'Date and time collected',
        value: record.date,
        inline: true,
      },
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
        inline: true,
      },
    ],
  },
  results: {
    header: 'Results',
    preface: [
      {
        prefaceOptions: { paragraphGap: 20 },
        value:
          'If your results are outside the reference range (the expected range for that test), your results may include a word like “high” or “low.” But this doesn’t automatically mean you have a health problem.',
      },
      {
        prefaceOptions: { paragraphGap: 20 },
        value:
          'Your provider will review your results. If you need to do anything, your provider will contact you.',
      },
    ],
    sectionSeparators: false,
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
          title: 'Lab comments',
          value: item.labComments,
          inline: true,
        },
      ],
    })),
  },
});

export const generateMicrobioContent = record => {
  const content = {
    details: {
      header: 'Details about this test',
      sectionSeparators: false,
      items: [
        {
          title: 'Date and time collected',
          value: record.date,
          inline: true,
        },
        {
          title: 'Site or sample tested',
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
      preface: {
        prefaceOptions: { paragraphGap: 20 },
        value:
          'Your provider will review your results. If you need to do anything, your provider will contact you. If you have questions, send a message to the care team that ordered this test.',
      },
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

  if (record.name !== 'Microbiology' && record.labType) {
    content.details.items.unshift({
      title: 'Lab type',
      value: record.labType,
      inline: true,
    });
  }
  return content;
};

export const generatePathologyContent = record => ({
  details: {
    header: 'Details about this test',
    items: [
      {
        title: 'Date and time collected',
        value: record.dateCollected,
        inline: true,
      },
      {
        title: 'Site or sample tested',
        value: record.sampleTested,
        inline: true,
      },
      {
        title: 'Collection sample',
        value: record.sampleFrom,
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
    preface: [
      {
        prefaceOptions: { paragraphGap: 20 },
        value:
          'Your provider will review your results. If you need to do anything, your provider will contact you. If you have questions, send a message to the care team that ordered this test.',
      },
      {
        prefaceOptions: { paragraphGap: 20 },
        value:
          'Note: If you have questions about more than 1 test ordered by the same care team, send 1 message with all of your questions.',
      },
    ],
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
});

export const generateEkgContent = record => ({
  results: {
    sectionSeparators: false,
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
        title: 'Date and time performed',
        value: record.date,
        inline: true,
      },
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
      {
        title: 'Images',
        value: `Images are not yet available in this new medical records tool. To get images, you'll need to request them in the previous version of medical records on the My HealtheVet website.`,
        inline: true,
      },
    ],
  },
  results: {
    header: 'Results',
    sectionSeparators: false,
    items: [{ items: [{ value: record.results, monospace: true }] }],
  },
});
