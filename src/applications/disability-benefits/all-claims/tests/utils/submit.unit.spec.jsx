import { expect } from 'chai';

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
  addForm0781,
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
