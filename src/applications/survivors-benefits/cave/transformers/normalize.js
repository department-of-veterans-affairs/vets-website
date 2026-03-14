import {
  CHARACTER_OF_SERVICE_OPTIONS,
  CHARACTER_OF_SERVICE_ABBREV_MAP,
  SEPARATION_TYPE_OPTIONS,
  SEPARATION_TYPE_ABBREV_MAP,
  PAY_GRADE_OPTIONS,
  PAY_GRADE_ABBREV_MAP,
  SEPARATION_CODES,
  NAME_SUFFIXES,
} from '../constants';

// ---------------------------------------------------------------------------
// Name suffix
// ---------------------------------------------------------------------------

// Keyed by lowercase + no-period for case-insensitive, period-agnostic lookup.
const NAME_SUFFIX_LOOKUP = new Map(
  NAME_SUFFIXES.map(s => [s.toLowerCase().replace(/\./g, ''), s]),
);

// Normalizes a suffix string to the canonical 534EZ enum value.
// Handles missing periods (Jr → Jr.) and case variations.
// Returns null for unrecognized values, '' for blank.
export const normalizeSuffix = v => {
  if (v == null) return null;
  if (typeof v === 'string' && v.trim() === '') return '';
  const key = v
    .trim()
    .toLowerCase()
    .replace(/\./g, '');
  return NAME_SUFFIX_LOOKUP.get(key) ?? null;
};

// ---------------------------------------------------------------------------
// Branch of service
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// SSN / date helpers
// ---------------------------------------------------------------------------

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

// Converts MM/DD/YYYY artifact dates to ISO YYYY-MM-DD.
// Returns null for unparseable/invalid values, '' for blank fields.
const normalizeArtifactDate = v => {
  if (v == null) return null;
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  if (!trimmed) return '';
  const parts = trimmed.split('/');
  if (parts.length !== 3) return null;
  const [m, d, y] = parts;
  if (!y || y.length !== 4) return null;
  const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  return Number.isNaN(new Date(iso).getTime()) ? null : iso;
};

// Parses a full name string into { first, middle, last, suffix }.
// Word count rules: 2 → first last, 3 → first middle last, 4+ → first middle last suffix.
// Returns null if the input is blank/missing.
const toTitleCase = s =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const parseFullName = raw => {
  if (!raw || typeof raw !== 'string') return null;
  const tokens = raw
    .replace(/,/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!tokens.length) return null;
  if (tokens.length === 1)
    return {
      first: toTitleCase(tokens[0]),
      middle: '',
      last: '',
      suffix: undefined,
    };
  if (tokens.length === 2)
    return {
      first: toTitleCase(tokens[0]),
      middle: '',
      last: toTitleCase(tokens[1]),
      suffix: undefined,
    };
  if (tokens.length === 3)
    return {
      first: toTitleCase(tokens[0]),
      middle: toTitleCase(tokens[1]),
      last: toTitleCase(tokens[2]),
      suffix: undefined,
    };
  return {
    first: toTitleCase(tokens[0]),
    middle: toTitleCase(tokens[1]),
    last: toTitleCase(tokens[2]),
    suffix: normalizeSuffix(tokens.slice(3).join(' ')) ?? undefined,
  };
};

// ---------------------------------------------------------------------------
// Enum / free-text normalizers
// ---------------------------------------------------------------------------

// Build case-insensitive lookup tables that map both abbreviations and full-form
// values to their canonical full-form representation.
const buildCaseInsensitiveMap = (abbrevMap, fullFormOptions) => {
  const map = {};
  Object.entries(abbrevMap).forEach(([k, v]) => {
    map[k.toLowerCase()] = v;
  });
  fullFormOptions.forEach(v => {
    map[v.toLowerCase()] = v;
  });
  return map;
};

const CHARACTER_OF_SERVICE_MAP = buildCaseInsensitiveMap(
  CHARACTER_OF_SERVICE_ABBREV_MAP,
  CHARACTER_OF_SERVICE_OPTIONS,
);

const SEPARATION_TYPE_MAP = buildCaseInsensitiveMap(
  SEPARATION_TYPE_ABBREV_MAP,
  SEPARATION_TYPE_OPTIONS,
);

const PAY_GRADE_MAP = buildCaseInsensitiveMap(
  PAY_GRADE_ABBREV_MAP,
  PAY_GRADE_OPTIONS,
);

const SEPARATION_CODES_SET = new Set(SEPARATION_CODES);

