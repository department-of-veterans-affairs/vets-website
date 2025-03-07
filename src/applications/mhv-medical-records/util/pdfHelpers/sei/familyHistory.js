export const generateFamilyHistoryContent = record => {
  return {
    title: record.relationship,
    details: [
      {
        items: [
          {
            title: 'First name',
            value: record.firstName,
            inline: true,
          },
          {
            title: 'Last name',
            value: record.lastName,
            inline: true,
          },
          {
            title: 'Living or deceased',
            value: record.livingOrDeceased,
            inline: true,
          },
          {
            title: 'Health issues',
            value: record.healthIssues,
            inline: true,
          },
          {
            title: 'Other health issues',
            value: record.otherHealthIssues,
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
