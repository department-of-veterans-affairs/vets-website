import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submitTransformer';
import { toHash } from '../../../../shared/utilities';

const APPLICANT_SSN = '345345345';
const SSN_HASH = toHash(APPLICANT_SSN);

const doc = (confirmationCode, name = `${confirmationCode}.pdf`) => [
  { confirmationCode, name },
];

const makeApplicant = (ssn, name = { first: 'Johnny', last: 'Alvin' }) => ({
  applicantName: name,
  applicantSsn: ssn,
});

const makePlan = (overrides = {}) => ({
  medicareParticipant: SSN_HASH,
  medicarePlanType: 'ab',
  ...overrides,
});

const supportingDocCodes = testData => {
  const transformed = JSON.parse(transformForSubmit(formConfig, testData));
  return new Set(
    (transformed.supportingDocs || []).map(d => d.confirmationCode),
  );
};

const expectIncludes = (set, codes = []) => {
  codes.forEach(code =>
    expect(set.has(code), `expected to include ${code}`).to.eq(true),
  );
};

const expectExcludes = (set, codes = []) => {
  codes.forEach(code =>
    expect(set.has(code), `expected to exclude ${code}`).to.eq(false),
  );
};

const baseData = (applicants, medicare) => ({
  data: { applicants, medicare },
});

describe('10-10d extended Submit Transformer - Medicare document filtering', () => {
  const cases = [
    {
      title: 'only includes Part A cards when plan type is "a"',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'a',
            medicarePartAFrontCard: doc('part-a-front-123'),
            medicarePartABackCard: doc('part-a-back-123'),
            // filtered out
            medicarePartBFrontCard: doc('part-b-front-123'),
            medicarePartAPartBFrontCard: doc('part-ab-front-123'),
          }),
        ],
      ),
      include: ['part-a-front-123', 'part-a-back-123'],
      exclude: ['part-b-front-123', 'part-ab-front-123'],
    },
    {
      title:
        'only includes Part B cards and denial proof when plan type is "b"',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'b',
            medicarePartBFrontCard: doc('part-b-front-456'),
            medicarePartBBackCard: doc('part-b-back-456'),
            medicarePartADenialProof: doc(
              'denial-proof-456',
              'denial-letter.pdf',
            ),
            // filtered out
            medicarePartAFrontCard: doc('part-a-front-456'),
            medicarePartAPartBFrontCard: doc('part-ab-front-456'),
          }),
        ],
      ),
      include: ['part-b-front-456', 'part-b-back-456', 'denial-proof-456'],
      exclude: ['part-a-front-456', 'part-ab-front-456'],
    },
    {
      title: 'only includes Part A/B cards when plan type is "ab"',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'ab',
            medicarePartAPartBFrontCard: doc('part-ab-front-789'),
            medicarePartAPartBBackCard: doc('part-ab-back-789'),
            // filtered out
            medicarePartAFrontCard: doc('part-a-front-789'),
            medicarePartBFrontCard: doc('part-b-front-789'),
          }),
        ],
      ),
      include: ['part-ab-front-789', 'part-ab-back-789'],
      exclude: ['part-a-front-789', 'part-b-front-789'],
    },
    {
      title: 'includes Part C cards when plan type is "c"',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'c',
            medicarePartCCarrier: 'Advantage Health',
            medicarePartAPartBFrontCard: doc('part-ab-front-321'),
            medicarePartAPartBBackCard: doc('part-ab-back-321'),
            medicarePartCFrontCard: doc('part-c-front-321'),
            medicarePartCBackCard: doc('part-c-back-321'),
            // filtered out
            medicarePartAFrontCard: doc('part-a-front-321'),
            medicarePartBFrontCard: doc('part-b-front-321'),
          }),
        ],
      ),
      include: [
        'part-ab-front-321',
        'part-ab-back-321',
        'part-c-front-321',
        'part-c-back-321',
      ],
      exclude: ['part-a-front-321', 'part-b-front-321'],
    },
    {
      title: 'includes Part D cards when hasMedicarePartD is true',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'ab',
            hasMedicarePartD: true,
            medicarePartAPartBFrontCard: doc('part-ab-front-555'),
            medicarePartAPartBBackCard: doc('part-ab-back-555'),
            medicarePartDFrontCard: doc('part-d-front-555'),
            medicarePartDBackCard: doc('part-d-back-555'),
          }),
        ],
      ),
      include: [
        'part-ab-front-555',
        'part-ab-back-555',
        'part-d-front-555',
        'part-d-back-555',
      ],
    },
    {
      title: 'excludes Part D cards when hasMedicarePartD is false',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'ab',
            hasMedicarePartD: false,
            medicarePartAPartBFrontCard: doc('part-ab-front-666'),
            medicarePartAPartBBackCard: doc('part-ab-back-666'),
            // should be filtered out
            medicarePartDFrontCard: doc('part-d-front-666'),
            medicarePartDBackCard: doc('part-d-back-666'),
          }),
        ],
      ),
      include: ['part-ab-front-666', 'part-ab-back-666'],
      exclude: ['part-d-front-666', 'part-d-back-666'],
    },
    {
      title: 'handles scenario where user changes plan type from "a" to "ab"',
      data: baseData(
        [makeApplicant(APPLICANT_SSN)],
        [
          makePlan({
            medicarePlanType: 'ab',
            // stale docs from old "a"
            medicarePartAFrontCard: doc('old-part-a-front'),
            medicarePartABackCard: doc('old-part-a-back'),
            // new docs for "ab"
            medicarePartAPartBFrontCard: doc('new-part-ab-front'),
            medicarePartAPartBBackCard: doc('new-part-ab-back'),
          }),
        ],
      ),
      include: ['new-part-ab-front', 'new-part-ab-back'],
      exclude: ['old-part-a-front', 'old-part-a-back'],
    },
  ];

  cases.forEach(({ title, data, include = [], exclude = [] }) => {
    it(title, () => {
      const codes = supportingDocCodes(data);
      expectIncludes(codes, include);
      expectExcludes(codes, exclude);
    });
  });

  it('handles multiple medicare plans with different types', () => {
    const applicant2Ssn = '456456456';
    const applicant2Hash = toHash(applicant2Ssn);

    const data = baseData(
      [
        makeApplicant(APPLICANT_SSN),
        makeApplicant(applicant2Ssn, { first: 'Jane', last: 'Smith' }),
      ],
      [
        makePlan({
          medicareParticipant: SSN_HASH,
          medicarePlanType: 'a',
          medicarePartAFrontCard: doc('applicant1-part-a-front'),
          medicarePartABackCard: doc('applicant1-part-a-back'),
        }),
        makePlan({
          medicareParticipant: applicant2Hash,
          medicarePlanType: 'b',
          medicarePartBFrontCard: doc('applicant2-part-b-front'),
          medicarePartBBackCard: doc('applicant2-part-b-back'),
        }),
      ],
    );

    const codes = supportingDocCodes(data);

    expectIncludes(codes, [
      'applicant1-part-a-front',
      'applicant1-part-a-back',
    ]);
    expectIncludes(codes, [
      'applicant2-part-b-front',
      'applicant2-part-b-back',
    ]);
  });
});
