import { formatDateLong } from 'platform/utilities/date';

export const formatDate = isoString => {
  if (!isoString || isoString === 'N/A') return 'N/A';
  const trimmed = isoString.replace('Z', '');
  return formatDateLong(trimmed);
};

export const extractMessages = resp => {
  const list = Array.isArray(resp?.errors) ? resp.errors : [];
  const msgs = list.map(e => e?.code || e?.title || e?.detail).filter(Boolean);
  return msgs.length ? msgs : ['Unknown error'];
};

export const getStatus = resp => {
  const n = Number(resp?.errors?.[0]?.status);
  return Number.isFinite(n) ? n : null;
};
