import { formatDateLong } from 'platform/utilities/date';

export const formatDate = isoString => {
  try {
    if (
      !isoString ||
      isoString === 'N/A' ||
      isoString === '-' ||
      isoString === null
    ) {
      return 'N/A';
    }

    const trimmed = isoString.replace('Z', '');
    return formatDateLong(trimmed);
  } catch (e) {
    return 'N/A';
  }
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

export const pickStatusStyle = status => {
  const s = String(status)
    .trim()
    .toLowerCase();
  return s === 'eligible'
    ? { icon: 'check', cls: 'vads-u-color--green' }
    : { icon: 'close', cls: 'vads-u-color--secondary-dark' };
};
