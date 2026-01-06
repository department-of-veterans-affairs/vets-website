import { expect } from 'chai';

import {
  makeSchemaForNewDisabilities,
  makeSchemaForRatedDisabilities,
  makeSchemaForRatedDisabilitiesInNewDisabilities,
  makeSchemaForAllDisabilities,
} from '../../utils/schemas';

describe('makeSchemaForNewDisabilities', () => {
  it('should return schema with downcased keynames', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
    };
    expect(makeSchemaForNewDisabilities(formData)).to.eql({
      properties: {
        ptsdpersonaltrauma: {
          title: 'Ptsd Personal Trauma',
          type: 'boolean',
        },
      },
    });
  });

  it('should return correct schema when periods used', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        {
          condition: 'period. Period.',
        },
      ],
    };
    expect(makeSchemaForNewDisabilities(formData)).to.eql({
      properties: {
        periodperiod: {
          title: 'Period. Period.',
          type: 'boolean',
        },
      },
    });
  });

  it('should append sideOfBody to condition name when present', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        {
          condition: 'wrist fracture',
          sideOfBody: 'LEFT',
        },
      ],
    };

    expect(makeSchemaForNewDisabilities(formData)).to.eql({
      properties: {
        wristfractureleft: {
          title: 'Wrist Fracture, Left',
          type: 'boolean',
        },
      },
    });
  });

  it('should handle mix of conditions with and without sideOfBody', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': false,
        'view:claimingNew': true,
      },
      newDisabilities: [
        {
          condition: 'wrist fracture',
          sideOfBody: 'RIGHT',
        },
        {
          condition: 'generalized anxiety disorder (GAD)',
        },
      ],
    };

    expect(makeSchemaForNewDisabilities(formData)).to.eql({
      properties: {
        wristfractureright: {
          title: 'Wrist Fracture, Right',
          type: 'boolean',
        },
        generalizedanxietydisordergad: {
          title: 'Generalized Anxiety Disorder (GAD)',
          type: 'boolean',
        },
      },
    });
  });
});

describe('makeSchemaForRatedDisabilities', () => {
  it('should return schema for selected disabilities only', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          name: 'Ptsd personal trauma',
          'view:selected': false,
        },
        {
          name: 'Diabetes mellitus',
          'view:selected': true,
        },
      ],
    };
    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        diabetesmellitus: {
          title: 'Diabetes Mellitus',
          type: 'boolean',
        },
      },
    });
  });
});

describe('makeSchemaForRatedDisabilitiesInNewDisabilities', () => {
  it('should return schema for selected rated disabilities in the newDisabilities list only', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': true,
      },
      newDisabilities: [
        {
          condition: 'Bradycardia',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Hypertension',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Emphysema',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: '',
        },
        {
          condition: 'Rated Disability',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: "A condition I haven't claimed before",
        },
      ],
      ratedDisabilities: [
        {
          name: 'Ptsd personal trauma',
          'view:selected': false,
        },
        {
          name: 'Diabetes mellitus',
          'view:selected': true,
        },
      ],
    };
    expect(makeSchemaForRatedDisabilitiesInNewDisabilities(formData)).to.eql({
      properties: {
        emphysema: {
          title: 'Emphysema',
          type: 'boolean',
        },
        hypertension: {
          title: 'Hypertension',
          type: 'boolean',
        },
      },
    });
  });
});

describe('makeSchemaForAllDisabilities', () => {
  it('should return schema for all (selected) disabilities', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': true,
      },
      ratedDisabilities: [
        {
          name: 'Ptsd personal trauma',
          'view:selected': false,
        },
        {
          name: 'Diabetes mellitus',
          'view:selected': true,
        },
      ],
      newDisabilities: [
        {
          condition: 'A new Condition.',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Emphysema',
        },
      ],
    };
    expect(makeSchemaForAllDisabilities(formData)).to.eql({
      properties: {
        diabetesmellitus: {
          title: 'Diabetes Mellitus',
          type: 'boolean',
        },
        anewcondition: {
          title: 'A New Condition.',
          type: 'boolean',
        },
        emphysema: {
          title: 'Emphysema',
          type: 'boolean',
        },
      },
    });
  });
});
