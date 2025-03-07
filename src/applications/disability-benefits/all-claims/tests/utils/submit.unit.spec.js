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
} from '../../utils/submit';
import {
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  disabilityActionTypes,
} from '../../constants';

import maximalData from '../fixtures/data/maximal-test.json';

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
  it('should return empty strings if the date string is invalid or missing', () => {
    const result = extractDateParts('invalid-date');
    expect(result).to.deep.equal({ treatmentMonth: '', treatmentYear: '' });
  });

  it('should correctly extract the month and year from a valid date string', () => {
    const result = extractDateParts('2022-05-15');
    expect(result).to.deep.equal({
      treatmentMonth: '05',
      treatmentYear: '2022',
    });
  });

  it('should return empty strings if the date string is undefined', () => {
    const result = extractDateParts(undefined);
    expect(result).to.deep.equal({ treatmentMonth: '', treatmentYear: '' });
  });
});

describe('addForm0781V2', () => {
  const formData = {
    syncModern0781Flow: true,
    eventTypes: ['eventType1'],
    events: ['event1'],
    workBehaviors: ['workBehavior1'],
    healthBehaviors: ['healthBehavior1'],
    otherBehaviors: ['otherBehavior1'],
    behaviorsDetails: 'details',
    supportingEvidenceReports: ['report1'],
    supportingEvidenceRecords: ['record1'],
    supportingEvidenceWitness: ['witness1'],
    supportingEvidenceOther: 'otherEvidence',
    supportingEvidenceUnlisted: 'unlistedEvidence',
    supportingEvidenceNoneCheckbox: true,
    treatmentReceivedVaProvider: true,
    treatmentReceivedNonVaProvider: true,
    treatmentNoneCheckbox: true,
    providerFacility: ['facility1'],
    vaTreatmentFacilities: [],
    optionIndicator: 'option1',
    additionalInformation: 'info',
  };

  it('should return the same object if syncModern0781Flow is false', () => {
    const formDataSyncModern0781False = {
      syncModern0781Flow: false,
      eventTypes: ['eventType1'],
      workBehaviors: ['workBehavior1'],
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
