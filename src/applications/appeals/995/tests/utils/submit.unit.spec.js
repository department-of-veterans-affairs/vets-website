import { expect } from 'chai';

import {
  EVIDENCE_LIMIT,
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  PRIMARY_PHONE,
  SC_NEW_FORM_DATA,
} from '../../constants';
import {
  getAddress,
  getClaimantData,
  getEmail,
  getEvidence,
  getForm4142,
  getPhone,
  getTreatmentDate,
  hasDuplicateFacility,
  hasDuplicateLocation,
  TEMP_DATE,
} from '../../utils/submit';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

describe('getAddress', () => {
  const wrap = obj => ({
    veteran: { address: obj },
  });
  it('should return a cleaned up address object', () => {
    // zipCode5 returns 5 zeros if country isn't set to 'US'
    const result = { zipCode5: '00000' };
    expect(getAddress()).to.deep.equal(result);
    expect(getAddress({})).to.deep.equal(result);
    expect(getAddress(wrap({}))).to.deep.equal(result);
    expect(getAddress(wrap({ temp: 'test' }))).to.deep.equal(result);
    expect(getAddress(wrap({ addressLine1: 'test' }))).to.deep.equal({
      addressLine1: 'test',
      zipCode5: '00000',
    });
    expect(
      getAddress(wrap({ countryCodeIso2: 'US', zipCode: '10101' })),
    ).to.deep.equal({
      countryCodeISO2: 'US',
      zipCode5: '10101',
    });
    expect(
      getAddress(
        wrap({
          addressLine1: '123 test',
          addressLine2: 'c/o foo',
          addressLine3: 'suite 99',
          city: 'Big City',
          stateCode: 'NV',
          zipCode: '10101',
          countryCodeIso2: 'US',
          internationalPostalCode: '12345',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '10101',
      countryCodeISO2: 'US',
      internationalPostalCode: '12345',
    });
    expect(
      getAddress(
        wrap({
          addressLine1: '123 test',
          addressLine2: 'c/o foo',
          addressLine3: 'suite 99',
          city: 'Big City',
          stateCode: 'NV',
          zipCode: '10101',
          countryCodeIso2: 'GB',
          internationalPostalCode: '12345',
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal({
      addressLine1: '123 test',
      addressLine2: 'c/o foo',
      addressLine3: 'suite 99',
      city: 'Big City',
      stateCode: 'NV',
      zipCode5: '00000',
      countryCodeISO2: 'GB',
      internationalPostalCode: '12345',
    });
    expect(
      getAddress(
        wrap({ countryCodeIso2: 'GB', internationalPostalCode: '55555' }),
      ),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '55555',
    });
  });
  it('should truncate long address lines', () => {
    expect(getAddress(wrap({ addressLine1: text }))).to.deep.equal({
      addressLine1:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ addressLine2: text }))).to.deep.equal({
      addressLine2: 'Lorem ipsum dolor sit amet, co',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ addressLine3: text }))).to.deep.equal({
      addressLine3: 'Lorem ipsu',
      zipCode5: '00000',
    });
    expect(getAddress(wrap({ city: text }))).to.deep.equal({
      city: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed',
      zipCode5: '00000',
    });
    expect(
      getAddress(wrap({ countryCodeIso2: 'US', zipCode: '123450000' })),
    ).to.deep.equal({
      countryCodeISO2: 'US',
      zipCode5: '12345',
    });
    expect(
      getAddress(
        wrap({
          countryCodeIso2: 'GB',
          internationalPostalCode: '12345678901234567890',
        }),
      ),
    ).to.deep.equal({
      countryCodeISO2: 'GB',
      zipCode5: '00000',
      internationalPostalCode: '1234567890123456',
    });
  });
});

describe('getPhone', () => {
  const phone1 = (submit = false) => ({
    countryCode: '1',
    areaCode: '222',
    phoneNumber: '1234567',
    [submit ? 'phoneNumberExt' : 'extension']: '0000',
  });
  const phone2 = (submit = false) => ({
    countryCode: '1',
    areaCode: '333',
    phoneNumber: '3456789',
    [submit ? 'phoneNumberExt' : 'extension']: '0001',
  });
  it('should return a cleaned up phone object from the default home phone', () => {
    const wrap = obj => ({ veteran: { homePhone: obj } });
    expect(getPhone()).to.deep.equal({});
    expect(getPhone(wrap({}))).to.deep.equal({});
    expect(getPhone(wrap({ temp: 'test' }))).to.deep.equal({});
    expect(getPhone(wrap({ areaCode: '111' }))).to.deep.equal({
      areaCode: '111',
    });
    expect(
      getPhone(
        wrap({
          ...phone1(),
          extra: 'will not be included',
        }),
      ),
    ).to.deep.equal(phone1(true));
  });
  it('should ignore selected primary phone when only home is available', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: phone1(), mobilePhone: {} },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone1(true));
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone1(true));
  });
  it('should ignore selected primary phone when only mobile is available', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: {}, mobilePhone: phone2() },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone2(true));
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone2(true));
  });
  it('should return selected primary phone', () => {
    const wrap = primary => ({
      [PRIMARY_PHONE]: primary,
      veteran: { homePhone: phone1(), mobilePhone: phone2() },
    });
    expect(getPhone(wrap('home'))).to.deep.equal(phone1(true));
    expect(getPhone(wrap('mobile'))).to.deep.equal(phone2(true));
  });
});

