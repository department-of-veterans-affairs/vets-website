const getClaimList = () => {
  return import('./claims/claims-list.json');
};

const getClaimDetails = id => {
  return import(`./claims/${id}.json`).catch(() => {
    return import('./claims/phase3.json');
  });
};

const getStemClaimList = () => {
  return import('./stem-claims/claims-list.json');
};

export const mockApi = {
  getClaimDetails,
  getClaimList,
  getStemClaimList,
};
