export const buildOperatingStatusProps = attrs => {
  const { opStatus, opStatusExtra } = attrs;

  let status;
  let iconType;

  switch (opStatus) {
    case 'limited':
      status = 'Limited services and hours';
      iconType = 'info-circle';
      break;
    case 'closed':
      status = 'Facility closed';
      iconType = 'exclamation-circle';
      break;
    case 'notice':
      status = 'Facility notice';
      iconType = 'exclamation-circle';
      break;
    default:
      status = 'Facility status';
      iconType = 'exclamation-triangle';
  }

  return {
    operatingStatusFacility: opStatus,
    statusLabel: status,
    iconType,
    extraInfo: opStatusExtra,
  };
};
