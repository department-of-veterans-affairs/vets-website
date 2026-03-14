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
  VETERAN_NAME: [
    pick(['John', 'Alex', 'Chris', 'Taylor'], seed + 1),
    pick(['Q', 'R', 'S', 'T'], seed + 2),
    pick(['Veteran', 'Smith', 'Johnson', 'Brown'], seed + 3),
  ].join(' '),
  VETERAN_SSN: `00000${String(1000 + (seed % 8999)).slice(-4)}`,
  VETERAN_DOB: '01/02/1950',
  BRANCH_OF_SERVICE: pick(
    ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard'],
    seed + 5,
  ),
  GRADE_RATE_RANK: pick(['E-4', 'E-5', 'O-2', 'O-3'], seed + 6),
  PAY_GRADE: pick(['E4', 'E5', 'O2', 'O3'], seed + 7),
  DATE_INDUCTED: '02/03/1970',
  DATE_ENTERED_ACTIVE_SERVICE: '02/15/1970',
  DATE_SEPARATED_FROM_SERVICE: '02/14/1974',
  CAUSE_OF_SEPARATION: pick(
    ['Expiration of term', 'Medical', 'Other'],
    seed + 8,
  ),
  CHARACTER_OF_SERVICE: pick(
    [
      'Honorable',
      'General (Under Honorable Conditions)',
      'Other Than Honorable',
    ],
    seed + 9,
  ),
  SEPARATION_TYPE: pick(
    ['Discharge', 'Release from Active Duty', 'Retirement'],
    seed + 10,
  ),
  SEPARATION_CODE: pick(['MBK', 'JHJ', 'KND'], seed + 11),
});

const buildDeathCertStub = seed => ({
  DECENDENT_FULL_NAME: [
    pick(['Pat', 'Jordan', 'Morgan', 'Casey'], seed + 11),
    pick(['A', 'B', 'C', 'D'], seed + 12),
    pick(['Veteran', 'Smith', 'Johnson', 'Brown'], seed + 13),
  ].join(' '),
  DECENDENT_SSN: `00000${String(2000 + (seed % 7999)).slice(-4)}`,
  DECENDENT_MARITAL_STATUS: pick(
    ['Married', 'Widowed', 'Divorced', 'Single'],
    seed + 15,
  ),
  DECENDENT_DATE_OF_DISPOSITION: '03/10/2020',
  DECENDENT_DATE_OF_DEATH: '03/01/2020',
  CAUSE_OF_DEATH: pick(['Natural causes', 'Accident', 'Illness'], seed + 16),
  UNDERLYING_CAUSE_OF_DEATH_B: '',
  UNDERLYING_CAUSE_OF_DEATH_C: '',
  UNDERLYING_CAUSE_OF_DEATH_D: '',
  MANNER_OF_DEATH: pick(
    ['Natural', 'Accident', 'Homicide', 'Suicide'],
    seed + 17,
  ),
});

const caveResponses = {
  'POST /v0/cave': (req, res) => {
    const id = `mock-${Date.now().toString(36)}`;
    return res.json({
      id,
      bucket: 'mock-idp-bucket',
      pdfKey: `${id}/document.pdf`,
    });
  },
  'GET /v0/cave/:id/status': (req, res) => {
    return res.json({
      id: req.params.id,
      scanStatus: 'completed',
      updatedAt: new Date().toISOString(),
    });
  },
  'GET /v0/cave/:id/output': (req, res) => {
    const { id } = req.params;
    const seed = seedFromString(id);
    return res.json({
      forms: [
        {
          artifactType: 'DD214',
          mmsArtifactValidationId: `mock-dd214-${seed}`,
        },
      ],
    });
  },
  'GET /v0/cave/:id/download': (req, res) => {
    const { id } = req.params;
    const kvpId = req.query.kvpid || '';
    const seed = seedFromString(`${id}:${kvpId}`);

    if (String(kvpId).includes('dd214')) {
      return res.json(buildDd214Stub(seed));
    }
    if (String(kvpId).includes('death')) {
      return res.json(buildDeathCertStub(seed));
    }

    return res.json({});
  },
};

module.exports = caveResponses;
