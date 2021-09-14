import fs from 'fs';
import path from 'path';
import moment from 'moment';

import { expect } from 'chai';

import _ from 'platform/utilities/data';

import formConfig from '../config/form';

import {
  transform,
  transformRelatedDisabilities,
  stringifyRelatedDisabilities,
  getFlatIncidentKeys,
  getPtsdChangeText,
  setActionTypes,
  filterServicePeriods,
  cleanUpPersonsInvolved,
} from '../submit-transformer';

import maximalData from './fixtures/data/maximal-test.json';

import {
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  CHAR_LIMITS,
  disabilityActionTypes,
} from '../constants';

describe('transform', () => {
  const servicePeriodsBDD = [
    {
      serviceBranch: 'Air Force Reserve',
      dateRange: {
        from: '2001-03-21',
        to: moment()
          .add(90, 'days')
          .format('YYYY-MM-DD'),
      },
    },
  ];

  // Read all the data files
  const dataDir = path.join(__dirname, './fixtures/data/');
  fs.readdirSync(dataDir)
    .filter(fileName => fileName.endsWith('.json'))
    .forEach(fileName => {
      // Loop through them
      it(`should transform ${fileName} correctly`, () => {
        const rawData = JSON.parse(
          fs.readFileSync(path.join(dataDir, fileName), 'utf8'),
        );
        let transformedData;
        try {
          transformedData = fs.readFileSync(
            path.join(dataDir, 'transformed-data', fileName),
            'utf8',
          );
        } catch (e) {
          // Show the contents of the transformed data so we can make a file for it
          // eslint-disable-next-line no-console
          console.error(
            `Transformed ${fileName}:`,
            transform(formConfig, rawData),
          );
          throw new Error(`Could not find transformed data for ${fileName}`);
        }
        transformedData = JSON.parse(transformedData);

        if (fileName.includes('bdd')) {
          rawData.data.serviceInformation.servicePeriods = servicePeriodsBDD;
          transformedData.form526.serviceInformation.servicePeriods = servicePeriodsBDD;
        }

        expect(JSON.parse(transform(formConfig, rawData))).to.deep.equal(
          transformedData,
        );
      });
    });
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
          name: {},
          'view:individualAddMsg': {},
          injuryDeath: 'other',
          injuryDeathOther: 'Entry left blank',
        },
      ],
    });
  });
  it('should only modify empty entries', () => {
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
          name: {},
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
          name: {},
          'view:individualAddMsg': {},
          injuryDeath: 'other',
          injuryDeathOther: 'Entry left blank',
        },
        {
          injuryDeath: 'other',
          description: 'should not change',
        },
      ],
    });
  });
});

describe('Test internal transform functions', () => {
  it('will truncate long descriptions', () => {
    const getString = (key, diff = 0) =>
      new Array(42)
        .fill('1234567890')
        .join('')
        .substring(0, CHAR_LIMITS[key] + diff);
    const longString = getString('primaryDescription', 20);
    const phlebitisPrefix = 'Secondary to Diabetes Mellitus0\n';
    const form = {
      data: {
        ...maximalData.data,
        newDisabilities: [
          {
            cause: 'NEW',
            primaryDescription: longString,
            condition: 'asthma',
            'view:descriptionInfo': {},
          },
          {
            cause: 'SECONDARY',
            'view:secondaryFollowUp': {
              causedByDisability: 'Diabetes Mellitus0',
              causedByDisabilityDescription: longString,
            },
            condition: 'phlebitis',
            'view:descriptionInfo': {},
          },
          {
            cause: 'WORSENED',
            'view:worsenedFollowUp': {
              worsenedDescription: longString,
              worsenedEffects: longString,
            },
            condition: 'knee replacement',
            'view:descriptionInfo': {},
          },
          {
            cause: 'VA',
            'view:vaFollowUp': {
              vaMistreatmentDescription: longString,
              vaMistreatmentLocation: longString,
              vaMistreatmentDate: longString,
            },
            condition: 'myocardial infarction (MI)',
            'view:descriptionInfo': {},
          },
        ],
      },
    };
    expect(
      JSON.parse(transform(formConfig, form)).form526.newPrimaryDisabilities,
    ).to.deep.equal([
      {
        cause: 'NEW',
        primaryDescription: getString('primaryDescription'),
        condition: 'asthma',
        classificationCode: '540',
      },
      {
        cause: 'WORSENED',
        worsenedDescription: getString('worsenedDescription'),
        worsenedEffects: getString('worsenedEffects'),
        condition: 'knee replacement',
        specialIssues: ['POW'],
        classificationCode: '8919',
      },
      {
        cause: 'VA',
        vaMistreatmentDescription: getString('vaMistreatmentDescription'),
        vaMistreatmentLocation: getString('vaMistreatmentLocation'),
        vaMistreatmentDate: getString('vaMistreatmentDate'),
        condition: 'myocardial infarction (MI)',
        specialIssues: ['POW'],
        classificationCode: '4440',
      },
      {
        condition: 'phlebitis',
        cause: 'NEW',
        classificationCode: '5300',
        primaryDescription: `${phlebitisPrefix}${getString(
          'primaryDescription',
          -phlebitisPrefix.length,
        )}`,
      },
    ]);
  });
});
