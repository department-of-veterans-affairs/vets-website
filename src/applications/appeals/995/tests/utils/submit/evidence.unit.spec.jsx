import { expect } from 'chai';
import {
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
} from '../../../constants';
import {
  getEvidence,
  getForm4142,
  getTreatmentDate,
  hasDuplicateFacility,
  dedupeVALocations,
} from '../../../utils/submit/evidence';

describe('getTreatmentDate', () => {
  it('should return empty when the proper data is not given', () => {
    const location = {
      treatmentDate: '1-01',
    };

    expect(getTreatmentDate(location)).to.eq('');
  });

  it('should return empty when the proper data is not given', () => {
    const location = {
      treatmentDate: '01-01',
    };

    expect(getTreatmentDate(location)).to.eq('');
  });

  it('should return empty when the proper data is not given', () => {
    const location = {
      treatmentDate: '1',
    };

    expect(getTreatmentDate(location)).to.eq('');
  });

  it('should return empty when the proper data is not given', () => {
    const location = {
      treatmentDate: '1923',
    };

    expect(getTreatmentDate(location)).to.eq('');
  });

  it('should return empty when the proper data is not given', () => {
    const location = {
      treatmentDate: '101-01',
    };

    expect(getTreatmentDate(location)).to.eq('');
  });

  it('should return the date when a proper data is given', () => {
    const location = {
      treatmentDate: '1926-01',
    };

    expect(getTreatmentDate(location)).to.eq('1926-01-01');
  });

  it('should return the date when a proper data is given', () => {
    const location = {
      treatmentDate: '2001-01',
    };

    expect(getTreatmentDate(location)).to.eq('2001-01-01');
  });
});

describe('dedupeVALocations', () => {
  const getLocation = ({
    wrap = false,
    name = 'test 1',
    date = '2024-03',
    noDate = false,
  } = {}) => {
    const evidenceDates = { from: '2022-01-01', to: '2022-02-02' };
    const location = {
      locationAndName: name,
      issues: ['1', '2'],
      noDate,
      evidenceDates: wrap ? [evidenceDates] : evidenceDates,
      treatmentDate: date,
    };

    return wrap ? { attributes: location } : location;
  };

  const list = [
    getLocation({ wrap: true }),
    getLocation({ name: 'test 2', wrap: true }),
  ];

  it('should not dedupe unique items', () => {
    const name = getLocation({ name: 'test 3' });
    expect(dedupeVALocations([...list, name]).length).to.eq(3);

    const from = getLocation({ date: '2022-03' });
    expect(dedupeVALocations([...list, from]).length).to.eq(3);
  });

  it('should dedupe non-unique items', () => {
    const first = getLocation({ wrap: true });
    expect(dedupeVALocations([...list, first]).length).to.eq(2);

    const second = getLocation({ wrap: true, name: 'test 2' });
    expect(dedupeVALocations([...list, second]).length).to.eq(2);
  });
});

describe('getEvidence', () => {
  const getData = ({ hasVa = true } = {}) => ({
    data: {
      [HAS_VA_EVIDENCE]: hasVa,
      form5103Acknowledged: true,
      locations: [
        {
          locationAndName: 'test 1',
          issues: ['1', '2'],
          treatmentDate: '2002-05',
          noDate: false,
        },
        {
          locationAndName: 'test 2',
          issues: ['1', '2'],
          treatmentDate: '2002-07',
          noDate: false,
        },
        {
          locationAndName: 'test 3',
          issues: ['1'],
          treatmentDate: '',
          noDate: true,
        },
      ],
    },
    result: () => ({
      form5103Acknowledged: true,
      evidenceSubmission: {
        evidenceType: ['retrieval'],
        retrieveFrom: [
          {
            type: 'retrievalEvidence',
            attributes: {
              locationAndName: 'test 1',
              evidenceDates: [
                {
                  startDate: '2002-05-01',
                  endDate: '2002-05-01',
                },
              ],
              noTreatmentDates: false,
            },
          },
          {
            type: 'retrievalEvidence',
            attributes: {
              locationAndName: 'test 2',
              evidenceDates: [
                {
                  startDate: '2002-07-01',
                  endDate: '2002-07-01',
                },
              ],
              noTreatmentDates: false,
            },
          },
          {
            type: 'retrievalEvidence',
            attributes: { locationAndName: 'test 3', noTreatmentDates: true },
          },
        ],
      },
    }),
  });

  it('should include evidenceType of none when no evidence submitted', () => {
    const evidence = getData({ hasVa: false });

    expect(getEvidence(evidence.data)).to.deep.equal({
      form5103Acknowledged: true,
      evidenceSubmission: {
        evidenceType: ['none'],
      },
    });
  });

  it('should process evidence when available', () => {
    const evidence = getData();
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result());
  });

  it('should add "upload" to evidence type when available', () => {
    const { data } = getData();
    const evidence = {
      ...data,
      [HAS_OTHER_EVIDENCE]: true,
      additionalDocuments: [{}],
    };
    expect(getEvidence(evidence).evidenceSubmission.evidenceType).to.deep.equal(
      ['retrieval', 'upload'],
    );
  });

  it('should only include "upload" when documents were uploaded with no VA evidence', () => {
    const { data } = getData({ hasVa: false });
    const evidence = {
      ...data,
      [HAS_OTHER_EVIDENCE]: true,
      additionalDocuments: [{}],
    };
    expect(getEvidence(evidence).evidenceSubmission.evidenceType).to.deep.equal(
      ['upload'],
    );
  });

  it('should combine duplicate VA locations & dates', () => {
    const evidence = getData();
    evidence.data.locations.push(evidence.data.locations[0]);
    evidence.data.locations.push(evidence.data.locations[1]);

    expect(evidence.data.locations.length).to.eq(5);
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result());
  });

  // TODO: Replace this test once Lighthouse provides an endpoint for the new
  // form data
  it('should temporarily process VA evidence treatment dates into an evidence date range', () => {
    const evidence = getData();
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result(true));
  });

  it('should send noTreatmentDates as true when no date is provided', () => {
    const evidence = {
      [HAS_VA_EVIDENCE]: true,
      form5103Acknowledged: true,
      locations: [
        {
          locationAndName: 'test 1',
          issues: ['1', '2'],
          evidenceDates: { from: '', to: '' },
          treatmentDate: '',
          noDate: false,
        },
      ],
    };

    expect(getEvidence(evidence)).to.deep.equal({
      evidenceSubmission: {
        evidenceType: ['retrieval'],
        retrieveFrom: [
          {
            attributes: {
              locationAndName: 'test 1',
              noTreatmentDates: true,
            },
            type: 'retrievalEvidence',
          },
        ],
      },
      form5103Acknowledged: true,
    });
  });
});

