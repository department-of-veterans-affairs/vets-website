import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'platform/utilities/data';

import formConfig from '../../config/form';
import {
  transformRelatedDisabilities,
  stringifyRelatedDisabilities,
  getFlatIncidentKeys,
  getPtsdChangeText,
  setActionTypes,
  filterServicePeriods,
  cleanUpPersonsInvolved,
  transformTreatmentFacilities,
  transformProviderFacility,
  transformVaFacility,
  extractDateParts,
  addForm4142,
  addForm0781,
  addForm0781V2,
  delete0781BehavioralData,
  sanitize0781PoliceReportData,
  sanitize0781BehaviorsDetails,
  normalizeIncreases,
  sanitizeNewDisabilities,
  removeRatedDisabilityFromNew,
  removeExtraData,
  cleanUpMailingAddress,
} from '../../utils/submit';
import {
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  disabilityActionTypes,
} from '../../constants';

import maximalData from '../fixtures/data/maximal-test.json';

const base = () => ({
  ratedDisabilities: [
    { name: 'Tinnitus', ratingPercentage: 10 },
    { name: 'Sciatica', ratingPercentage: 20 },
  ],
});

describe('transformRelatedDisabilities', () => {
  it('should not throw an error', () => {
    expect(transformRelatedDisabilities({ '': true }, [undefined, ''])).to.eql(
      [],
    );
  });
  it('should return an array of strings', () => {
    const claimedConditions = ['Some Condition Name', 'Another Condition Name'];
    const treatedDisabilityNames = {
      someconditionname: true,
      anotherconditionname: true,
      thisconditionisfalsey: false,
    };
    expect(
      transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
    ).to.eql(['Some Condition Name', 'Another Condition Name']);
  });
  it('should not add conditions if they are not claimed', () => {
    const claimedConditions = ['Some Condition Name'];
    const treatedDisabilityNames = {
      someconditionname: true,
      anotherconditionname: true,
      thisconditionisfalsey: false,
    };
    expect(
      transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
    ).to.eql(['Some Condition Name']);
  });
});

describe('stringifyRelatedDisabilities', () => {
  it('should return an empty object if undefined', () => {
    expect(stringifyRelatedDisabilities({})).to.be.empty;
  });
  it('should return an empty object with an empty array', () => {
    const formData = {
      vaTreatmentFacilities: [],
    };
    expect(stringifyRelatedDisabilities(formData)).to.be.empty;
  });
  it('should return an array of strings', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'some condition name',
        },
        {
          condition: 'another condition name',
        },
        {
          condition: 'this condition is falsey!',
        },
      ],
      vaTreatmentFacilities: [
        {
          treatedDisabilityNames: {
            someconditionname: true,
            anotherconditionname: true,
            thisconditionisfalsey: false,
          },
        },
      ],
    };
    expect(
      stringifyRelatedDisabilities(formData).vaTreatmentFacilities,
    ).to.deep.equal([
      {
        treatedDisabilityNames: [
          'some condition name',
          'another condition name',
        ],
      },
    ]);
  });
  it('will not add conditions to treatment names if they are not claimed', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'some condition name',
        },
        {
          condition: 'this condition is falsey!',
        },
        {
          condition: 'something with symbols *($#^%$@) not in the key',
        },
      ],
      vaTreatmentFacilities: [
        {
          treatedDisabilityNames: {
            someconditionname: true,
            anotherconditionname: true,
            thisconditionisfalsey: false,
            somethingwithsymbolsnotinthekey: true,
          },
        },
      ],
    };
    expect(
      stringifyRelatedDisabilities(formData).vaTreatmentFacilities,
    ).to.deep.equal([
      {
        treatedDisabilityNames: [
          'some condition name',
          'something with symbols *($#^%$@) not in the key',
        ],
      },
    ]);
  });
});

describe('getFlatIncidentKeys', () => {
  it('should return correct amount of incident keys', () => {
    expect(getFlatIncidentKeys().length).to.eql(PTSD_INCIDENT_ITERATION * 2);
  });
});

describe('getPtsdChangeText', () => {
  it('should have valid labels', () => {
    Object.keys(PTSD_CHANGE_LABELS).forEach(key => {
      expect(PTSD_CHANGE_LABELS[key]).to.be.a('string');
    });
  });

  const ignoredFields = ['other', 'otherExplanation', 'noneApply'];
  it('should have mappings for all workBehaviorChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.workBehaviorChanges.schema
        .properties.workBehaviorChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).to.have.property(key);
      });
  });

  it('should have mappings for all mentalHealthChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.mentalHealthChanges.schema
        .properties.mentalChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).to.have.property(key);
      });
  });

  it('should have mappings for all physicalHealthChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.physicalHealthChanges.schema
        .properties.physicalChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).to.have.property(key);
      });
  });

  it('should have mappings for all socialBehaviorChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.socialBehaviorChanges.schema
        .properties.socialBehaviorChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).to.have.property(key);
      });
  });

  it('should return UI titles', () => {
    const fieldTitles = getPtsdChangeText({
      increasedLeave: true,
      withdrawal: true,
      field2: true,
      other: true,
      otherExplanation: 'Other change',
    });

    expect(fieldTitles.length).to.eql(2);
  });

  it('should correctly handle undefined ptsd changes', () => {
    const fieldTitles = getPtsdChangeText(undefined);
    expect(fieldTitles.length).to.eql(0);
  });
});

