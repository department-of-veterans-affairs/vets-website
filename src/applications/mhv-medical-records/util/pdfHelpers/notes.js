import { EMPTY_FIELD } from '../constants';

export const generateNotesIntro = record => {
  return {
    title: `Care summaries and notes: ${record.name}`,
    subject: 'VA Medical Record',
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
        title: 'Admission date',
        value: record.admissionDate,
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
            monospace: true,
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
          title: 'Date',
          value: record.date,
          inline: true,
        },
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
              monospace: true,
            },
          ],
        },
      ],
    },
  };

  if (record.coSignedBy !== EMPTY_FIELD) {
    content.details.items.splice(3, 0, {
      title: 'Co-signed by',
      value: record.coSignedBy,
      inline: true,
    });
  }

  return content;
};
