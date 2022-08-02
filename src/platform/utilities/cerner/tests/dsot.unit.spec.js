import { expect } from 'chai';
import { removeVhaPrefix, cernerFacilitiesFromVamcEhrData } from '../dsot';

describe('removeVhaPrefix', () => {
  it('removes "vha_" prefix when present', () => {
    const stringWithPrefix = 'vha_123';
    expect(removeVhaPrefix(stringWithPrefix)).to.equal('123');
  });
  it('leaves input unchanged when not matching "vha_*"', () => {
    const stringWithPrefix = 'vha123';
    expect(removeVhaPrefix(stringWithPrefix)).to.equal(stringWithPrefix);
  });
});

describe('cernerFacilitiesFromVamcEhrData', () => {
  let vamcEhrDataCerner;
  let vamcEhrDataCernerStaged;
  let vamcEhrData;

  let vamcEhrDataCernerNormalized;
  let vamcEhrDataCernerStagedNormalized;
  let vamcEhrDataNormalized;

  beforeEach(() => {
    vamcEhrDataCerner = [
      {
        title: 'Chalmers P. Wylie Veterans Outpatient Clinic',
        fieldFacilityLocatorApiId: 'vha_757',
        fieldRegionPage: {
          entity: {
            title: 'VA Central Ohio health care',
            fieldVamcEhrSystem: 'cerner',
          },
        },
      },
      {
        title: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        fieldFacilityLocatorApiId: 'vha_668',
        fieldRegionPage: {
          entity: {
            title: 'VA Spokane health care',
            fieldVamcEhrSystem: 'cerner',
          },
        },
      },
    ];
    vamcEhrDataCernerStaged = [
      {
        title: 'Roseburg VA Medical Center',
        fieldFacilityLocatorApiId: 'vha_653',
        fieldRegionPage: {
          entity: {
            title: 'VA Roseburg health care',
            fieldVamcEhrSystem: 'cerner_staged',
          },
        },
      },
      {
        title: 'Jonathan M. Wainwright Memorial VA Medical Center',
        fieldFacilityLocatorApiId: 'vha_687',
        fieldRegionPage: {
          entity: {
            title: 'VA Walla Walla health care',
            fieldVamcEhrSystem: 'cerner_staged',
          },
        },
      },
    ];
    vamcEhrData = {
      data: {
        nodeQuery: {
          count: 4,
          entities: [...vamcEhrDataCerner, ...vamcEhrDataCernerStaged],
        },
      },
    };

    vamcEhrDataCernerNormalized = [
      {
        vhaId: '757',
        vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
        vamcSystemName: 'VA Central Ohio health care',
        ehr: 'cerner',
      },
      {
        vhaId: '668',
        vamcFacilityName:
          'Mann-Grandstaff Department of Veterans Affairs Medical Center',
        vamcSystemName: 'VA Spokane health care',
        ehr: 'cerner',
      },
    ];
    vamcEhrDataCernerStagedNormalized = [
      {
        vhaId: '653',
        vamcFacilityName: 'Roseburg VA Medical Center',
        vamcSystemName: 'VA Roseburg health care',
        ehr: 'cerner_staged',
      },
      {
        vhaId: '687',
        vamcFacilityName: 'Jonathan M. Wainwright Memorial VA Medical Center',
        vamcSystemName: 'VA Walla Walla health care',
        ehr: 'cerner_staged',
      },
    ];
    vamcEhrDataNormalized = [
      ...vamcEhrDataCernerNormalized,
      ...vamcEhrDataCernerStagedNormalized,
    ];
  });

  it('returns empty array when no data present', () => {
    const emptyVamcEhrData = {};
    expect(cernerFacilitiesFromVamcEhrData(emptyVamcEhrData)).to.deep.equal([]);
  });
  it('returns flattened/normalized array of all facilities when includeStaged is true', () => {
    expect(cernerFacilitiesFromVamcEhrData(vamcEhrData, true)).to.deep.equal(
      vamcEhrDataNormalized,
    );
  });
  it('removes cerner_staged facilities when includeStaged is false', () => {
    expect(cernerFacilitiesFromVamcEhrData(vamcEhrData, false)).to.deep.equal(
      vamcEhrDataCernerNormalized,
    );
  });
});
