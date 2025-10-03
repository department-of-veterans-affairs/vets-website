import { expect } from 'chai';

import {
  getVAEvidence,
  getPrivateEvidence,
  getOtherEvidence,
  getIndex,
  evidenceNeedsUpdating,
  removeNonSelectedIssuesFromEvidence,
  onFormLoaded,
} from '../../utils/evidence';
import {
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_OTHER,
  HAS_REDIRECTED,
} from '../../constants';

import { SELECTED } from '../../../shared/constants';

describe('getIndex', () => {
  const testData = ['', '', ''];
  it('should return search param index', () => {
    expect(getIndex(testData, null, '?index=1')).to.eq(1);
  });
  it('should return data length for larger indexes', () => {
    expect(getIndex(testData, null, '?index=9')).to.eq(testData.length);
  });
  it('should return zero for no index', () => {
    expect(getIndex(testData, null, '?test=a')).to.eq(0);
  });
  it('should return zero for non-number indexes', () => {
    expect(getIndex(testData, null, '?index=a')).to.eq(0);
  });
  it('should return testIndex when missing an index', () => {
    expect(getIndex(testData, '2', '?test=a')).to.eq(2);
  });
  it('should return zero when missing an index & testIndex', () => {
    expect(getIndex(testData, null, '?test=a')).to.eq(0);
  });
});

describe('getVAEvidence', () => {
  it('should return expected value', () => {
    expect(
      getVAEvidence({ [EVIDENCE_VA]: undefined, locations: [{}] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [EVIDENCE_VA]: true, locations: [{}] }),
    ).to.deep.equal([{}]);

    expect(getVAEvidence({ [EVIDENCE_VA]: true, locations: [] })).to.deep.equal(
      [],
    );

    expect(
      getVAEvidence({ [EVIDENCE_VA]: false, locations: [{}] }),
    ).to.deep.equal([]);

    expect(
      getVAEvidence({ [EVIDENCE_VA]: true, locations: [{ test: 'test' }] }),
    ).to.eq(true);
  });
});

describe('getPrivateEvidence', () => {
  it('should return expected value', () => {
    expect(
      getPrivateEvidence({
        [EVIDENCE_PRIVATE]: undefined,
        providerFacility: [{}],
      }),
    ).to.deep.equal([]);
    expect(
      getPrivateEvidence({ [EVIDENCE_PRIVATE]: true, providerFacility: [{}] }),
    ).to.deep.equal([{}]);
    expect(
      getPrivateEvidence({ [EVIDENCE_PRIVATE]: true, providerFacility: [] }),
    ).to.deep.equal([]);
    expect(
      getPrivateEvidence({ [EVIDENCE_PRIVATE]: false, providerFacility: [{}] }),
    ).to.deep.equal([]);
  });
});

describe('getOtherEvidence', () => {
  it('should return expected value', () => {
    expect(
      getOtherEvidence({
        [EVIDENCE_OTHER]: undefined,
        additionalDocuments: [{}],
      }),
    ).to.deep.equal([]);
    expect(
      getOtherEvidence({ [EVIDENCE_OTHER]: true, additionalDocuments: [{}] }),
    ).to.deep.equal([{}]);
    expect(
      getOtherEvidence({ [EVIDENCE_OTHER]: true, additionalDocuments: [] }),
    ).to.deep.equal([]);
    expect(
      getOtherEvidence({ [EVIDENCE_OTHER]: false, additionalDocuments: [{}] }),
    ).to.deep.equal([]);
  });
});

