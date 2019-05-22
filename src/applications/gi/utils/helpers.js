import environment from 'platform/utilities/environment';

export function formatNumber(value) {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
}

export function formatCurrency(value) {
  return `$${formatNumber(Math.round(+value))}`;
}

export function getAverageBah(constant) {
  if (!environment.isProduction()) {
    return constant.AVGDODBAH && constant.AVGDODBAH < constant.AVGVABAH
      ? constant.AVGDODBAH
      : constant.AVGVABAH;
  }
  return constant.AVGDODBAH && constant.AVGDODBAH < constant.AVGBAH
    ? constant.AVGDODBAH
    : constant.AVGBAH;
}