describe('setActionTypes', () => {
  const formData = maximalData.data;

  it('should set disabilityActionType for each disability properly', () => {
    const formattedDisabilities = setActionTypes(formData).ratedDisabilities;

    expect(formattedDisabilities).to.have.lengthOf(
      formData.ratedDisabilities.length,
    );

    expect(formattedDisabilities[0].disabilityActionType).to.equal(
      disabilityActionTypes.INCREASE,
    );
    expect(formattedDisabilities[1].disabilityActionType).to.equal(
      disabilityActionTypes.INCREASE,
    );
    expect(formattedDisabilities[2].disabilityActionType).to.equal(
      disabilityActionTypes.NONE,
    );
    expect(formattedDisabilities[3].disabilityActionType).to.equal(
      disabilityActionTypes.NONE,
    );
  });

  it('should return cloned formData when no rated disabilities', () => {
    const noRated = _.omit('ratedDisabilities', formData);

    expect(setActionTypes(noRated)).to.deep.equal(noRated);
  });

  it('marks INCREASE when listed in newDisabilities (preferred path)', () => {
    const data = {
      ratedDisabilities: [{ name: 'Tinnitus' }, { name: 'Sciatica' }],
      newDisabilities: [{ ratedDisability: 'Tinnitus' }],
    };

    const out = setActionTypes(data);

    expect(
      out.ratedDisabilities.find(d => d.name === 'Tinnitus')
        .disabilityActionType,
    ).to.equal(disabilityActionTypes.INCREASE);
    expect(
      out.ratedDisabilities.find(d => d.name === 'Sciatica')
        .disabilityActionType,
    ).to.equal(disabilityActionTypes.NONE);
  });

  it('should fallback to use view:selected when newDisabilities is empty', () => {
    const data = {
      ...base(),
      ratedDisabilities: [
        { name: 'Tinnitus', 'view:selected': true },
        { name: 'Sciatica' },
      ],
      newDisabilities: [],
    };

    const out = setActionTypes(data);
    expect(
      out.ratedDisabilities.find(d => d.name === 'Tinnitus')
        .disabilityActionType,
    ).to.equal(disabilityActionTypes.INCREASE);
    expect(
      out.ratedDisabilities.find(d => d.name === 'Sciatica')
        .disabilityActionType,
    ).to.equal(disabilityActionTypes.NONE);
  });

  it('prefers newDisabilities over view:selected when both present', () => {
    const data = {
      ...base(),
      newDisabilities: [{ ratedDisability: 'Sciatica' }],
    };

    data.ratedDisabilities[0]['view:selected'] = true;

    const out = setActionTypes(data);

    expect(
      out.ratedDisabilities.find(d => d.name === 'Sciatica')
        .disabilityActionType,
    ).to.equal(disabilityActionTypes.INCREASE);
    expect(
      out.ratedDisabilities.find(d => d.name === 'Tinnitus')
        .disabilityActionType,
    ).to.equal(disabilityActionTypes.NONE);
  });
});

describe('remove unreferenced reservedNationGuardService', () => {
  const formData = _.cloneDeep(maximalData.data);
  // Modify service names to remove "Reserves" & "National Guard"
  formData.serviceInformation.servicePeriods[0].serviceBranch = 'Air Force';
  formData.serviceInformation.servicePeriods[1].serviceBranch = 'Navy';
  const processedServiceInfo = filterServicePeriods(formData);
  expect(processedServiceInfo.serviceInformation.reservesNationalGuardService)
    .to.be.undefined;
});

describe('cleanUpPersonsInvolved', () => {
  it('should add injuryDeath and injuryDeathOther to empty entry', () => {
    const incident = {
      personsInvolved: [{ name: {}, 'view:individualAddMsg': {} }],
    };
    expect(cleanUpPersonsInvolved(incident)).to.deep.equal({
      personsInvolved: [
        {
          name: {
            first: '',
            middle: '',
            last: '',
          },
          'view:individualAddMsg': {},
          injuryDeath: 'other',
          injuryDeathOther: 'Entry left blank',
        },
      ],
    });
  });
  it('should only modify empty entries & add an empty name object', () => {
    const person = {
      name: {
        first: 'First',
        middle: 'Person',
        last: 'Name',
      },
      injuryDeath: 'killedInAction',
      injuryDeathDate: '1900-01-01',
      description: 'Description.',
      'view:serviceMember': false,
      'view:individualAddMsg': {},
    };
    const incident = {
      personsInvolved: [
        person,
        {
          name: {
            first: 'test',
          },
          'view:individualAddMsg': {},
        },
        {
          injuryDeath: 'other',
          description: 'should not change',
        },
      ],
    };
    expect(cleanUpPersonsInvolved(incident)).to.deep.equal({
      personsInvolved: [
        person,
        {
          name: {
            first: 'test',
            middle: '',
            last: '',
          },
          'view:individualAddMsg': {},
          injuryDeath: 'other',
          injuryDeathOther: 'Entry left blank',
        },
        {
          name: {
            first: '',
            middle: '',
            last: '',
          },
          injuryDeath: 'other',
          description: 'should not change',
        },
      ],
    });
  });
});

describe('addForm4142', () => {
  it('should return the formData as is if providerFacility is undefined', () => {
    const formData = {};
    const result = addForm4142(formData);
    expect(result).to.equal(formData);
  });

  it('should include limitedConsent if provided', () => {
    const formData = {
      providerFacility: [{ name: 'Facility A' }],
      limitedConsent: true,
    };

    const result = addForm4142(formData);
    expect(result.form4142.limitedConsent).to.equal(true);
  });

  it('should delete providerFacility if syncModern0781Flow is false', () => {
    const formData = {
      syncModern0781Flow: false,
      providerFacility: [{ name: 'Facility A' }],
    };

    const result = addForm4142(formData);
    expect(result).to.not.have.property('providerFacility');
  });

  it('should retain providerFacility if syncModern0781Flow is true', () => {
    const formData = {
      syncModern0781Flow: true,
      providerFacility: [{ name: 'Facility A' }],
    };
    const transformedFacility = [
      {
        name: 'Facility A',
        treatmentDateRange: [undefined],
        treatedDisabilityNames: [],
      },
    ];
    const stub = sinon
      .stub(addForm4142, 'transformProviderFacilities')
      .returns(transformedFacility);
    const result = addForm4142(formData);
    expect(result.form4142.providerFacility).to.deep.equal(transformedFacility);
    stub.restore();
  });

  it('should return an object without providerFacility if it is not transformed and syncModern0781Flow is false', () => {
    const formData = {
      providerFacility: [{ name: 'Facility A' }],
      syncModern0781Flow: false,
    };

    const result = addForm4142(formData);
    expect(result).to.not.have.property('providerFacility');
    expect(result.form4142).to.have.property('providerFacility');
  });
});