describe('evidenceNeedsUpdating', () => {
  const getEvidence = ({
    hasVa = true,
    hasPrivate = true,
    addIssue = 'abc',
    locations = [{ issues: ['abc', 'def'] }],
    providerFacility = [{ issues: ['abc', 'def'] }],
  } = {}) => {
    return {
      [EVIDENCE_VA]: hasVa,
      [EVIDENCE_PRIVATE]: hasPrivate,
      contestedIssues: [
        {
          attributes: { ratingIssueSubjectText: 'def' },
          [SELECTED]: true,
        },
      ],
      additionalIssues: addIssue ? [{ issue: addIssue, [SELECTED]: true }] : [],
      locations,
      providerFacility,
    };
  };

  it('should return false if no VA evidence selected', () => {
    const evidence = getEvidence({ hasVa: false, hasPrivate: false });
    expect(evidenceNeedsUpdating(evidence)).to.be.false;
  });
  it('should return false if VA evidence undefined', () => {
    const evidence = getEvidence({ hasVa: false, hasPrivate: false });
    expect(evidenceNeedsUpdating({ ...evidence, locations: null })).to.be.false;
  });
  it('should return false if provider facility evidence undefined', () => {
    const evidence = getEvidence({ hasVa: false, hasPrivate: false });
    expect(evidenceNeedsUpdating({ ...evidence, providerFacility: null })).to.be
      .false;
  });
  it('should return false if provider facility evidence undefined', () => {
    expect(evidenceNeedsUpdating({ [EVIDENCE_VA]: true, locations: [{}] })).to
      .be.false;
  });
  it('should return false if no updates needed', () => {
    const evidence = getEvidence();
    expect(evidenceNeedsUpdating(evidence)).to.be.false;
  });
  it('should return true if issue no longer exists', () => {
    const evidence = getEvidence({ addIssue: '' });
    expect(evidenceNeedsUpdating(evidence)).to.be.true;
  });
  it('should return true if issue is renamed', () => {
    const evidence = getEvidence({ addIssue: 'acb' });
    expect(evidenceNeedsUpdating(evidence)).to.be.true;
  });
});

describe('removeNonSelectedIssuesFromEvidence', () => {
  const getData = (addLocation, addProvider) => ({
    contestedIssues: [
      { attributes: { ratingIssueSubjectText: 'test 1' }, [SELECTED]: true },
      { attributes: { ratingIssueSubjectText: 'test 3' }, [SELECTED]: false },
    ],
    additionalIssues: [
      { issue: 'test 2', [SELECTED]: true },
      { issue: 'test 4', [SELECTED]: false },
    ],
    [EVIDENCE_VA]: true,
    locations: [
      {
        foo: true,
        bar: false,
        issues: ['test 1'],
      },
      {
        foo: true,
        bar: false,
        issues: ['test 1', 'test 2', addLocation].filter(Boolean),
      },
    ],
    [EVIDENCE_PRIVATE]: true,
    providerFacility: [
      {
        foo: false,
        bar: true,
        issues: ['test 1'],
      },
      {
        foo: false,
        bar: true,
        issues: ['test 1', 'test 2', addProvider].filter(Boolean),
      },
    ],
  });

  const expected = getData();
  it('should return empty template with empty form data', () => {
    const result = removeNonSelectedIssuesFromEvidence();
    expect(result).to.deep.eq({ locations: [], providerFacility: [] });
  });
  it('should return un-modified evidence issues', () => {
    const data = getData('', '');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
  it('should return remove non-selected location issues', () => {
    const data = getData('test 3', '');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
  it('should return remove non-selected facility issues', () => {
    const data = getData('', 'test 4');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
  it('should return remove non-selected issues', () => {
    const data = getData('test 3', 'test 4');
    const result = removeNonSelectedIssuesFromEvidence(data);
    expect(result).to.deep.eq(expected);
  });
});

describe('onFormLoaded', () => {
  const getLocation = ({ from, treatmentDate }) => ({
    evidenceDates: { from },
    treatmentDate,
    noDate: !treatmentDate,
  });
  const getData = ({ locations = [], redirected = true } = {}) => ({
    [HAS_REDIRECTED]: redirected,
    locations,
  });
  const returnUrl = '/test';

  it('should do nothing when locations is an empty array', () => {
    const router = [];
    const formData = getData();
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal(getData());
    expect(router[0]).to.eq(returnUrl);
  });

  it('should do nothing when feature toggle is not set', () => {
    const router = [];
    const locations = [getLocation({ from: '2010-03-04' })];
    const props = { locations };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal(getData(props));
    expect(router[0]).to.eq(returnUrl);
  });

  it('should update treatment date when feature toggle is set', () => {
    const router = [];
    const from = '2010-03-04';
    const locations = [getLocation({ from })];
    const props = { locations };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [getLocation({ from, treatmentDate: '2010-03' })],
    });
    expect(router[0]).to.eq(returnUrl);
  });

  it('should not update treatment date when it is already defined & feature toggle is set', () => {
    const router = [];
    const from = '2010-03-04';
    const locations = [getLocation({ from, treatmentDate: '2020-04' })];
    const props = { locations };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [getLocation({ from, treatmentDate: '2020-04' })],
    });
    expect(router[0]).to.eq(returnUrl);
  });

  it('should set no date when evidence date and treatment date are undefined & feature toggle is set', () => {
    const router = [];
    const props = { locations: [{}] };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [{ noDate: true, treatmentDate: '' }],
    });
    expect(router[0]).to.eq(returnUrl);
  });

  it('should redirect when redirect flag is not set & feature toggle is set', () => {
    sessionStorage.setItem(HAS_REDIRECTED, 'true');
    const router = [];
    const props = { locations: [{}], redirected: false };
    const formData = getData(props);
    onFormLoaded({ formData, returnUrl, router });
    expect(formData).to.deep.equal({
      ...getData(props),
      locations: [{ noDate: true, treatmentDate: '' }],
    });
    expect(router[0]).to.eq('/housing-risk');
    expect(sessionStorage.getItem(HAS_REDIRECTED)).to.eq('true');
  });
});


