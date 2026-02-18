import { buildOutputUrl, buildDownloadUrl } from './idpEndpoints';

const ARTIFACT_TYPES = {
  DD214: 'DD214',
  DEATH: 'death',
};

const normalizeType = type => (type || '').toLowerCase();

const seedFromString = value => {
  const str = String(value || '');
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) % 100000;
  }
  return seed;
};

const pick = (list, seed) => list[seed % list.length];

const buildDd214Stub = seed => ({
  FIRST_NAME: pick(['John', 'Alex', 'Chris', 'Taylor'], seed + 1),
  MIDDLE_NAME: pick(['Q', 'R', 'S', ''], seed + 2),
  LAST_NAME: pick(['Veteran', 'Smith', 'Johnson', 'Brown'], seed + 3),
  SUFFIX: pick(['', 'Jr.', 'Sr.', 'III'], seed + 4),
  SOCIAL_SECURITY_NUMBER: `00000${String(1000 + (seed % 8999)).slice(-4)}`,
  DATE_OF_BIRTH: '01-02-1950',
  BRANCH_OF_SERVICE: pick(
    ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard'],
    seed + 5,
  ),
  GRADE_RATE_RANK: pick(['E-4', 'E-5', 'O-2', 'O-3'], seed + 6),
  PAY_GRADE: pick(['E4', 'E5', 'O2', 'O3'], seed + 7),
  DATE_INDUCTED: '02-03-1970',
  DATE_ENTERED_ACTIVE_SERVICE: '02-15-1970',
  DATE_SEPARATED_ACTIVE_SERVICE: '02-14-1974',
  CAUSE_OF_SEPARATION: pick(
    ['Expiration of term', 'Medical', 'Other'],
    seed + 8,
  ),
  SEPARATION_TYPE: pick(
    ['Honorable', 'General', 'Other than honorable'],
    seed + 9,
  ),
  SEPARATION_CODE: pick(['MBK', 'JHJ', 'KND'], seed + 10),
});

const buildDeathCertStub = seed => ({
  FIRST_NAME: pick(['Pat', 'Jordan', 'Morgan', 'Casey'], seed + 11),
  MIDDLE_NAME: pick(['A', 'B', 'C', ''], seed + 12),
  LAST_NAME: pick(['Veteran', 'Smith', 'Johnson', 'Brown'], seed + 13),
  SUFFIX: pick(['', 'Jr.', 'Sr.', 'III'], seed + 14),
  SOCIAL_SECURITY_NUMBER: `00000${String(2000 + (seed % 7999)).slice(-4)}`,
  MARITAL_STATUS_AT_TIME_OF_DEATH: pick(
    ['Married', 'Widowed', 'Divorced', 'Single'],
    seed + 15,
  ),
  DISPOSITION_DATE: '03-10-2020',
  DATE_OF_DEATH: '03-01-2020',
  CAUSE_OF_DEATH_A: pick(['Natural causes', 'Accident', 'Illness'], seed + 16),
  CAUSE_OF_DEATH_B: '—',
  CAUSE_OF_DEATH_C: '—',
  CAUSE_OF_DEATH_D: '—',
  CAUSE_OF_DEATH_OTHER: '—',
  MANNER_OF_DEATH: pick(
    ['Natural', 'Accident', 'Homicide', 'Suicide'],
    seed + 17,
  ),
});

// Stubbed for now: returns a mock summary.
export const fetchArtifactSummary = async documentId => {
  const url = buildOutputUrl(documentId, 'artifact');
  const seed = seedFromString(documentId);

  return {
    requestedUrl: url,
    forms: [
      {
        artifactType: ARTIFACT_TYPES.DD214,
        mmsArtifactValidationId: `stub-dd214-${seed}`,
      },
      {
        artifactType: ARTIFACT_TYPES.DEATH,
        mmsArtifactValidationId: `stub-death-${seed}`,
      },
    ],
  };
};

// Stubbed for now: returns mock extracted field data for a kvpId.
export const downloadArtifactData = async (documentId, kvpId) => {
  const url = buildDownloadUrl(documentId, kvpId);
  const seed = seedFromString(`${documentId}:${kvpId}`);

  if (String(kvpId).includes('dd214')) {
    return { requestedUrl: url, ...buildDd214Stub(seed) };
  }
  if (String(kvpId).includes('death')) {
    return { requestedUrl: url, ...buildDeathCertStub(seed) };
  }

  return { requestedUrl: url };
};

// Stubbed for now: uses the same algorithmic shape as the patch version.
export const fetchRelevantArtifacts = async documentId => {
  const summary = await fetchArtifactSummary(documentId);
  const forms = summary?.forms || [];

  const dd214Forms = forms.filter(
    form =>
      normalizeType(form?.artifactType) === normalizeType(ARTIFACT_TYPES.DD214),
  );
  const deathForms = forms.filter(
    form =>
      normalizeType(form?.artifactType) === normalizeType(ARTIFACT_TYPES.DEATH),
  );

  const [dd214Data, deathData] = await Promise.all([
    Promise.all(
      dd214Forms.map(form =>
        downloadArtifactData(documentId, form?.mmsArtifactValidationId),
      ),
    ),
    Promise.all(
      deathForms.map(form =>
        downloadArtifactData(documentId, form?.mmsArtifactValidationId),
      ),
    ),
  ]);

  return {
    dd214: dd214Data.filter(Boolean),
    deathCertificates: deathData.filter(Boolean),
  };
};

export default fetchRelevantArtifacts;
