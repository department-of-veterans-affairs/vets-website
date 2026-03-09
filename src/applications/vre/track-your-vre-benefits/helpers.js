export const extractMessages = resp => {
  const list = Array.isArray(resp?.errors) ? resp.errors : [];
  const msgs = list.map(e => e?.code || e?.title || e?.detail).filter(Boolean);
  return msgs.length ? msgs : ['Unknown error'];
};

export const getStatus = resp => {
  const n = Number(resp?.errors?.[0]?.status);
  return Number.isFinite(n) ? n : null;
};

export const downloadPdfBlob = (blob, filename) => {
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = downloadUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);

  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);
};

export const getCurrentStepFromStateList = (stateList = [], total) => {
  if (!Array.isArray(stateList) || stateList.length === 0) return 1;

  const activeIndex = stateList.findIndex(s => s?.status === 'ACTIVE');
  if (activeIndex >= 0) return Math.min(activeIndex + 1, total);

  const firstPendingIndex = stateList.findIndex(s => s?.status === 'PENDING');
  if (firstPendingIndex >= 0) return Math.min(firstPendingIndex + 1, total);

  return total;
};
