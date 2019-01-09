import { expect } from 'chai';

import _ from '../../../../platform/utilities/data';

import formConfig from '../config/form';

import {
  transform,
  transformRelatedDisabilities,
  concatIncidentLocationString,
  getFlatIncidentKeys,
  getPtsdChangeText,
  setActionTypes,
} from '../submit-transformer';

import {
  transformedMinimalData,
  transformedMaximalData,
} from './schema/transformedData';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';

import {
  PTSD_INCIDENT_ITERATION,
  PTSD_CHANGE_LABELS,
  disabilityActionTypes,
} from '../constants';

describe('transform', () => {
  it('should transform minimal data correctly', () => {
    expect(JSON.parse(transform(formConfig, minimalData))).to.deep.equal(
      transformedMinimalData,
    );
  });

  it('should transform maximal data correctly', () => {
    expect(JSON.parse(transform(formConfig, maximalData))).to.deep.equal(
      transformedMaximalData,
    );
  });
});

describe('transformRelatedDisabilities', () => {
  it('should return an array of strings', () => {
    const claimedConditions = ['some condition name', 'another condition name'];
    const treatedDisabilityNames = {
      'Some condition name': true,
      'Another condition name': true,
      'This condition is falsey!': false,
    };
    expect(
      transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
    ).to.eql(['some condition name', 'another condition name']);
  });
  it('should not add conditions if they are not claimed', () => {
    const claimedConditions = ['some condition name'];
    const treatedDisabilityNames = {
      'Some condition name': true,
      'Another condition name': true,
      'This condition is falsey!': false,
    };
    expect(
      transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
    ).to.eql(['some condition name']);
  });
});

describe('getFlatIncidentKeys', () => {
  it('should return correct amount of incident keys', () => {
    expect(getFlatIncidentKeys().length).to.eql(PTSD_INCIDENT_ITERATION * 2);
  });
});

describe('concatIncidentLocationString', () => {
  it('should concat full address', () => {
    const locationString = concatIncidentLocationString({
      city: 'Test',
      state: 'TN',
      country: 'USA',
      additionalDetails: 'details',
    });

    expect(locationString).to.eql('Test, TN, USA, details');
  });

  it('should handle null and undefined values', () => {
    const locationString = concatIncidentLocationString({
      city: 'Test',
      state: null,
      additionalDetails: 'details',
    });

    expect(locationString).to.eql('Test, details');
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
      disabilityActionTypes.NONE,
    );
    expect(formattedDisabilities[2].disabilityActionType).to.equal(
      disabilityActionTypes.NONE,
    );
  });

  it('should return cloned formData when no rated disabilities', () => {
    const noRated = _.omit('ratedDisabilities', formData);

    expect(setActionTypes(noRated)).to.deep.equal(noRated);
  });
});
