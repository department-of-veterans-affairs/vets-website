export const buildOperatingStatusProps = attrs => {
  const { opStatus, opStatusExtra } = attrs;
  let statusLabel;
  let statusType;

  // opStatus here is not from lighthouse so it is lowercase
  if (opStatus === 'normal') {
    return;
  }

  switch (opStatus) {
    case 'limited':
      statusLabel = 'Limited services and hours';
      statusType = 'info';
      break;
    case 'closed':
      statusLabel = 'Facility closed';
      statusType = 'warning';
      break;
    case 'coming_soon':
      statusLabel = 'Coming soon';
      statusType = 'warning';
      break;
    case 'temporary_closure':
      statusLabel = 'Temporary facility closure';
      statusType = 'warning';
      break;
    case 'temporary_location':
      statusLabel = 'Temporary location';
      statusType = 'warning';
      break;
    case 'virtual_care':
      statusLabel = 'Virtual care only';
      statusType = 'warning';
      break;
    default:
      // ex: notice
      statusLabel = 'Facility notice';
      statusType = 'info';
  }

  // eslint-disable-next-line consistent-return
  return {
    operatingStatusFacility: opStatus,
    statusLabel,
    extraInfo: opStatusExtra,
    statusType,
  };
};
