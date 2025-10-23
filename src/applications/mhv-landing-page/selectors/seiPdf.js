export const seiLoading = state => {
  return state?.myHealth?.seiPdf?.loading;
};

export const seiFailedDomains = state => {
  return state?.myHealth?.seiPdf?.failedDomains;
};

export const seiSuccessfulDownload = state => {
  return state?.myHealth?.seiPdf?.successfulDownload;
};

export const seiFailedDownload = state => {
  return state?.myHealth?.seiPdf?.failedDownload;
};
