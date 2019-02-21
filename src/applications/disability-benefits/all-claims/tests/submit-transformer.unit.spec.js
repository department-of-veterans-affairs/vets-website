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
  transformedMinimalPtsdFormUploadData,
  transformedNewSecondaryData,
} from './schema/transformedData';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';
import newSecondaryData from './schema/secondary-new-test.json';
import minimalPtsdFormUploadData from './schema/minimal-ptsd-form-upload-test.json';

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
  it('should transform new secondary disability data correctly', () => {
    expect(JSON.parse(transform(formConfig, newSecondaryData))).to.deep.equal(
      transformedNewSecondaryData,
    );
  });
  it('should transform ptsd form upload data correctly', () => {
    expect(
      JSON.parse(transform(formConfig, minimalPtsdFormUploadData)),
    ).to.deep.equal(transformedMinimalPtsdFormUploadData);
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
    ).to.eql(['Some Condition Name', 'Another Condition Name']);
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
    ).to.eql(['Some Condition Name']);
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
