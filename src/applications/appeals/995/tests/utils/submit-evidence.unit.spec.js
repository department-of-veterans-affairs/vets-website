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
  const setup = ({
    toggle = true,
    type = '',
    date = '',
    from = '2000-02-02',
    to = '2020-03-04',
    noDate,
  }) => {
    return getTreatmentDate(type, toggle, {
      treatmentDate: date,
      evidenceDates: { from, to },
      noDate,
    });
  };

  it('should return an empty string', () => {
    expect(getTreatmentDate('', true, {})).to.eq('');
  });

  it('should return treatment date', () => {
    expect(setup({ date: '2020-02' })).to.eq('2020-02-01');
  });

  it('should return empty string', () => {
    expect(setup({ noDate: true })).to.eq('');
    expect(setup({ type: '' })).to.eq('');
    expect(setup({ type: '' })).to.eq('');
  });

  it('should return from date', () => {
    expect(setup({ type: 'from' })).to.eq('2000-02-02');
    expect(setup({ type: 'from', toggle: false })).to.eq('2000-02-02');
    // expecting YYYY-MM format for treatement date
    expect(setup({ type: 'from', date: '2010-05-06' })).to.eq('2000-02-02');
  });

  it('should return to date', () => {
    expect(setup({ type: 'to' })).to.eq('2020-03-04');
    expect(setup({ type: 'to', toggle: false })).to.eq('2020-03-04');
    // expecting YYYY-MM format for treatement date
    expect(setup({ type: 'to', date: '2010-05-06' })).to.eq('2020-03-04');
  });

  it('should return treatment date', () => {
    expect(setup({ date: '2010-05' })).to.eq('2010-05-01');
  });
});

describe('hasDuplicateLocation', () => {
  describe('original form', () => {
    const getLocation = ({
      wrap = false,
      name = 'test 1',
      from = '2022-01-01',
      to = '2022-02-02',
    } = {}) => {
      const location = {
        locationAndName: name,
        issues: ['1', '2'],
        evidenceDates: wrap ? [{ startDate: from, endDate: to }] : { from, to },
      };
      return wrap ? { attributes: location } : location;
    };
    const list = [
      getLocation({ wrap: true }),
      getLocation({ name: 'test 2', wrap: true }),
    ];

    it('should not find any duplicates', () => {
      const blank = getLocation();
      expect(hasDuplicateLocation([{ attributes: {} }], blank)).to.be.false;
      const name = getLocation({ name: 'test 3' });
      expect(hasDuplicateLocation(list, name)).to.be.false;
      const to = getLocation({ to: '2022-03-03' });
      expect(hasDuplicateLocation(list, to)).to.be.false;
      const from = getLocation({ from: '2022-03-03' });
      expect(hasDuplicateLocation(list, from)).to.be.false;
    });
    it('should report duplicate location', () => {
      const first = getLocation();
      expect(hasDuplicateLocation(list, first)).to.be.true;
      const second = getLocation({ name: 'test 2' });
      expect(hasDuplicateLocation(list, second)).to.be.true;

      // check date format without leading zeros
      const first2 = getLocation({ from: '2022-1-1', to: '2022-2-2' });
      expect(hasDuplicateLocation(list, first2)).to.be.true;
    });
  });
  describe('new form', () => {
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
      expect(hasDuplicateLocation(list, name, true)).to.be.false;
      const from = getLocation({ date: '2022-03' });
      expect(hasDuplicateLocation(list, from, true)).to.be.false;
    });
    it('should report duplicate location', () => {
      const first = getLocation();
      expect(hasDuplicateLocation(list, first, true)).to.be.true;
      const second = getLocation({ name: 'test 2' });
      expect(hasDuplicateLocation(list, second, true)).to.be.true;

      // check date format without leading zeros
      expect(hasDuplicateLocation(list, first, true)).to.be.true;
    });
  });
});

describe('getEvidence', () => {
  const getData = ({ hasVa = true, showScNewForm = false } = {}) => ({
    data: {
      [EVIDENCE_VA]: hasVa,
      showScNewForm,
      form5103Acknowledged: true,
      locations: [
        {
          locationAndName: 'test 1',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-01-05', to: '2022-02-02' },
          treatmentDate: '2002-05',
          noDate: false,
        },
        {
          locationAndName: 'test 2',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-03-03', to: '2022-04-04' },
          treatmentDate: '2002-07',
          noDate: false,
        },
        {
          locationAndName: 'test 3',
          issues: ['2'],
          evidenceDates: { from: '2022-05-05', to: '2022-06-06' },
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
            attributes: {
              locationAndName: 'test 1',
              evidenceDates: [
                {
                  startDate: newForm ? '2002-05-01' : '2022-01-05',
                  endDate: newForm ? '2002-05-01' : '2022-02-02',
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
                  startDate: newForm ? '2002-07-01' : '2022-03-03',
                  endDate: newForm ? '2002-07-01' : '2022-04-04',
                },
              ],
              noTreatmentDates: false,
            },
          },
          {
            type: 'retrievalEvidence',
            attributes: {
              locationAndName: 'test 3',
              evidenceDates: [
                {
                  startDate: newForm ? '' : '2022-05-05',
                  endDate: newForm ? '' : '2022-06-06',
                },
              ],
              noTreatmentDates: true,
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
    const evidence = getData({ showScNewForm: true });
    expect(getEvidence(evidence.data)).to.deep.equal(evidence.result(true));
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