describe('hasDuplicateFacility', () => {
  const getFacility = ({
    wrap = false,
    name = 'test 1',
    from = '2022-01-01',
    to = '2022-02-02',
    country = 'USA',
    street = '123 Main',
    city = 'Anywhere',
    state = 'Confusion',
    postalCode = '55555',
  } = {}) => ({
    providerFacilityName: name,
    providerFacilityAddress: { country, street, city, state, postalCode },
    issues: ['1', '2'],
    treatmentDateRange: wrap ? [{ from, to }] : { from, to },
  });
  const list = [
    getFacility({ wrap: true }),
    getFacility({ name: 'test 2', wrap: true }),
  ];
  it('should not find any duplicates', () => {
    const name = getFacility({ name: 'test 3' });
    expect(hasDuplicateFacility(list, name)).to.be.false;

    const country = getFacility({ country: 'UK' });
    expect(hasDuplicateFacility(list, country)).to.be.false;
    const street = getFacility({ street: '456 Second St' });
    expect(hasDuplicateFacility(list, street)).to.be.false;
    const city = getFacility({ city: 'Here' });
    expect(hasDuplicateFacility(list, city)).to.be.false;
    const state = getFacility({ state: 'There' });
    expect(hasDuplicateFacility(list, state)).to.be.false;
    const postalCode = getFacility({ postalCode: '90210' });
    expect(hasDuplicateFacility(list, postalCode)).to.be.false;

    const to = getFacility({ to: '2022-03-03' });
    expect(hasDuplicateFacility(list, to)).to.be.false;
    const from = getFacility({ from: '2022-03-03' });
    expect(hasDuplicateFacility(list, from)).to.be.false;
  });
  it('should report duplicate location', () => {
    const first = getFacility();
    expect(hasDuplicateFacility(list, first)).to.be.true;
    const second = getFacility({ name: 'test 2' });
    expect(hasDuplicateFacility(list, second)).to.be.true;

    // check date format without leading zeros
    const first2 = getFacility({ from: '2022-1-1', to: '2022-2-2' });
    expect(hasDuplicateFacility(list, first2)).to.be.true;
  });
});

describe('getForm4142', () => {
  const getData = wrap => ({
    privacyAgreementAccepted: true,
    limitedConsent: 'testing',
    // Move treatementDateRange entry into an array
    providerFacility: [
      {
        providerFacilityName: 'foo',
        providerFacilityAddress: 'bar',
        treatmentDateRange: wrap
          ? [{ from: '2000-01-01', to: '2000-02-02' }]
          : { from: '2000-1-1', to: '2000-2-2' },
      },
      {
        providerFacilityName: 'bar',
        providerFacilityAddress: 'foo',
        treatmentDateRange: wrap
          ? [{ from: '2001-03-03', to: '2001-04-04' }]
          : { from: '2001-3-3', to: '2001-4-4' },
      },
    ],
  });

  it('should return 4142 form data with undefined acceptance', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: true,
      ...getData(),
      privacyAgreementAccepted: undefined,
    };
    expect(getForm4142(data)).to.deep.equal({
      ...getData(true),
      limitedConsent: '',
    });
  });

  it('should return 4142 form data', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: true,
      ...getData(),
    };
    expect(getForm4142(data)).to.deep.equal({
      ...getData(true),
      limitedConsent: '',
    });
  });

  it('should return empty object since private evidence not selected', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: false,
      ...getData(),
    };
    expect(getForm4142(data)).to.deep.equal(null);
  });
  it('should combine duplicate facilities', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: true,
      ...getData(),
    };
    data.providerFacility.push(data.providerFacility[0]); // add duplicate
    expect(data.providerFacility.length).to.eq(3);
    expect(getForm4142(data)).to.deep.equal({
      ...getData(true),
      limitedConsent: '',
    });
  });

  it('should return with limited consent when y/n is set to yes', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: true,
      [HAS_PRIVATE_LIMITATION]: true,
      ...getData(),
      privacyAgreementAccepted: undefined,
    };
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });

  it('should return with empty limited consent when y/n is set to no', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: true,
      [HAS_PRIVATE_LIMITATION]: false,
      ...getData(),
      privacyAgreementAccepted: undefined,
    };

    const result = {
      ...getData(true),
      limitedConsent: '',
    };

    expect(getForm4142(data)).to.deep.equal(result);
  });

  it('should return with empty limited consent when y/n is not set at all', () => {
    const data = {
      [HAS_PRIVATE_EVIDENCE]: true,
      ...getData(),
      privacyAgreementAccepted: undefined,
    };

    const result = {
      ...getData(true),
      limitedConsent: '',
    };

    expect(getForm4142(data)).to.deep.equal(result);
  });
});
