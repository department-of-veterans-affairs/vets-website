const getStatus = appointment => {
  return appointment?.status;
};

const getStartTime = appointment => {
  return appointment?.start;
};

export { getStatus, getStartTime };
