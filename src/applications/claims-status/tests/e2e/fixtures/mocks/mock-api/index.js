import { format } from 'date-fns';

const injectRecentlyClosedClaim = claims => {
  const closedClaim = claims.find(claim => claim.id === 'closed');
  const clone = JSON.parse(JSON.stringify(closedClaim));

  clone.id = 'recently-closed';
  clone.attributes.phaseChangeDate = format(new Date(), 'yyyy-MM-dd');

  claims.push(clone);
};

const getClaimList = () => {
  return import('./claims/claims-list.json').then(response => {
    // The UI currently only shows some elements when there are claims
    // that have been closed in the past 30 days. It's not feasible to
    // constantly update the mock data so we create a new claim based
    // on an existing one and inject it into the list
    injectRecentlyClosedClaim(response.data);

    return response;
  });
};

const getClaimDetails = id => {
  // Special case for setting up a recently closed claim
  if (id === 'recently-closed') {
    return import('./claims/closed.json').then(response => {
      const { data } = response;
      data.id = 'recently-closed';
      data.attributes.phaseChangeDate = format(new Date(), 'yyyy-MM-dd');

      return response;
    });
  }

  // Normal case
  // If a file with name {id}.json is not found, fall back to phase3.json
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
