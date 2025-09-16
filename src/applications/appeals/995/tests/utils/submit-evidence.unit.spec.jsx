import { expect } from 'chai';

import {
  EVIDENCE_LIMIT,
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  SC_NEW_FORM_DATA,
} from '../../constants';
import {
  getEvidence,
  getForm4142,
  getTreatmentDate,
  hasDuplicateFacility,
  hasDuplicateLocation,
} from '../../utils/submit';

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

describe('hasDuplicateLocation', () => {
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

  it('should not find any duplicates in new form', () => {
    const name = getLocation({ name: 'test 3' });
    expect(hasDuplicateLocation(list, name)).to.be.false;
    const from = getLocation({ date: '2022-03' });
    expect(hasDuplicateLocation(list, from)).to.be.false;
  });

  it('should report duplicate location', () => {
    const first = getLocation();
    expect(hasDuplicateLocation(list, first)).to.be.true;
    const second = getLocation({ name: 'test 2' });
    expect(hasDuplicateLocation(list, second)).to.be.true;

    // check date format without leading zeros
    expect(hasDuplicateLocation(list, first)).to.be.true;
  });
});

describe('getEvidence', () => {
  const getData = ({ hasVa = true } = {}) => ({
    data: {
      [EVIDENCE_VA]: hasVa,
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
          issues: ['2'],
          treatmentDate: '2002', // incomplete date
          noDate: true,
        },
      ],
    },
    result: (newForm = false) => ({
      form5103Acknowledged: true,
      evidenceSubmission: {
        evidenceType: ['retrieval'],
        retrieveFrom: [
          {
            type: 'retrievalEvidence',
            attributes: newForm
              ? {
                  locationAndName: 'test 1',
                  evidenceDates: [
                    {
                      startDate: '2002-05-01',
                      endDate: '2002-05-01',
                    },
                  ],
                  noTreatmentDates: false,
                }
              : {
                  locationAndName: 'test 1',
                  evidenceDates: [
                    {
                      startDate: '2022-01-05',
                      endDate: '2022-02-02',
                    },
                  ],
                },
          },
          {
            type: 'retrievalEvidence',
            attributes: newForm
              ? {
                  locationAndName: 'test 2',
                  evidenceDates: [
                    {
                      startDate: '2002-07-01',
                      endDate: '2002-07-01',
                    },
                  ],
                  noTreatmentDates: false,
                }
              : {
                  locationAndName: 'test 2',
                  evidenceDates: [
                    {
                      startDate: '2022-03-03',
                      endDate: '2022-04-04',
                    },
                  ],
                },
          },
          {
            type: 'retrievalEvidence',
            attributes: newForm
              ? { locationAndName: 'test 3', noTreatmentDates: true }
              : {
                  locationAndName: 'test 3',
                  evidenceDates: [
                    {
                      startDate: '2022-05-05',
                      endDate: '2022-06-06',
                    },
                  ],
                },
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
      [EVIDENCE_OTHER]: true,
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
      [EVIDENCE_OTHER]: true,
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
      [EVIDENCE_VA]: true,
      showScNewForm: true,
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
      [EVIDENCE_PRIVATE]: true,
      ...getData(),
      privacyAgreementAccepted: undefined,
    };
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });

  it('should return 4142 form data', () => {
    const data = {
      [EVIDENCE_PRIVATE]: true,
      ...getData(),
    };
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });
  it('should return empty object since private evidence not selected', () => {
    const data = {
      [EVIDENCE_PRIVATE]: false,
      ...getData(),
    };
    expect(getForm4142(data)).to.deep.equal(null);
  });
  it('should combine duplicate facilities', () => {
    const data = {
      [EVIDENCE_PRIVATE]: true,
      ...getData(),
    };
    data.providerFacility.push(data.providerFacility[0]); // add duplicate
    expect(data.providerFacility.length).to.eq(3);
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });

  it('should return 4142 form data with limited consent when y/n is set to yes', () => {
    const data = {
      [SC_NEW_FORM_DATA]: true,
      [EVIDENCE_PRIVATE]: true,
      [EVIDENCE_LIMIT]: true,
      ...getData(),
      privacyAgreementAccepted: undefined,
    };
    expect(getForm4142(data)).to.deep.equal(getData(true));
  });

  it('should return 4142 form data with no limited consent when y/n is set to no', () => {
    const data = {
      [SC_NEW_FORM_DATA]: true,
      [EVIDENCE_PRIVATE]: true,
      [EVIDENCE_LIMIT]: false,
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
