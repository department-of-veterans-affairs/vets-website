import { expect } from 'chai';

import {
  makeLegacySchemaForRatedDisabilities,
  makeSchemaForNewDisabilities,
  makeSchemaForRatedDisabilities,
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

describe('makeLegacySchemaForRatedDisabilities', () => {
  it('should handle special characters in the disability name', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          name: 'Ptsd - personal trauma',
          'view:selected': true,
        },
        {
          name: 'Diabetes (mellitus)',
          'view:selected': true,
        },
        {
          name: 'Type-1 Diabetes',
          'view:selected': true,
        },
        {
          name: 'Lower back injury affecting vertebrae C-4 vertebrae C-5',
          'view:selected': true,
        },
      ],
    };
    expect(makeLegacySchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        diabetesmellitus: {
          title: 'Diabetes (Mellitus)',
          type: 'boolean',
        },
        lowerbackinjuryaffectingvertebraec4vertebraec5: {
          title: 'Lower Back Injury Affecting Vertebrae C-4 Vertebrae C-5',
          type: 'boolean',
        },
        ptsdpersonaltrauma: {
          title: 'Ptsd - Personal Trauma',
          type: 'boolean',
        },
        type1diabetes: {
          title: 'Type-1 Diabetes',
          type: 'boolean',
        },
      },
    });
  });
  it('should create unique keys', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          name: 'cat',
          'view:selected': true,
        },
        {
          name: 'CAT',
          'view:selected': true,
        },
        {
          name: 'cAt',
          'view:selected': true,
        },
        {
          name: 'cAT',
          'view:selected': true,
        },
        {
          name: 'CaT',
          'view:selected': true,
        },
      ],
    };
    expect(makeLegacySchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        cat: {
          title: 'CaT',
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

  it('should return empty properties if disability name is not a string', () => {
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
          name: null,
          'view:selected': true,
        },
      ],
    };
    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {},
    });
  });

  it('should include rated disabilities from newDisabilities array', () => {
    const formData = {
      ratedDisabilities: [],
      newDisabilities: [
        {
          condition: 'Rated Disability',
          ratedDisability: 'Tinnitus',
        },
      ],
    };

    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        tinnitus: {
          title: 'Tinnitus',
          type: 'boolean',
        },
      },
    });
  });

  it('should deduplicate rated disabilities across workflows', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          name: 'Ptsd personal trauma',
          'view:selected': true,
        },
        {
          name: 'Diabetes mellitus',
          'view:selected': true,
        },
        {
          name: 'Tachycardia',
          'view:selected': true,
        },
      ],
      newDisabilities: [
        {
          condition: 'Rated Disability',
          ratedDisability: 'Diabetes mellitus',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Ptsd personal trauma',
        },
      ],
    };

    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        diabetesmellitus: {
          title: 'Diabetes Mellitus',
          type: 'boolean',
        },
        ptsdpersonaltrauma: {
          title: 'Ptsd Personal Trauma',
          type: 'boolean',
        },
        tachycardia: {
          title: 'Tachycardia',
          type: 'boolean',
        },
      },
    });
  });
  it('should treat disability names as case-insensitive and avoid duplicate keys', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        { name: 'Asthma', 'view:selected': true },
        { name: 'asthma', 'view:selected': true },
        { name: 'ASTHMA', 'view:selected': true },
      ],
    };
    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        asthma: {
          title: 'Asthma',
          type: 'boolean',
        },
      },
    });
  });

  it('should only include valid, selected disabilities and filter out unselected or invalid ones', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        { name: 'Asthma', 'view:selected': true },
        { name: 'Tachycardia', 'view:selected': false },
        { name: '', 'view:selected': true },
        { name: null, 'view:selected': true },
        { name: undefined, 'view:selected': true },
      ],
    };
    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        asthma: {
          title: 'Asthma',
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
      },
    });
  });

  it('should return schema for all (selected) disabilities when rated disabilities are in the newDisabilities array', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'A new Condition.',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Diabetes mellitus',
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
      },
    });
  });
});
