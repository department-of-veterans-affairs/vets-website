// Flat map from the single expected IDP title-case value to the 534 form value.
// Lookup is case-insensitive to handle minor casing variations from the IDP.
const BRANCH_MAP = {
  Army: 'army',
  Navy: 'navy',
  'Air Force': 'airForce',
  'Coast Guard': 'coastGuard',
  'Marine Corps': 'marineCorps',
  'Space Force': 'spaceForce',
  USPHS: 'usphs',
  NOAA: 'noaa',
};

const BRANCH_MAP_LOWER = Object.fromEntries(
  Object.entries(BRANCH_MAP).map(([k, v]) => [k.toLowerCase(), v]),
);

// Maps an IDP branch-of-service string to the 534 form value, or null if
// the value is not a recognized branch name.
export const normalizeBranchOfService = v => {
  if (v == null) return null;
  if (typeof v === 'string' && v.trim() === '') return '';
  return BRANCH_MAP_LOWER[v.trim().toLowerCase()] ?? null;
};

const normalizeString = v => {
  if (v == null) return null;
  return typeof v === 'string' ? v.trim() : String(v).trim();
};

const normalizeDigits = v => (v || '').replace(/\D/g, '');

// Normalizes SSN to a bare 9-digit string (matching the 534 form's storage
// format). Returns null for values that don't produce exactly 9 digits, ''
// for blank fields (field was present but left empty in the document).
const normalizeSsn = v => {
  if (v == null) return null;
  if (typeof v === 'string' && v.trim() === '') return '';
  const digits = normalizeDigits(v);
  return digits.length === 9 ? digits : null;
};

// Converts MM-DD-YYYY artifact dates to ISO YYYY-MM-DD.
// Returns null for unparseable/invalid values, '' for blank fields.
const normalizeArtifactDate = v => {
  if (v == null) return null;
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  if (!trimmed) return '';
  const parts = trimmed.split('-');
  if (parts.length !== 3) return null;
  const [m, d, y] = parts;
  if (!y || y.length !== 4) return null;
  const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  return Number.isNaN(new Date(iso).getTime()) ? null : iso;
};

const normalizeDd214Entry = entry => ({
  ...entry,
  FIRST_NAME: normalizeString(entry.FIRST_NAME),
  MIDDLE_NAME: normalizeString(entry.MIDDLE_NAME),
  LAST_NAME: normalizeString(entry.LAST_NAME),
  SUFFIX: normalizeString(entry.SUFFIX),
  SOCIAL_SECURITY_NUMBER: normalizeSsn(entry.SOCIAL_SECURITY_NUMBER),
  BRANCH_OF_SERVICE: normalizeBranchOfService(entry.BRANCH_OF_SERVICE),
  DATE_OF_BIRTH: normalizeArtifactDate(entry.DATE_OF_BIRTH),
  DATE_INDUCTED: normalizeArtifactDate(entry.DATE_INDUCTED),
  DATE_ENTERED_ACTIVE_SERVICE: normalizeArtifactDate(
    entry.DATE_ENTERED_ACTIVE_SERVICE,
  ),
  DATE_SEPARATED_ACTIVE_SERVICE: normalizeArtifactDate(
    entry.DATE_SEPARATED_ACTIVE_SERVICE,
  ),
});

const normalizeDeathCertificateEntry = entry => ({
  ...entry,
  FIRST_NAME: normalizeString(entry.FIRST_NAME),
  MIDDLE_NAME: normalizeString(entry.MIDDLE_NAME),
  LAST_NAME: normalizeString(entry.LAST_NAME),
  SUFFIX: normalizeString(entry.SUFFIX),
  SOCIAL_SECURITY_NUMBER: normalizeSsn(entry.SOCIAL_SECURITY_NUMBER),
  DATE_OF_DEATH: normalizeArtifactDate(entry.DATE_OF_DEATH),
  DISPOSITION_DATE: normalizeArtifactDate(entry.DISPOSITION_DATE),
});

export const normalizeSections = ({
  dd214 = [],
  deathCertificates = [],
} = {}) => ({
  dd214: dd214.map(normalizeDd214Entry),
  deathCertificates: deathCertificates.map(normalizeDeathCertificateEntry),
});
