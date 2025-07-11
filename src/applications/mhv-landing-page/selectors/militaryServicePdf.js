export const militaryServiceLoading = state => {
  return state?.myHealth?.militaryServicePdf?.loading;
};

export const militaryServiceSuccessfulDownload = state => {
  return state?.myHealth?.militaryServicePdf?.successfulDownload;
};

export const militaryServiceFailedDownload = state => {
  return state?.myHealth?.militaryServicePdf?.failedDownload;
};