export const normalizeCharacterOfService = v => {
  if (v == null) return null;
  const trimmed = typeof v === 'string' ? v.trim() : '';
  if (!trimmed) return '';
  return CHARACTER_OF_SERVICE_MAP[trimmed.toLowerCase()] ?? null;
};

export const normalizeSeparationType = v => {
  if (v == null) return null;
  const trimmed = typeof v === 'string' ? v.trim() : '';
  if (!trimmed) return '';
  return SEPARATION_TYPE_MAP[trimmed.toLowerCase()] ?? null;
};

export const normalizePayGrade = v => {
  if (v == null) return null;
  const trimmed = typeof v === 'string' ? v.trim() : '';
  if (!trimmed) return '';
  return PAY_GRADE_MAP[trimmed.toLowerCase()] ?? null;
};

// Trim and validate against the known set; null if unrecognized.
export const normalizeSeparationCode = v => {
  if (v == null) return null;
  const trimmed = typeof v === 'string' ? v.trim() : '';
  if (!trimmed) return '';
  return SEPARATION_CODES_SET.has(trimmed) ? trimmed : null;
};

// Trim and enforce maxLength. Returns '' for blank, null if too long or wrong type.
export const normalizeFreeText = (v, max) => {
  if (v == null) return null;
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  if (!trimmed) return '';
  if (max != null && trimmed.length > max) return null;
  return trimmed;
};

// ---------------------------------------------------------------------------
// Entry normalizers
// ---------------------------------------------------------------------------

const normalizeDd214Entry = entry => ({
  ...entry,
  VETERAN_NAME: parseFullName(entry.VETERAN_NAME),
  VETERAN_SSN: normalizeSsn(entry.VETERAN_SSN),
  VETERAN_DOB: normalizeArtifactDate(entry.VETERAN_DOB),
  BRANCH_OF_SERVICE: normalizeBranchOfService(entry.BRANCH_OF_SERVICE),
  GRADE_RATE_RANK: normalizeFreeText(entry.GRADE_RATE_RANK, 100),
  PAY_GRADE: normalizePayGrade(entry.PAY_GRADE),
  DATE_INDUCTED: normalizeArtifactDate(entry.DATE_INDUCTED),
  DATE_ENTERED_ACTIVE_SERVICE: normalizeArtifactDate(
    entry.DATE_ENTERED_ACTIVE_SERVICE,
  ),
  DATE_SEPARATED_FROM_SERVICE: normalizeArtifactDate(
    entry.DATE_SEPARATED_FROM_SERVICE,
  ),
  CAUSE_OF_SEPARATION: normalizeFreeText(entry.CAUSE_OF_SEPARATION, 1000),
  CHARACTER_OF_SERVICE: normalizeCharacterOfService(entry.CHARACTER_OF_SERVICE),
  SEPARATION_TYPE: normalizeSeparationType(entry.SEPARATION_TYPE),
  SEPARATION_CODE: normalizeSeparationCode(entry.SEPARATION_CODE),
});

const normalizeDeathCertificateEntry = entry => ({
  ...entry,
  DECENDENT_FULL_NAME: parseFullName(entry.DECENDENT_FULL_NAME),
  DECENDENT_SSN: normalizeSsn(entry.DECENDENT_SSN),
  DECENDENT_DATE_OF_DEATH: normalizeArtifactDate(entry.DECENDENT_DATE_OF_DEATH),
  DECENDENT_DATE_OF_DISPOSITION: normalizeArtifactDate(
    entry.DECENDENT_DATE_OF_DISPOSITION,
  ),
  CAUSE_OF_DEATH: normalizeFreeText(entry.CAUSE_OF_DEATH, 1000),
  UNDERLYING_CAUSE_OF_DEATH_B: normalizeFreeText(
    entry.UNDERLYING_CAUSE_OF_DEATH_B,
    1000,
  ),
  UNDERLYING_CAUSE_OF_DEATH_C: normalizeFreeText(
    entry.UNDERLYING_CAUSE_OF_DEATH_C,
    1000,
  ),
  UNDERLYING_CAUSE_OF_DEATH_D: normalizeFreeText(
    entry.UNDERLYING_CAUSE_OF_DEATH_D,
    1000,
  ),
  MANNER_OF_DEATH: normalizeFreeText(entry.MANNER_OF_DEATH, 1000),
  DECENDENT_MARITAL_STATUS: normalizeFreeText(
    entry.DECENDENT_MARITAL_STATUS,
    1000,
  ),
});

export const normalizeSections = ({
  dd214 = [],
  deathCertificates = [],
} = {}) => ({
  dd214: dd214.map(normalizeDd214Entry),
  deathCertificates: deathCertificates.map(normalizeDeathCertificateEntry),
});
