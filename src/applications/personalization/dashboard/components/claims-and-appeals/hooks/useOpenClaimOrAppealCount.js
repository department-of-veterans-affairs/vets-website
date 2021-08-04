import React from 'react';

const useOpenClaimsOrAppealsCount = (appealsData, claimsData) => {
  return React.useMemo(
    () => {
      const openAppeals = appealsData.filter(appeal => {
        return appeal.attributes?.active;
      });
      const openClaims = claimsData.filter(claim => {
        return claim.attributes?.open;
      });
      return openAppeals.length + openClaims.length;
    },
    [appealsData, claimsData],
  );
};

export default useOpenClaimsOrAppealsCount;
