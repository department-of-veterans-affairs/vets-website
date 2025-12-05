const normalizeString = value => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const toArray = value => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    if (Array.isArray(value.data)) {
      return value.data;
    }

    if (Array.isArray(value.records)) {
      return value.records;
    }

    if (Array.isArray(value.items)) {
      return value.items;
    }
  }

  return [];
};

export const extractDisabilityLabels = fullData => {
  const candidates = toArray(fullData?.disabilityDescription || []);

  const labels = candidates
    .map(entry => {
      if (typeof entry === 'string') {
        return entry;
      }

      if (entry && typeof entry === 'object') {
        return entry.disability || entry.name;
      }

      return undefined;
    })
    .map(normalizeString)
    .filter(Boolean);

  return Array.from(new Set(labels));
};

export default extractDisabilityLabels;