describe('getClaimantData', () => {
  // "other" types are not implemented, but there is some minimal code in place
  it('should handle "other" claimant types', () => {
    expect(
      getClaimantData({
        claimantType: 'other',
        claimantTypeOtherValue: 'Twenty-five characters max',
      }),
    ).to.deep.equal({
      claimantType: 'other',
      claimantTypeOtherValue: 'Twenty-five characters ma',
    });
  });
});

describe('getTreatmentDate', () => {
  const wrap = (date, noDate) => ({ treatmentDate: date, noDate });
  it('should return treatment date', () => {
    expect(getTreatmentDate(wrap('2020-02', false))).to.eq('2020-02-01');
  });
  // A default treatment date is only needed until LH finalizes the new API
  it('should return default treatment date', () => {
    expect(getTreatmentDate()).to.eq(TEMP_DATE);
    expect(getTreatmentDate({})).to.eq(TEMP_DATE);
    expect(getTreatmentDate(wrap())).to.eq(TEMP_DATE);
    expect(getTreatmentDate(wrap('12'))).to.eq(TEMP_DATE);
    expect(getTreatmentDate(wrap('1234'))).to.eq(TEMP_DATE);
    expect(getTreatmentDate(wrap('1234-1'))).to.eq(TEMP_DATE);
    expect(getTreatmentDate(wrap('', true))).to.eq(TEMP_DATE);
    expect(getTreatmentDate(wrap('2020-03-03', true))).to.eq(TEMP_DATE);
  });
});

describe('hasDuplicateLocation', () => {
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
      noDate: false,
      treatmentDate: from.substring(0, from.lastIndexOf('-')),
    };
    return wrap ? { attributes: location } : location;
  };
  const list = [
    getLocation({ wrap: true }),
    getLocation({ name: 'test 2', wrap: true }),
  ];

  it('should not find any duplicates', () => {
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

  it('should not find any duplicates in new form', () => {
    const name = getLocation({ name: 'test 3' });
    expect(hasDuplicateLocation(list, name, true)).to.be.false;
    const from = getLocation({ from: '2022-03-03' });
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

describe('getEmail', () => {
  it('should return an empty string', () => {
    expect(getEmail()).to.eq('');
    expect(getEmail({})).to.eq('');
    expect(getEmail({ veteran: {} })).to.eq('');
  });
  it('should return the defined email', () => {
    expect(getEmail({ veteran: { email: 'test@test.com' } })).to.eq(
      'test@test.com',
    );
  });
  it('should return the defined email truncated to 255 characters', () => {
    const email = `${'abcde12345'.repeat(25)}@test.com`;
    const result = getEmail({ veteran: { email } });
    expect(result.length).to.eq(255);
    // results in an invalid email, but we use profile, and they won't accept
    // emails > 255 characters in length
    expect(result.slice(-10)).to.eq('12345@test');
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
        },
        {
          locationAndName: 'test 2',
          issues: ['1', '2'],
          evidenceDates: { from: '2022-03-03', to: '2022-04-04' },
          treatmentDate: '2002-07',
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
            },
          },
          {
            type: 'retrievalEvidence',
            attributes: {
              locationAndName: 'test 3',
              evidenceDates: [
                {
                  startDate: newForm ? TEMP_DATE : '2022-05-05',
                  endDate: newForm ? TEMP_DATE : '2022-06-06',
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
