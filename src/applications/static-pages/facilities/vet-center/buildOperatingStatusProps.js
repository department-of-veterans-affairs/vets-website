export const buildOperatingStatusProps = attrs => {
  const { opStatus, opStatusExtra } = attrs;
  let statusLabel;
  let iconType;
  let statusType;

  if (opStatus === 'normal') {
    return;
  }

  switch (opStatus) {
    case 'limited':
      statusLabel = 'Limited services and hours';
      iconType = 'info-circle';
      statusType = 'warning';
      break;
    case 'closed':
      statusLabel = 'Facility closed';
      iconType = 'exclamation-circle';
      statusType = 'error';
      break;
    case 'notice':
      statusLabel = 'Facility notice';
      iconType = 'exclamation-circle';
      statusType = 'info';
      break;
    default:
      statusLabel = 'Facility status';
      iconType = 'exclamation-triangle';
      statusType = 'info';
  }

  // eslint-disable-next-line consistent-return
  return {
    operatingStatusFacility: opStatus,
    statusLabel,
    iconType,
    extraInfo: opStatusExtra,
    statusType,
  };
};
