const getStatus = appointment => {
  return appointment ? appointment.status : null;
};

const getStartTime = appointment => {
  return appointment ? appointment.start : null;
};

export { getStatus, getStartTime };
