const getClaimList = () => {
  return import('./claims-list.json');
};

const getClaimDetails = id => {
  return import(`./${id}.json`).catch(() => {
    return import('./phase3.json');
  });
};

export const mockApi = {
  getClaimDetails,
  getClaimList,
};
