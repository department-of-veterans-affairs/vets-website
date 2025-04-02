export const generateMilitaryServiceContent = record => ({
  details: {
    sectionSeparators: false,
    items: [
      {
        monospace: true,
        lineGap: 0,
        value: record,
        indent: 16,
      },
    ],
  },
});