describe('addForm0781', () => {
  it('should return an empty object', () => {
    expect(addForm0781({})).to.deep.equal({});
  });

  it('should return the same object if syncModern0781Flow is true', () => {
    const formDataSyncModern0781True = {
      syncModern0781Flow: true,
      incident0: {
        incidentLocation: { country: 'USA' },
      },
      secondaryIncident0: {
        incidentLocation: { country: 'USA' },
      },
      additionalRemarks781: 'additionalRemarks781',
      additionalIncidentText: 'additionalIncidentText',
      additionalSecondaryIncidentText: 'additionalSecondaryIncidentText',
      physicalChanges: { lethargy: true },
    };

    const result = addForm0781(formDataSyncModern0781True);

    expect(result).to.deep.equal(formDataSyncModern0781True);
  });

  it('should skip empty entries', () => {
    const data = {
      incident0: {
        incidentLocation: {
          country: 'USA',
          state: 'AL',
          city: 'asdf',
          additionalDetails: 'Additional details here.',
        },
        incidentDescription: 'A thing happened.',
        personsInvolved: [
          {
            'view:serviceMember': true,
            name: { first: 'First', middle: 'Middle', last: 'Last' },
            injuryDeath: 'injuredNonBattle',
            injuryDeathDate: '2010-05-01',
            description: 'description 0',
          },
          {
            name: {},
          },
          {
            'view:serviceMember': false,
            name: {},
            injuryDeath: 'other',
            injuryDeathOther: 'Some other',
            description: 'description 2',
          },
        ],
        unitAssigned: 'Unit name here',
        unitAssignedDates: {
          from: '2010-01-01',
          to: '2011-01-01',
        },
        incidentDate: '2010-05-01',
        medalsCitations: 'None',
      },
      incident1: {
        incidentLocation: {
          country: 'USA',
        },
      },
      incident2: {
        incidentLocation: {
          country: 'USA',
        },
      },
      secondaryIncident0: {
        incidentLocation: {
          country: 'USA',
        },
      },
      secondaryIncident1: {
        incidentLocation: {
          country: 'USA',
        },
      },
      secondaryIncident2: {
        incidentLocation: {
          country: 'USA',
        },
      },
      additionalRemarks781: 'additionalRemarks781',
      additionalIncidentText: 'additionalIncidentText',
      additionalSecondaryIncidentText: 'additionalSecondaryIncidentText',
      physicalChanges: { lethargy: true },
      mentalChanges: { fear: true },
      workBehaviorChanges: { increasedLeave: true },
      socialBehaviorChanges: { unexplained: true },
      additionalChanges: {},
    };

    expect(addForm0781(data)).to.deep.equal({
      form0781: {
        incidents: [
          {
            incidentDescription: 'A thing happened.',
            personsInvolved: [
              {
                'view:serviceMember': true,
                name: { first: 'First', middle: 'Middle', last: 'Last' },
                injuryDeath: 'injuredNonBattle',
                injuryDeathDate: '2010-05-01',
                description: 'description 0',
              },
              {
                name: { first: '', middle: '', last: '' },
                injuryDeath: 'other',
                injuryDeathOther: 'Entry left blank',
              },
              {
                'view:serviceMember': false,
                name: { first: '', middle: '', last: '' },
                injuryDeath: 'other',
                injuryDeathOther: 'Some other',
                description: 'description 2',
              },
            ],
            incidentLocation: {
              additionalDetails: 'Additional details here.',
              city: 'asdf',
              country: 'USA',
              state: 'AL',
            },
            unitAssigned: 'Unit name here',
            unitAssignedDates: { from: '2010-01-01', to: '2011-01-01' },
            incidentDate: '2010-05-01',
            medalsCitations: 'None',
            personalAssault: false,
          },
          {
            incidentLocation: { country: 'USA' },
            personalAssault: false,
          },
          {
            incidentLocation: { country: 'USA' },
            personalAssault: false,
          },
          {
            incidentLocation: { country: 'USA' },
            personalAssault: true,
          },
          {
            incidentLocation: { country: 'USA' },
            personalAssault: true,
          },
          {
            incidentLocation: { country: 'USA' },
            personalAssault: true,
          },
        ],
        additionalIncidentText: 'additionalIncidentText',
        additionalSecondaryIncidentText: 'additionalSecondaryIncidentText',
        otherInformation: [
          'Lethargy',
          'Unexplained social behavior changes',
          'Increased fear of surroundings, inability to go to certain areas',
          'Increased use of leave',
        ],
        remarks: 'additionalRemarks781',
      },
    });
  });
});

