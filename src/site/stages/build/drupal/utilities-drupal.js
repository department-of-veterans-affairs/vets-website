function facilityLocationPath(regionPath, apiId, nickname) {
  let facilityPath;
  if (nickname) {
    facilityPath = nickname.replace(/\s+/g, '-').toLowerCase();
  } else {
    facilityPath = apiId;
  }

  return `${regionPath}/locations/${facilityPath}`;
}

module.exports = facilityLocationPath;
