const error = {
  errors: [
    {
      title: 'Not authorized',
      detail: 'Not authorized',
      code: '401',
      status: '401',
    },
  ],
};

const refreshExtractTypes = {
  ALLERGY: 'Allergy',
  IMAGING: 'ImagingStudy',
  VPR: 'VPR',
  CHEM_HEM: 'ChemistryHematology',
};

const minutesAgo = (date, minutes) => {
  return new Date(date.getTime() - minutes * 60 * 1000).getTime();
};

const mockStatusResponse = (retrieved, requested, completed, successful) => {
  const now = new Date();
  return {
    retrievedDate: minutesAgo(now, retrieved),
    lastRefreshDate: null,
    facilityExtractStatusList: Object.values(refreshExtractTypes).map(type => ({
      extract: type,
      lastRequested: minutesAgo(now, requested),
      lastCompleted: minutesAgo(now, completed),
      lastSuccessfulCompleted: minutesAgo(now, successful),
    })),
  };
};

const phrRefreshInProgressNoNewRecords = (req, res) => {
  return res.json(mockStatusResponse(0, 10, 5, 5));
};

module.exports = {
  error,
  phrRefreshInProgressNoNewRecords,
};
