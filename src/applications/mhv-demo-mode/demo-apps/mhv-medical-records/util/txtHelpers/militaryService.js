export const parseMilitaryService = (records, index = 10) => {
  const militaryServiceText = records;

  return `
${index}) Military Service

Title: DOD Military Service Information

${militaryServiceText}
`;
};