describe('transformTreatmentFacilities', () => {
  it('should return an empty array if both providerFacilities and vaFacilities are empty', () => {
    const result = transformTreatmentFacilities([], []);
    expect(result).to.be.an('array').that.is.empty;
  });

  it('should filter out facilities where `treatmentLocation0781Related` is false', () => {
    const providerFacilities = [
      {
        treatmentLocation0781Related: false,
        providerFacilityName: 'Provider Facility 1',
      },
      {
        treatmentLocation0781Related: true,
        providerFacilityName: 'Provider Facility 2',
      },
    ];
    const vaFacilities = [
      {
        treatmentLocation0781Related: false,
        treatmentCenterName: 'VA Facility 1',
      },
      {
        treatmentLocation0781Related: true,
        treatmentCenterName: 'VA Facility 2',
      },
    ];
    const result = transformTreatmentFacilities(
      providerFacilities,
      vaFacilities,
    );
    expect(result).to.have.lengthOf(2);
    expect(result[0].facilityInfo).to.include('Provider Facility 2');
    expect(result[1].facilityInfo).to.include('VA Facility 2');
  });

  it('should correctly transform a provider facility', () => {
    const providerFacility = {
      treatmentLocation0781Related: true,
      providerFacilityName: 'Provider Facility 1',
      providerFacilityAddress: {
        street: '123 Main St',
        city: 'Somewhere',
        state: 'CA',
        postalCode: '12345',
        country: 'USA',
      },
      treatmentDateRange: { from: '2022-05-15' },
    };

    const transformed = transformProviderFacility(providerFacility);

    expect(transformed)
      .to.have.property('facilityInfo')
      .that.includes('Provider Facility 1');
    expect(transformed).to.have.property('treatmentMonth', '05');
    expect(transformed).to.have.property('treatmentYear', '2022');
  });

  it('should correctly transform a VA facility', () => {
    const vaFacility = {
      treatmentLocation0781Related: true,
      treatmentCenterName: 'VA Center 1',
      treatmentCenterAddress: {
        city: 'Another City',
        state: 'NY',
        country: 'USA',
      },
      treatmentDateRange: { from: '2023-08-22' },
    };

    const transformed = transformVaFacility(vaFacility);

    expect(transformed)
      .to.have.property('facilityInfo')
      .that.includes('VA Center 1');
    expect(transformed).to.have.property('treatmentMonth', '08');
    expect(transformed).to.have.property('treatmentYear', '2023');
  });

  it('should correctly combine provider and VA facilities', () => {
    const providerFacilities = [
      {
        treatmentLocation0781Related: true,
        providerFacilityName: 'Provider Facility 1',
      },
      {
        treatmentLocation0781Related: false,
        providerFacilityName: 'Provider Facility 2',
      },
    ];
    const vaFacilities = [
      {
        treatmentLocation0781Related: true,
        treatmentCenterName: 'VA Facility 1',
      },
      {
        treatmentLocation0781Related: true,
        treatmentCenterName: 'VA Facility 2',
      },
    ];

    const result = transformTreatmentFacilities(
      providerFacilities,
      vaFacilities,
    );
    expect(result).to.have.lengthOf(3);
    expect(result[0].facilityInfo).to.include('Provider Facility 1');
    expect(result[1].facilityInfo).to.include('VA Facility 1');
    expect(result[2].facilityInfo).to.include('VA Facility 2');
  });
});

describe('extractDateParts', () => {
  it('should correctly extract the month and year from a valid date string', () => {
    const result = extractDateParts('2022-05-15');
    expect(result).to.deep.equal({
      treatmentMonth: '05',
      treatmentYear: '2022',
    });
  });

  it('should return an empty treatmentMonth if the month is missing or non-numeric', () => {
    const result = extractDateParts('2022-XX-XX');
    expect(result).to.deep.equal({ treatmentMonth: '', treatmentYear: '2022' });
  });

  it('should return empty strings if both the year and month are missing or non-numeric', () => {
    const result = extractDateParts('XXXX-XX-XX');
    expect(result).to.deep.equal({ treatmentMonth: '', treatmentYear: '' });
  });

  it('should return empty strings if the date string is undefined', () => {
    const result = extractDateParts(undefined);
    expect(result).to.deep.equal({ treatmentMonth: '', treatmentYear: '' });
  });

  it('should return empty strings if the date string is invalid or missing', () => {
    const result = extractDateParts('invalid-date');
    expect(result).to.deep.equal({ treatmentMonth: '', treatmentYear: '' });
  });
});

