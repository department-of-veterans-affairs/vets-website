import React from 'react';

const useOpenClaimsOrAppealsCount = (appealsData, claimsData) => {
  return React.useMemo(
    () => {
      // TODO: confirm that there aren't other ways an appeal can be open/close
      const openAppeals = appealsData.filter(appeal => {
        return appeal.attributes?.active;
      });
      // TODO: confirm that there aren't other ways a claim can be open/close
      const openClaims = claimsData.filter(claim => {
        return claim.attributes?.open;
      });
      return openAppeals.length + openClaims.length;
    },
    [appealsData, claimsData],
  );
};

export default useOpenClaimsOrAppealsCount;
