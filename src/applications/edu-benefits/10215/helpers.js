export const getFTECalcs = program => {
  const supported = Number(program?.fte?.supported) || 0;
  const nonSupported = Number(program?.fte?.nonSupported) || 0;
  const total = supported + nonSupported;
  const supportedFTEPercent =
    Number.isNaN(total) || supported === 0 || total === 0
      ? null
      : `${((supported / total) * 100).toFixed(2).replace(/[.,]00$/, '')}%`;
  return {
    supported,
    nonSupported,
    total,
    supportedFTEPercent,
  };
};
