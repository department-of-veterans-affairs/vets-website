export const truncateMiddleName = name => {
  if (!name?.middle) return name;
  return {
    ...name,
    middle: name.middle.charAt(0),
  };
};

export const truncateName = (name, firstMax, middleMax, lastMax) => {
  if (!name) return name;
  return {
    ...name,
    first: name.first?.substring(0, firstMax),
    middle: name.middle?.substring(0, middleMax),
    last: name.last?.substring(0, lastMax),
  };
};

export const combineCityState = (city, stateOrCountry) => {
  if (!city && !stateOrCountry) return '';
  if (city && stateOrCountry) {
    return `${city}, ${stateOrCountry}`;
  }
  return city || stateOrCountry;
};

export const combineMarriageDates = (startDate, endDate) => {
  if (!startDate && !endDate) return '';
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }
  return startDate || endDate;
};

export const buildChildStatus = child => {
  const statusParts = [];
  if (child?.relationship) {
    statusParts.push(child.relationship);
  }
  if (child?.inSchool) {
    statusParts.push('18-23_YEARS_OLD');
  }
  if (child?.seriouslyDisabled) {
    statusParts.push('SERIOUSLY_DISABLED');
  }
  if (child?.hasBeenMarried) {
    statusParts.push('CHILD_PREVIOUSLY_MARRIED');
  }
  if (!child?.livesWith) {
    statusParts.push('DOES_NOT_LIVE_WITH_SPOUSE');
  }
  return statusParts;
};