describe('addForm0781V2', () => {
  const formData = {
    syncModern0781Flow: true,
    answerCombatBehaviorQuestions: 'true',
    eventTypes: {
      combat: true,
      mst: true,
    },
    events: [
      {
        location: 'Where did the event happen?',
        otherReports: 'Other official report type listed here',
        timing: 'When did the event happen?',
        reports: {
          restricted: true,
          unrestricted: true,
          police: true,
          none: true,
        },
        agency: 'Name of the agency that issued the report',
        city: 'report city',
        state: 'report state',
        township: 'report township',
        country: 'USA',
      },
      {
        location: 'Where did the event happen?',
        otherReports: 'Other official report type listed here',
        reports: {
          restricted: true,
          unrestricted: true,
          police: false,
          none: true,
        },
        agency: 'Name of the agency that issued the report',
        city: 'report city',
        state: 'report state',
        township: 'report township',
        country: 'USA',
      },
      {
        location: 'Where did the event happen?',
        reports: {
          restricted: true,
          unrestricted: true,
          police: true,
          none: true,
        },
        agency: 'Name of the agency that issued the report',
        city: 'report city',
        state: 'report state',
        township: 'report township',
        country: 'USA',
      },
    ],
    workBehaviors: { reassignment: true },
    healthBehaviors: { medications: true },
    otherBehaviors: { unlisted: true },
    behaviorsDetails: {
      reassignment: 'details',
      medications: 'details',
      unlisted: 'details',
    },
    supportingEvidenceReports: { police: true },
    supportingEvidenceRecords: { physicians: true },
    supportingEvidenceWitness: { family: true },
    supportingEvidenceOther: { personal: true },
    supportingEvidenceUnlisted: 'unlisted document',
    supportingEvidenceNoneCheckbox: true,
    treatmentReceivedVaProvider: true,
    treatmentReceivedNonVaProvider: true,
    treatmentNoneCheckbox: true,
    providerFacility: [
      {
        providerFacilityName: 'facility1',
        treatmentLocation0781Related: true,
      },
    ],
    vaTreatmentFacilities: [
      {
        treatmentCenterName: 'Treatment Center the First',
        treatmentLocation0781Related: true,
      },
      {
        treatmentCenterName: 'Treatment Center the Second',
        treatmentLocation0781Related: false,
      },
      {
        treatmentCenterName: 'Treatment Center the Third',
      },
    ],
    optionIndicator: 'notEnrolled',
    additionalInformation: 'info',
    mentalHealthWorkflowChoice: 'optForOnlineForm0781',
  };

  it('should delete 0781 form data if user opted out', () => {
    const data = {
      ...formData,
      mentalHealthWorkflowChoice: 'optOutOfForm0781',
    };
    const expectedResult = {
      providerFacility: [
        {
          providerFacilityName: 'facility1',
          treatmentLocation0781Related: true,
        },
      ],
      vaTreatmentFacilities: [
        {
          treatmentCenterName: 'Treatment Center the First',
          treatmentLocation0781Related: true,
        },
        {
          treatmentCenterName: 'Treatment Center the Second',
          treatmentLocation0781Related: false,
        },
        {
          treatmentCenterName: 'Treatment Center the Third',
        },
      ],
      answerCombatBehaviorQuestions: 'true',
      mentalHealthWorkflowChoice: 'optOutOfForm0781',
      syncModern0781Flow: true,
    };

    const result = addForm0781V2(data);
    expect(result).to.deep.equal(expectedResult);
  });

  it('should delete 0781 form data if user submits paper form', () => {
    const data = {
      ...formData,
      mentalHealthWorkflowChoice: 'optForPaperForm0781Upload',
    };
    const expectedResult = {
      providerFacility: [
        {
          providerFacilityName: 'facility1',
          treatmentLocation0781Related: true,
        },
      ],
      vaTreatmentFacilities: [
        {
          treatmentCenterName: 'Treatment Center the First',
          treatmentLocation0781Related: true,
        },
        {
          treatmentCenterName: 'Treatment Center the Second',
          treatmentLocation0781Related: false,
        },
        {
          treatmentCenterName: 'Treatment Center the Third',
        },
      ],
      answerCombatBehaviorQuestions: 'true',
      mentalHealthWorkflowChoice: 'optForPaperForm0781Upload',
      syncModern0781Flow: true,
    };

    const result = addForm0781V2(data);
    expect(result).to.deep.equal(expectedResult);
  });

  it('delete0781BehavioralData removes all behavioral data when answerCombatBehaviorQuestions is false', () => {
    const data = {
      answerCombatBehaviorQuestions: 'false',
      workBehaviors: { reassignment: true },
      healthBehaviors: { medications: true },
      otherBehaviors: { unlisted: true },
      behaviorsDetails: {
        reassignment: 'details',
        medications: 'details',
        unlisted: 'details',
      },
    };

    const expected = {
      answerCombatBehaviorQuestions: 'false',
    };

    const result =
      data.answerCombatBehaviorQuestions === 'false'
        ? delete0781BehavioralData(data)
        : data;

    expect(result).to.deep.equal(expected);
  });

  it('sanitize0781PoliceReportData properly removes police report location data when conditions are met', () => {
    const data = {
      events: [
        {
          location: 'Where did the event happen?',
          otherReports: 'Other official report type listed here',
          timing: 'When did the event happen?',
          reports: {
            restricted: true,
            unrestricted: true,
            police: true,
            none: true,
          },
          agency: 'Name of the agency that issued the report',
          city: 'report city',
          state: 'report state',
          township: 'report township',
          country: 'USA',
        },
        {
          location: 'Where did the event happen?',
          otherReports: 'Other official report type listed here',
          reports: {
            restricted: true,
            unrestricted: true,
            police: false,
            none: true,
          },
          agency: 'Name of the agency that issued the report',
          city: 'report city',
          state: 'report state',
          township: 'report township',
          country: 'USA',
        },
        {
          location: 'Where did the event happen?',
          agency: 'Name of the agency that issued the report',
          city: 'report city',
          state: 'report state',
          township: 'report township',
          country: 'USA',
        },
      ],
    };
    const expectedResult = {
      events: [
        {
          location: 'Where did the event happen?',
          timing: 'When did the event happen?',
          otherReports: 'Other official report type listed here',
          reports: {
            restricted: true,
            unrestricted: true,
            police: true,
            none: true,
          },
          agency: 'Name of the agency that issued the report',
          city: 'report city',
          state: 'report state',
          township: 'report township',
          country: 'USA',
        },
        {
          location: 'Where did the event happen?',
          otherReports: 'Other official report type listed here',
          reports: {
            restricted: true,
            unrestricted: true,
            police: false,
            none: true,
          },
        },
        {
          location: 'Where did the event happen?',
        },
      ],
    };

    const result = sanitize0781PoliceReportData(data);
    expect(result).to.deep.equal(expectedResult);
  });

  describe('sanitize0781BehaviorsDetails', () => {
    it('removes behavior details not selected in any behavior group', () => {
      const data = {
        workBehaviors: { reassignment: true },
        healthBehaviors: { medications: false },
        otherBehaviors: { unlisted: false },
        behaviorsDetails: {
          reassignment: 'Work detail',
          medications: 'Health detail',
          unlisted: 'Other detail',
        },
      };

      const expected = {
        workBehaviors: { reassignment: true },
        healthBehaviors: { medications: false },
        otherBehaviors: { unlisted: false },
        behaviorsDetails: {
          reassignment: 'Work detail',
        },
      };

      const result = sanitize0781BehaviorsDetails(data);
      expect(result).to.deep.equal(expected);
    });

    it('clears all behavior details when noBehavioralChange.noChange is true', () => {
      const data = {
        noBehavioralChange: { noChange: true },
        behaviorsDetails: {
          reassignment: 'Work detail',
          medications: 'Health detail',
          unlisted: 'Other detail',
        },
      };

      const expected = {
        noBehavioralChange: { noChange: true },
        behaviorsDetails: {},
      };

      const result = sanitize0781BehaviorsDetails(data);
      expect(result).to.deep.equal(expected);
    });
  });

  it('should return the same object if syncModern0781Flow is false', () => {
    const formDataSyncModern0781False = {
      syncModern0781Flow: false,
      eventTypes: ['eventType1'],
      workBehaviors: ['workBehavior1'],
      mentalHealthWorkflowChoice: 'optForOnlineForm0781',
    };

    const result = addForm0781V2(formDataSyncModern0781False);
    expect(result).to.deep.equal(formDataSyncModern0781False);
  });

  it('should clone the object and add the form0781 property if syncModern0781Flow is true', () => {
    const result = addForm0781V2(formData);

    expect(result).to.have.property('form0781');
    expect(result.form0781).to.deep.include({
      eventTypes: formData.eventTypes,
      events: formData.events,
      workBehaviors: formData.workBehaviors,
      healthBehaviors: formData.healthBehaviors,
      otherBehaviors: formData.otherBehaviors,
      behaviorsDetails: formData.behaviorsDetails,
      supportingEvidenceReports: formData.supportingEvidenceReports,
      supportingEvidenceRecords: formData.supportingEvidenceRecords,
      supportingEvidenceWitness: formData.supportingEvidenceWitness,
      supportingEvidenceOther: formData.supportingEvidenceOther,
      supportingEvidenceUnlisted: formData.supportingEvidenceUnlisted,
      supportingEvidenceNoneCheckbox: formData.supportingEvidenceNoneCheckbox,
      treatmentReceivedVaProvider: formData.treatmentReceivedVaProvider,
      treatmentReceivedNonVaProvider: formData.treatmentReceivedNonVaProvider,
      treatmentNoneCheckbox: formData.treatmentNoneCheckbox,
      treatmentProvidersDetails: result.form0781.treatmentProvidersDetails,
      optionIndicator: formData.optionIndicator,
      additionalInformation: formData.additionalInformation,
    });
  });

  it('should remove the specified properties from the cloned data', () => {
    const result = addForm0781V2(formData);

    expect(result).to.not.have.property('eventTypes');
    expect(result).to.not.have.property('events');
    expect(result).to.not.have.property('workBehaviors');
    expect(result).to.not.have.property('healthBehaviors');
    expect(result).to.not.have.property('otherBehaviors');
    expect(result).to.not.have.property('behaviorsDetails');
    expect(result).to.not.have.property('supportingEvidenceReports');
    expect(result).to.not.have.property('supportingEvidenceRecords');
    expect(result).to.not.have.property('supportingEvidenceWitness');
    expect(result).to.not.have.property('supportingEvidenceOther');
    expect(result).to.not.have.property('supportingEvidenceUnlisted');
    expect(result).to.not.have.property('supportingEvidenceNoneCheckbox');
    expect(result).to.not.have.property('treatmentReceivedVaProvider');
    expect(result).to.not.have.property('treatmentReceivedNonVaProvider');
    expect(result).to.not.have.property('treatmentNoneCheckbox');
    expect(result).to.not.have.property('providerFacility');
    expect(result).to.not.have.property('optionIndicator');
    expect(result).to.not.have.property('additionalInformation');
  });

  it('should only add treatmentProvidersDetails if providerFacility or vaTreatmentFacilities exist', () => {
    const result = addForm0781V2(formData);

    expect(result.form0781).to.have.property('treatmentProvidersDetails');

    formData.providerFacility = [];
    formData.vaTreatmentFacilities = ['vaFacility1'];

    const resultWithVaFacilities = addForm0781V2(formData);

    expect(resultWithVaFacilities.form0781).to.have.property(
      'treatmentProvidersDetails',
    );
  });
});

