export const getFullName = fullName => {
  if (!fullName) return null;

  const first = (fullName?.first || '').trim();
  const middle = (fullName?.middle || '').trim();
  const last = (fullName?.last || '').trim();

  return [first, middle, last].filter(Boolean).join(' ');
};

export const organizationRepresentativesArrayOptions = {
  arrayPath: 'representatives',
  nounSingular: 'representative',
  nounPlural: 'representatives',
  required: true,
  isItemIncomplete: item => !item?.fullName?.first || !item?.fullName?.last,
  text: {
    cancelAddButtonText: () => 'Cancel adding this individual’s information',
    cancelEditButtonText: () => 'Cancel editing this individual’s information',
    getItemName: item => getFullName(item?.fullName),
    cardDescription: (item, index, fullData) =>
      fullData?.organizationName || '',
    summaryTitle: 'Review the names of organization’s representatives',
  },
};
