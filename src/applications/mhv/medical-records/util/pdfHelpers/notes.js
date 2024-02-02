import { EMPTY_FIELD } from '../constants';

export const generateNotesIntro = record => {
  return {
    title: `${record.name} on ${record.date}`,
    subject: 'VA Medical Record',
    preface:
      'Review a summary of your stay at a hospital or other health facility (called an admission and discharge summary).',
  };
};

export const generateDischargeSummaryContent = record => ({
  details: {
    header: 'Details',
    items: [
      {
        title: 'Location',
        value: record.location,
        inline: true,
      },
      {
        title: 'Discharge date',
        value: record.dischargeDate,
        inline: true,
      },
      {
        title: 'Discharged by',
        value: record.dischargedBy,
        inline: true,
      },
    ],
  },
  results: {
    header: 'Summary',
    items: [
      {
        items: [
          {
            value: record.summary,
          },
        ],
      },
    ],
  },
});

export const generateProgressNoteContent = record => {
  const content = {
    details: {
      header: 'Details',
      items: [
        {
          title: 'Location',
          value: record.location,
          inline: true,
        },
        {
          title: 'Signed by',
          value: record.signedBy,
          inline: true,
        },
        {
          title: 'Date signed',
          value: record.dateSigned,
          inline: true,
        },
      ],
    },
    results: {
      header: 'Notes',
      items: [
        {
          items: [
            {
              value: record.note,
            },
          ],
        },
      ],
    },
  };

  if (record.coSignedBy !== EMPTY_FIELD) {
    content.details.items.splice(2, 0, {
      title: 'Co-signed by',
      value: record.coSignedBy,
      inline: true,
    });
  }

  return content;
};
