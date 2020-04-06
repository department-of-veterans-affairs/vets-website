import fs from 'fs';
import path from 'path';

import _ from '../../../../platform/utilities/data';

import formConfig from '../config/form';

import {
  transform,
  transformRelatedDisabilities,
  getFlatIncidentKeys,
  getPtsdChangeText,
  setActionTypes,
  filterServicePeriods,
} from '../submit-transformer';

import maximalData from './data/maximal-test.json';

import {
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  disabilityActionTypes,
} from '../constants';

describe('transform', () => {
  // Read all the data files
  const dataDir = path.join(__dirname, './data/');
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
        expect(JSON.parse(transform(formConfig, rawData))).toEqual(
          JSON.parse(transformedData),
        );
      });
    });
});

describe('transformRelatedDisabilities', () => {
  it('should return an array of strings', () => {
    const claimedConditions = ['Some Condition Name', 'Another Condition Name'];
    const treatedDisabilityNames = {
      'some condition name': true,
      'another condition name': true,
      'this condition is falsey!': false,
    };
    expect(
      transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
    ).toEqual(['Some Condition Name', 'Another Condition Name']);
  });
  it('should not add conditions if they are not claimed', () => {
    const claimedConditions = ['Some Condition Name'];
    const treatedDisabilityNames = {
      'some condition name': true,
      'another condition name': true,
      'this condition is falsey!': false,
    };
    expect(
      transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
    ).toEqual(['Some Condition Name']);
  });
});

describe('getFlatIncidentKeys', () => {
  it('should return correct amount of incident keys', () => {
    expect(getFlatIncidentKeys().length).toEqual(PTSD_INCIDENT_ITERATION * 2);
  });
});

describe('getPtsdChangeText', () => {
  it('should have valid labels', () => {
    Object.keys(PTSD_CHANGE_LABELS).forEach(key => {
      expect(typeof PTSD_CHANGE_LABELS[key]).toBe('string');
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
        expect(PTSD_CHANGE_LABELS).toHaveProperty(key);
      });
  });

  it('should have mappings for all mentalHealthChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.mentalHealthChanges.schema
        .properties.mentalChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).toHaveProperty(key);
      });
  });

  it('should have mappings for all physicalHealthChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.physicalHealthChanges.schema
        .properties.physicalChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).toHaveProperty(key);
      });
  });

  it('should have mappings for all socialBehaviorChanges schema fields', () => {
    Object.keys(
      formConfig.chapters.disabilities.pages.socialBehaviorChanges.schema
        .properties.socialBehaviorChanges.properties,
    )
      .filter(key => !ignoredFields.includes(key))
      .forEach(key => {
        expect(PTSD_CHANGE_LABELS).toHaveProperty(key);
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

    expect(fieldTitles.length).toBe(2);
  });

  it('should correctly handle undefined ptsd changes', () => {
    const fieldTitles = getPtsdChangeText(undefined);
    expect(fieldTitles.length).toBe(0);
  });
});

describe('setActionTypes', () => {
  const formData = maximalData.data;

  it('should set disabilityActionType for each disability properly', () => {
    const formattedDisabilities = setActionTypes(formData).ratedDisabilities;

    expect(formattedDisabilities).toHaveLength(
      formData.ratedDisabilities.length,
    );

    expect(formattedDisabilities[0].disabilityActionType).toBe(
      disabilityActionTypes.INCREASE,
    );
    expect(formattedDisabilities[1].disabilityActionType).toBe(
      disabilityActionTypes.INCREASE,
    );
    expect(formattedDisabilities[2].disabilityActionType).toBe(
      disabilityActionTypes.NONE,
    );
    expect(formattedDisabilities[3].disabilityActionType).toBe(
      disabilityActionTypes.NONE,
    );
  });

  it('should return cloned formData when no rated disabilities', () => {
    const noRated = _.omit('ratedDisabilities', formData);

    expect(setActionTypes(noRated)).toEqual(noRated);
  });
});

describe('remove unreferenced reservedNationGuardService', () => {
  const formData = _.cloneDeep(maximalData.data);
  // Modify service names to remove "Reserves" & "National Guard"
  formData.serviceInformation.servicePeriods[0].serviceBranch = 'Air Force';
  formData.serviceInformation.servicePeriods[1].serviceBranch = 'Navy';
  const processedServiceInfo = filterServicePeriods(formData);
  expect(
    processedServiceInfo.serviceInformation.reservesNationalGuardService,
  ).toBeUndefined();
});