{
    "data": {
        "type": "supplementalClaim",
        "attributes": {
            "benefitType": "compensation",
            "claimantType": "veteran",
            "homeless": true,
            "homelessLivingSituation": [
                "I LIVE OR SLEEP IN A PLACE THAT IS NOT MEANT FOR REGULAR SLEEPING",
                "I LIVE IN A SHELTER",
                "I AM STAYING WITH A FRIEND OR FAMILY MEMBER, BECAUSE I AM UNABLE TO OWN A HOME RIGHT NOW",
                "IN THE NEXT 30 DAYS, I WILL HAVE TO LEAVE A FACILITY, LIKE A HOMELESS SHELTER",
                "IN THE NEXT 30 DAYS, I WILL LOSE MY HOME",
                "OTHER"
            ],
            "homelessLivingSituationOther": "Another housing risk",
            "homelessPointOfContact": "Ted Mosby",
            "homelessPointOfContactPhone": {
                "areaCode": "210",
                "phoneNumber": "5550123"
            },
            "mstUpcomingEventDisclosure": "I REVOKE PRIOR CONSENT",
            "veteran": {
                "timezone": "America/Chicago",
                "address": {
                    "addressLine1": "Street",
                    "addressLine2": "812 Harrow Road",
                    "city": "London",
                    "countryCodeISO2": "GB",
                    "zipCode5": "00000",
                    "internationalPostalCode": "W2 1JP"
                },
                "phone": {
                    "countryCode": "1",
                    "areaCode": "210",
                    "phoneNumber": "5551234"
                },
                "email": "vaeventbusdemo@adhocteam.us"
            },
            "form5103Acknowledged": true,
            "evidenceSubmission": {
                "evidenceType": [
                    "retrieval",
                    "upload"
                ],
                "treatmentLocations": [
                    "VA MEDICAL CENTERS (VAMC) AND COMMUNITY-BASED OUTPATIENT CLINICS (CBOC)",
                    "DEPARTMENT OF DEFENSE (DOD) MILITARY TREATMENT FACILITY(IES) (MTF)",
                    "COMMUNITY CARE",
                    "VA VET CENTER",
                    "PRIVATE HEALTH CARE PROVIDER",
                    "OTHER"
                ],
                "treatmentLocationOther": "Some other type of provider",
                "retrieveFrom": [
                    {
                        "type": "retrievalEvidence",
                        "attributes": {
                            "locationAndName": "South Texas VA Facility",
                            "evidenceDates": [
                                {
                                    "startDate": "2000-01-01",
                                    "endDate": "2000-01-01"
                                }
                            ],
                            "noTreatmentDates": false
                        }
                    },
                    {
                        "type": "retrievalEvidence",
                        "attributes": {
                            "locationAndName": "Central California VA Facility",
                            "noTreatmentDates": true
                        }
                    },
                    {
                        "type": "retrievalEvidence",
                        "attributes": {
                            "locationAndName": "Mountaintop Washington VA Facility",
                            "evidenceDates": [
                                {
                                    "startDate": "2020-03-01",
                                    "endDate": "2020-03-01"
                                }
                            ],
                            "noTreatmentDates": false
                        }
                    },
                    {
                        "type": "retrievalEvidence",
                        "attributes": {
                            "locationAndName": "South Texas VA Facility",
                            "evidenceDates": [
                                {
                                    "startDate": "2000-07-01",
                                    "endDate": "2000-07-01"
                                }
                            ],
                            "noTreatmentDates": false
                        }
                    }
                ]
            },
            "socOptIn": true
        }
    },
    "included": [
        {
            "type": "contestableIssue",
            "attributes": {
                "issue": "Hypertension",
                "decisionDate": "2023-01-10"
            }
        },
        {
            "type": "contestableIssue",
            "attributes": {
                "issue": "Tinnitus",
                "decisionDate": "2020-08-08"
            }
        },
        {
            "type": "contestableIssue",
            "attributes": {
                "issue": "Right Knee Injury",
                "decisionDate": "2018-05-15"
            }
        },
        {
            "type": "contestableIssue",
            "attributes": {
                "issue": "Migraines",
                "decisionDate": "1999-03-29"
            }
        }
    ],
    "form4142": {
        "privacyAgreementAccepted": true,
        "limitedConsent": "Limited consent details",
        "providerFacility": [
            {
                "providerFacilityName": "Provider One",
                "providerFacilityAddress": {
                    "country": "USA",
                    "street": "123 Main Street",
                    "street2": "Street address 2",
                    "city": "San Antonio",
                    "state": "TX",
                    "postalCode": "78258"
                },
                "issues": [
                    "Hypertension",
                    "Migraines"
                ],
                "treatmentDateRange": [
                    {
                        "from": "2020-10-10",
                        "to": "2020-11-10"
                    }
                ]
            },
            {
                "providerFacilityName": "Provider Two",
                "providerFacilityAddress": {
                    "country": "USA",
                    "street": "456 Elm Street",
                    "street2": "",
                    "city": "Madison",
                    "state": "WI",
                    "postalCode": "47676"
                },
                "issues": [
                    "Tinnitus",
                    "Migraines"
                ],
                "treatmentDateRange": [
                    {
                        "from": "2017-06-06",
                        "to": "2017-10-06"
                    }
                ]
            },
            {
                "providerFacilityName": "Provider Three",
                "providerFacilityAddress": {
                    "country": "USA",
                    "street": "789 Maple Avenue",
                    "street2": "",
                    "city": "Montgomery",
                    "state": "AL",
                    "postalCode": "94737"
                },
                "issues": [
                    "Tinnitus",
                    "Right Knee Injury"
                ],
                "treatmentDateRange": [
                    {
                        "from": "2018-02-20",
                        "to": "2018-02-21"
                    }
                ]
            },
            {
                "providerFacilityName": "Provider Three",
                "providerFacilityAddress": {
                    "country": "USA",
                    "street": "909 Sycamore Blvd",
                    "street2": "Line 2",
                    "city": "Sacramento",
                    "state": "CA",
                    "postalCode": "47367"
                },
                "issues": [
                    "Tinnitus",
                    "Right Knee Injury",
                    "Migraines"
                ],
                "treatmentDateRange": [
                    {
                        "from": "1999-06-10",
                        "to": "1999-06-11"
                    }
                ]
            }
        ]
    },
    "additionalDocuments": [
        {
            "name": "2018-4142-Form.pdf",
            "size": 742917,
            "confirmationCode": "0bdbc758-a74b-47ef-8598-5fa9e4d904ab",
            "attachmentId": "L023",
            "isEncrypted": false
        },
        {
            "name": "2021-4142-Form.pdf",
            "size": 1028976,
            "confirmationCode": "22a53c79-d944-492e-9ecc-1fd5257d9f99",
            "attachmentId": "L048",
            "isEncrypted": false
        }
    ]
}