describe('normalizeIncreases', () => {
  it('returns original formData when feature flag is not enabled', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Tinnitus' }],
      newDisabilities: [
        {
          condition: 'Rated disability',
          ratedDisability: 'Tinnitus',
          conditionDate: '2020-01-01',
        },
      ],
    };

    const result = normalizeIncreases(formData);
    expect(result).to.equal(formData);
  });

  it('moves matching increases from newDisabilities into ratedDisabilities and marks them as INCREASE', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
      ratedDisabilities: [
        { name: 'Tinnitus' },
        { name: 'Sciatica', approximateDate: '2019-01-01' },
      ],
      newDisabilities: [
        {
          condition: 'Rated disability',
          ratedDisability: 'Tinnitus',
          conditionDate: '2020-01-01',
        },
        {
          condition: 'Some new condition',
          cause: 'NEW',
        },
      ],
    };

    const result = normalizeIncreases(formData);
    expect(result.ratedDisabilities).to.have.lengthOf(2);

    const tinnitus = result.ratedDisabilities.find(d => d.name === 'Tinnitus');
    const sciatica = result.ratedDisabilities.find(d => d.name === 'Sciatica');

    expect(tinnitus['view:selected']).to.be.true;
    expect(tinnitus.disabilityActionType).to.equal(
      disabilityActionTypes.INCREASE,
    );
    expect(tinnitus.approximateDate).to.equal('2020-01-01');
    expect(sciatica.approximateDate).to.equal('2019-01-01');
    expect(result.newDisabilities).to.deep.equal([
      {
        condition: 'Some new condition',
        cause: 'NEW',
      },
    ]);
  });

  it('handles newPrimaryDisabilities the same as newDisabilities', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
      ratedDisabilities: [{ name: 'Sciatica' }],
      newPrimaryDisabilities: [
        {
          condition: 'Rated disability',
          ratedDisability: 'Sciatica',
          conditionDate: '2021-02-02',
        },
        {
          condition: 'Brand new primary condition',
          cause: 'NEW',
        },
      ],
    };

    const result = normalizeIncreases(formData);
    const sciatica = result.ratedDisabilities[0];

    expect(sciatica['view:selected']).to.be.true;
    expect(sciatica.disabilityActionType).to.equal(
      disabilityActionTypes.INCREASE,
    );
    expect(sciatica.approximateDate).to.equal('2021-02-02');

    expect(result.newPrimaryDisabilities).to.deep.equal([
      {
        condition: 'Brand new primary condition',
        cause: 'NEW',
      },
    ]);
  });

  it('deletes newDisabilities and newPrimaryDisabilities when all entries are true increases', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
      ratedDisabilities: [{ name: 'Tinnitus' }, { name: 'Sciatica' }],
      newDisabilities: [
        { condition: 'Rated disability', ratedDisability: 'Tinnitus' },
      ],
      newPrimaryDisabilities: [
        { condition: 'Rated disability', ratedDisability: 'Sciatica' },
      ],
    };
    const result = normalizeIncreases(formData);

    expect(result).to.not.have.property('newDisabilities');
    expect(result).to.not.have.property('newPrimaryDisabilities');
    expect(result.ratedDisabilities).to.have.lengthOf(2);

    const tinnitus = result.ratedDisabilities.find(d => d.name === 'Tinnitus');
    const sciatica = result.ratedDisabilities.find(d => d.name === 'Sciatica');

    expect(tinnitus.disabilityActionType).to.equal(
      disabilityActionTypes.INCREASE,
    );
    expect(sciatica.disabilityActionType).to.equal(
      disabilityActionTypes.INCREASE,
    );
  });

  it('is tolerant of missing ratedDisabilities and new* arrays', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
    };

    const result = normalizeIncreases(formData);
    expect(result).to.deep.equal({
      disabilityCompNewConditionsWorkflow: true,
      ratedDisabilities: [],
    });
  });
});

