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

// demonstrates behavior of the legacy (pre-v2) implementation of makeSchemaForRatedDisabilities
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
        {
          name: 'Migraines [intermittent; 1:30-4:00am typically!)]',
          'view:selected': true,
        },
        {
          name: 'Dizziness/vertigo. Occurs ~2x/month.',
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
        dizzinessvertigooccurs2xmonth: {
          title: 'Dizziness/vertigo. Occurs ~2x/month.',
          type: 'boolean',
        },
        lowerbackinjuryaffectingvertebraec4vertebraec5: {
          title: 'Lower Back Injury Affecting Vertebrae C-4 Vertebrae C-5',
          type: 'boolean',
        },
        migrainesintermittent130400amtypically: {
          title: 'Migraines [Intermittent; 1:30-4:00am Typically!)]',
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
  it('should handle null or empty disability names', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          name: null,
          'view:selected': true,
        },
        {
          name: '',
          'view:selected': true,
        },
        {
          name: 'Unknown Condition', // NULL_CONDITION_STRING in constants.js
          'view:selected': true,
        },
      ],
    };
    expect(makeLegacySchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        blank: {
          title: null,
          type: 'boolean',
        },
        unknowncondition: {
          title: 'Unknown Condition',
          type: 'boolean',
        },
      },
    });
  });
  it('should handle a mix of invalid and valid disability names', () => {
    const formData = {
      'view:claimType': {
        'view:claimingIncrease': true,
        'view:claimingNew': false,
      },
      ratedDisabilities: [
        {
          name: null,
          'view:selected': true,
        },
        {
          name: '',
          'view:selected': true,
        },
        {
          name: 'Diabetes mellitus',
          'view:selected': true,
        },
      ],
    };
    expect(makeLegacySchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        blank: {
          title: null,
          type: 'boolean',
        },
        diabetesmellitus: {
          title: 'Diabetes Mellitus',
          type: 'boolean',
        },
      },
    });
  });
});

describe('makeSchemaForRatedDisabilities has parity with the previous implementation for deduplication', () => {
  const formDataLegacy = {
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
        name: 'CaT',
        'view:selected': true,
      },
    ],
  };

  it('should have the same deduplication result on the v1 conditions flow', () => {
    expect(makeLegacySchemaForRatedDisabilities(formDataLegacy)).to.eql(
      makeSchemaForRatedDisabilities(formDataLegacy),
    );
  });

  it('should have the same deduplication result on the v2 conditions flow', () => {
    const formDataV2 = {
      newDisabilities: [
        {
          condition: 'Rated Disability',
          ratedDisability: 'cat',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'CAT',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'CaT',
        },
      ],
    };
    expect(makeLegacySchemaForRatedDisabilities(formDataLegacy)).to.eql(
      makeSchemaForRatedDisabilities(formDataV2),
    );
  });
});

describe('makeSchemaForRatedDisabilities has parity with the previous implementation for creating keys', () => {
  const formDataLegacy = {
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

  it('should return the same properties on the v1 conditions flow', () => {
    expect(makeLegacySchemaForRatedDisabilities(formDataLegacy)).to.eql(
      makeSchemaForRatedDisabilities(formDataLegacy),
    );
  });

  it('should return the same properties on the v2 conditions flow', () => {
    const formDataV2 = {
      newDisabilities: [
        {
          condition: 'Rated Disability',
          ratedDisability: 'Ptsd - personal trauma',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Diabetes (mellitus)',
        },
        {
          condition: 'Rated Disability',
          ratedDisability: 'Type-1 Diabetes',
        },
        {
          condition: 'Rated Disability',
          ratedDisability:
            'Lower back injury affecting vertebrae C-4 vertebrae C-5',
        },
      ],
    };
    expect(makeLegacySchemaForRatedDisabilities(formDataLegacy)).to.eql(
      makeSchemaForRatedDisabilities(formDataV2),
    );
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
    expect(makeLegacySchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        asthma: {
          title: 'ASTHMA',
          type: 'boolean',
        },
      },
    });
    expect(makeSchemaForRatedDisabilities(formData)).to.eql({
      properties: {
        asthma: {
          title: 'ASTHMA',
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
