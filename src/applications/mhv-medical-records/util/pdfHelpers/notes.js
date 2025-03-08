import { EMPTY_FIELD } from '../constants';

export const generateNotesIntro = record => {
  return {
    title: `${record.name}`,
    subject: 'VA Medical Record',
  };
};

export const generateDischargeSummaryContent = record => ({
  details: {
    header: 'Details',
    items: [
      {
        title: 'Date admitted',
        value: record.admissionDate,
        inline: true,
      },
      {
        title: 'Location',
        value: record.location,
        inline: true,
      },
      {
        title: 'Date discharged',
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
          title: 'Date entered',
          value: record.date,
          inline: true,
        },
        {
          title: 'Location',
          value: record.location,
          inline: true,
        },
        {
          title: 'Written by',
          value: record.writtenBy,
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
      header: 'Note',
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

  if (record.signedBy !== EMPTY_FIELD) {
    content.details.items.splice(3, 0, {
      title: 'Signed by',
      value: record.signedBy,
      inline: true,
    });
  }

  return content;
};