describe('sanitizeNewDisabilities', () => {
  it('returns original formData when feature flag is not enabled', () => {
    const formData = {
      newDisabilities: [{ condition: 'X', cause: 'NEW' }],
    };

    const result = sanitizeNewDisabilities(formData);
    expect(result).to.equal(formData);
  });

  it('filters out entries missing condition or cause from newDisabilities and newPrimaryDisabilities', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
      newDisabilities: [
        { condition: 'Valid condition', cause: 'NEW' },
        { condition: 'Missing cause' },
        { cause: 'NEW' },
        null,
      ],
      newPrimaryDisabilities: [
        { condition: 'Another valid condition', cause: 'SECONDARY' },
        { condition: '', cause: 'SECONDARY' },
        {},
      ],
    };
    const result = sanitizeNewDisabilities(formData);

    expect(result.newDisabilities).to.deep.equal([
      { condition: 'Valid condition', cause: 'NEW' },
    ]);
    expect(result.newPrimaryDisabilities).to.deep.equal([
      { condition: 'Another valid condition', cause: 'SECONDARY' },
    ]);
  });

  it('deletes newDisabilities and newPrimaryDisabilities when all entries are invalid', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
      newDisabilities: [{ condition: 'Missing cause' }, { cause: 'NEW' }],
      newPrimaryDisabilities: [{ condition: '' }, { cause: 'SECONDARY' }],
    };
    const result = sanitizeNewDisabilities(formData);

    expect(result).to.not.have.property('newDisabilities');
    expect(result).to.not.have.property('newPrimaryDisabilities');
  });

  it('does nothing when new* arrays are missing or not arrays', () => {
    const formData = {
      disabilityCompNewConditionsWorkflow: true,
      newDisabilities: 'not-an-array',
      newPrimaryDisabilities: undefined,
    };
    const result = sanitizeNewDisabilities(formData);

    expect(result).to.deep.equal({
      disabilityCompNewConditionsWorkflow: true,
      newDisabilities: 'not-an-array',
      newPrimaryDisabilities: undefined,
    });
  });
});

