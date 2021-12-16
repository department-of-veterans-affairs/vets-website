import React from 'react';
import moment from 'moment';

const isWithinPast30Days = date => {
  return moment(date).isAfter(
    moment()
      .endOf('day')
      .subtract(30, 'days'),
  );
};

const getAppealUpdateDate = appeal => {
  const appealEvents = appeal?.attributes.events || [];
  return appealEvents[appealEvents.length - 1]?.date;
};

const getClaimUpdateDate = claim => {
  let updateDate;
  const filedDate = claim?.attributes.dateFiled;
  const changeDate = claim?.attributes.phaseChangeDate;
  if (changeDate && filedDate) {
    updateDate =
      new Date(filedDate).getTime() > new Date(changeDate).getTime()
        ? filedDate
        : changeDate;
  } else {
    updateDate = changeDate || filedDate;
  }
  return updateDate;
};

const useHighlightedClaimOrAppeal = (appealsData, claimsData) => {
  // the appeals data sorted with the most recently updated appeal first
  const sortedAppeals = React.useMemo(
    () => {
      // Array sorting is done in place. Sorting `appealsData` directly was
      // leading to odd behavior. So copy the appealsData before sorting
      const appealsDataCopy = [...appealsData];
      return appealsDataCopy.sort((a, b) => {
        const appealAUpdatedAt = getAppealUpdateDate(a);
        const appealBUpdatedAt = getAppealUpdateDate(b);
        return new Date(appealAUpdatedAt).getTime() >
          new Date(appealBUpdatedAt).getTime()
          ? -1
          : 1;
      });
    },
    [appealsData],
  );

  // the claims data sorted with the most recently updated claim first
  const sortedClaims = React.useMemo(
    () => {
      // Array sorting is done in place. Sorting `claimsData` directly was
      // leading to odd behavior. So copy the claimsData before sorting
      const claimsDataCopy = [...claimsData];
      return claimsDataCopy.sort((a, b) => {
        return new Date(getClaimUpdateDate(a)).getTime() >
          new Date(getClaimUpdateDate(b)).getTime()
          ? -1
          : 1;
      });
    },
    [claimsData],
  );

  // the most recently updated claim or appeal that has been updated in the past
  // 30 days
  return React.useMemo(
    () => {
      let result;
      let mostRecentAppeal =
        (sortedAppeals.length > 0 && sortedAppeals[0]) || null;
      let mostRecentClaim =
        (sortedClaims.length > 0 && sortedClaims[0]) || null;

      if (!isWithinPast30Days(getAppealUpdateDate(mostRecentAppeal))) {
        mostRecentAppeal = null;
      }
      if (!isWithinPast30Days(getClaimUpdateDate(mostRecentClaim))) {
        mostRecentClaim = null;
      }

      const mostRecentAppealDate = getAppealUpdateDate(mostRecentAppeal) || 0;
      const mostRecentClaimDate = getClaimUpdateDate(mostRecentClaim) || 0;

      if (
        new Date(mostRecentAppealDate).getTime() >
        new Date(mostRecentClaimDate).getTime()
      ) {
        result = mostRecentAppeal;
      } else {
        result = mostRecentClaim;
      }

      return result;
    },
    [sortedAppeals, sortedClaims],
  );
};

export default useHighlightedClaimOrAppeal;
