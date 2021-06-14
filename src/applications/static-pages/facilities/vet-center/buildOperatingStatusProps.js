export const buildOperatingStatusProps = attrs => {
  const { opStatus, opStatusExtra } = attrs;

  let status;
  let iconType;

  switch (opStatus) {
    case 'limited':
      status = 'Limited services and hours';
      iconType = 'triangle';
      break;
    case 'closed':
      status = 'Facility closed';
      iconType = 'circle';
      break;
    case 'notice':
      status = 'Facility notice';
      iconType = 'circle';
      break;
    default:
      status = 'Facility status';
      iconType = 'triangle';
  }

  return {
    operatingStatusFacility: opStatus,
    statusLabel: status,
    iconType,
    extraInfo: opStatusExtra,
  };
};