describe('removeRatedDisabilityFromNew', () => {
  it('does nothing when there are no new* arrays present', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Tinnitus' }],
    };
    const result = removeRatedDisabilityFromNew(formData);

    expect(result).to.deep.equal(formData);
  });

  it('removes entries where condition is "Rated disability" from newDisabilities', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Tinnitus' }],
      newDisabilities: [
        {
          condition: 'Rated disability',
          ratedDisability: 'Tinnitus',
        },
        {
          condition: 'New condition',
          cause: 'NEW',
        },
      ],
    };
    const result = removeRatedDisabilityFromNew(formData);

    expect(result.newDisabilities).to.deep.equal([
      {
        condition: 'New condition',
        cause: 'NEW',
      },
    ]);
  });

  it('removes entries where ratedDisability matches an existing ratedDisability name (case-insensitive)', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Sciatica' }],
      newPrimaryDisabilities: [
        {
          condition: 'Something',
          ratedDisability: 'sciatica',
        },
        {
          condition: 'Other',
          ratedDisability: 'Not Rated',
        },
      ],
    };
    const result = removeRatedDisabilityFromNew(formData);

    expect(result.newPrimaryDisabilities).to.deep.equal([
      {
        condition: 'Other',
        ratedDisability: 'Not Rated',
      },
    ]);
  });

  it('deletes new keys when all entries represent increases', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Tinnitus' }, { name: 'Sciatica' }],
      newDisabilities: [
        {
          condition: 'Rated disability',
          ratedDisability: 'Tinnitus',
        },
      ],
      newSecondaryDisabilities: [
        {
          condition: 'Something',
          ratedDisability: 'Sciatica',
        },
      ],
    };
    const result = removeRatedDisabilityFromNew(formData);

    expect(result).to.not.have.property('newDisabilities');
    expect(result).to.not.have.property('newSecondaryDisabilities');
  });

  it('keeps non-increase entries across all new lists', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Tinnitus' }],
      newDisabilities: [
        {
          condition: 'New condition 1',
          cause: 'NEW',
        },
      ],
      newPrimaryDisabilities: [
        {
          condition: 'New condition 2',
          cause: 'NEW',
        },
      ],
      newSecondaryDisabilities: [
        {
          condition: 'Secondary condition',
          cause: 'SECONDARY',
        },
      ],
    };
    const result = removeRatedDisabilityFromNew(formData);

    expect(result.newDisabilities).to.deep.equal([
      {
        condition: 'New condition 1',
        cause: 'NEW',
      },
    ]);
    expect(result.newPrimaryDisabilities).to.deep.equal([
      {
        condition: 'New condition 2',
        cause: 'NEW',
      },
    ]);
    expect(result.newSecondaryDisabilities).to.deep.equal([
      {
        condition: 'Secondary condition',
        cause: 'SECONDARY',
      },
    ]);
  });
});

describe('removeExtraData', () => {
  it('strips rating metadata keys but keeps ratedDisabilities when non-empty', () => {
    const formData = {
      ratedDisabilities: [
        {
          name: 'Tinnitus',
          ratingDecisionId: 123,
          decisionCode: 'ABC',
          decisionText: 'Some text',
          ratingPercentage: 10,
          someOtherField: 'keep-me',
        },
      ],
      otherField: 'unchanged',
    };
    const result = removeExtraData(formData);

    expect(result.ratedDisabilities).to.have.lengthOf(1);

    const cleaned = result.ratedDisabilities[0];

    expect(cleaned.name).to.equal('Tinnitus');
    expect(cleaned.someOtherField).to.equal('keep-me');
    expect(cleaned).to.not.have.property('ratingDecisionId');
    expect(cleaned).to.not.have.property('decisionCode');
    expect(cleaned).to.not.have.property('decisionText');
    expect(cleaned).to.not.have.property('ratingPercentage');
    expect(formData.ratedDisabilities[0]).to.have.property(
      'ratingPercentage',
      10,
    );
  });

  it('deletes ratedDisabilities when the array is empty', () => {
    const formData = {
      ratedDisabilities: [],
      otherField: 'value',
    };
    const result = removeExtraData(formData);

    expect(result).to.not.have.property('ratedDisabilities');
    expect(result.otherField).to.equal('value');
  });

  it('does nothing when ratedDisabilities is undefined', () => {
    const formData = {
      someField: true,
    };
    const result = removeExtraData(formData);

    expect(result).to.deep.equal(formData);
  });
});

describe('cleanUpMailingAddress', () => {
  it('should normalize address lines by trimming and collapsing spaces', () => {
    const formData = {
      mailingAddress: {
        country: 'USA',
        addressLine1: '  123   Main   St  ',
        addressLine2: '  Apt   5  ',
        addressLine3: '  Building   A  ',
        city: 'New York',
        state: 'NY',
        zipCode: '12345',
      },
    };
    const result = cleanUpMailingAddress(formData);
    expect(result.mailingAddress.addressLine1).to.equal('123 Main St');
    expect(result.mailingAddress.addressLine2).to.equal('Apt 5');
    expect(result.mailingAddress.addressLine3).to.equal('Building A');
  });

  it('should preserve other address fields unchanged', () => {
    const formData = {
      mailingAddress: {
        country: 'USA',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '12345',
      },
    };
    const result = cleanUpMailingAddress(formData);
    expect(result.mailingAddress.country).to.equal('USA');
    expect(result.mailingAddress.city).to.equal('New York');
    expect(result.mailingAddress.state).to.equal('NY');
    expect(result.mailingAddress.zipCode).to.equal('12345');
  });

  it('should remove invalid keys from mailing address', () => {
    const formData = {
      mailingAddress: {
        country: 'USA',
        addressLine1: '123 Main St',
        'view:livesOnMilitaryBase': true,
        invalidKey: 'should be removed',
      },
    };
    const result = cleanUpMailingAddress(formData);
    expect(result.mailingAddress).to.not.have.property(
      'view:livesOnMilitaryBase',
    );
    expect(result.mailingAddress).to.not.have.property('invalidKey');
  });

  it('should handle empty address lines', () => {
    const formData = {
      mailingAddress: {
        country: 'USA',
        addressLine1: '123 Main St',
        addressLine2: '',
        city: 'New York',
      },
    };
    const result = cleanUpMailingAddress(formData);
    expect(result.mailingAddress).to.not.have.property('addressLine2');
  });

  it('should handle address line with only spaces', () => {
    const formData = {
      mailingAddress: {
        country: 'USA',
        addressLine1: '123 Main St',
        addressLine2: '     ',
        city: 'New York',
      },
    };
    const result = cleanUpMailingAddress(formData);
    // Empty after trim should be filtered out
    expect(result.mailingAddress.addressLine2).to.equal('');
  });
});
