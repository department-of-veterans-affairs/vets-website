export const buildVaAlertExpandableProps = attrs => {
  const { opStatus, opStatusLabel, opStatusExtra } = attrs;
  let iconType;

  if (opStatus === 'default') {
    return;
  }

  switch (opStatus) {
    case 'error':
      iconType = 'exclamation-circle';
      break;
    case 'warning':
      iconType = 'exclamation-triangle';
      break;
    case 'info':
      iconType = 'info-circle';
      break;
    default:
      iconType = 'info-circle';
  }

  // eslint-disable-next-line consistent-return
  return {
    expandableSupplementalStatus: opStatus,
    statusLabel: opStatusLabel,
    iconType,
    extraInfo: opStatusExtra,
  };
};
