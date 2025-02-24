import { expect } from 'chai';
import { normalizeAndCategorizeFacilities } from '../connect/preProcess';

describe('normalizeAndCategorizeFacilities', () => {
  const vamcEhrDataVista = [
    {
      title: 'Togus VA Medical Center',
      fieldFacilityLocatorApiId: 'vha_402',
      fieldRegionPage: {
        entity: {
          title: 'VA Maine health care',
          fieldVamcEhrSystem: 'vista',
        },
      },
    },
    {
      title: 'Burlington Lakeside VA Clinic',
      fieldFacilityLocatorApiId: 'vha_405HA',
      fieldRegionPage: {
        entity: {
          title: 'VA White River Junction health care',
          fieldVamcEhrSystem: 'vista',
        },
      },
    },
  ];
  const vamcEhrDataCerner = [
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
  const vamcEhrDataCernerStaged = [
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
  const vamcEhrData = {
    data: {
      nodeQuery: {
        count: 6,
        entities: [
          ...vamcEhrDataVista,
          ...vamcEhrDataCerner,
          ...vamcEhrDataCernerStaged,
        ],
      },
    },
  };

  const vistaFacilitiesNormalized = [
    {
      vhaId: '402',
      vamcFacilityName: 'Togus VA Medical Center',
      vamcSystemName: 'VA Maine health care',
      ehr: 'vista',
    },
    {
      vhaId: '405HA',
      vamcFacilityName: 'Burlington Lakeside VA Clinic',
      vamcSystemName: 'VA White River Junction health care',
      ehr: 'vista',
    },
  ];
  const cernerFacilitiesNormalized = [
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
  const cernerStagedFacilitiesNormalized = [
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

  const facilitiesByVhaId = facilities =>
    facilities.reduce((acc, facility) => {
      acc[facility.vhaId] = facility;
      return acc;
    }, {});
  const vistaFacilitiesByVhaId = facilitiesByVhaId(vistaFacilitiesNormalized);
  const cernerFacilitiesByVhaId = facilitiesByVhaId(cernerFacilitiesNormalized);
  const cernerStagedFacilitiesByVhaId = facilitiesByVhaId(
    cernerStagedFacilitiesNormalized,
  );
  const ehrDataByVhaId = {
    ...vistaFacilitiesByVhaId,
    ...cernerFacilitiesByVhaId,
    ...cernerStagedFacilitiesByVhaId,
  };

  const facilityIds = facilities => facilities.map(facility => facility.vhaId);
  const vistaFacilityIds = facilityIds(vistaFacilitiesNormalized);
  const cernerFacilityIds = facilityIds(cernerFacilitiesNormalized);
  const cernerStagedFacilityIds = facilityIds(cernerStagedFacilitiesNormalized);
  const allFacilityIds = [
    ...vistaFacilityIds,
    ...cernerFacilityIds,
    ...cernerStagedFacilityIds,
  ];

  it('returns empty objects when no data present', () => {
    const emptyVamcEhrData = {};
    expect(normalizeAndCategorizeFacilities(emptyVamcEhrData)).to.deep.equal({
      ehrDataByVhaId: {},
      cernerFacilities: [],
      vistaFacilities: [],
    });
  });

  it('includes cerner_staged facilities in cerner facilities when includeCernerStaged is true', () => {
    const {
      cernerFacilities,
      vistaFacilities,
    } = normalizeAndCategorizeFacilities(vamcEhrData, true);

    expect(cernerFacilities.length).to.equal(4);
    expect(vistaFacilities.length).to.equal(2);
  });

  it('includes cerner_staged facilities in vista facilities when includeCernerStaged is false', () => {
    const {
      cernerFacilities,
      vistaFacilities,
    } = normalizeAndCategorizeFacilities(vamcEhrData, false);

    expect(cernerFacilities.length).to.equal(2);
    expect(vistaFacilities.length).to.equal(4);
  });

  it('includes all facilities in ehrDataByVhaId in all cases', () => {
    const includingStaged = normalizeAndCategorizeFacilities(vamcEhrData, true);
    const excludingStaged = normalizeAndCategorizeFacilities(
      vamcEhrData,
      false,
    );

    expect(Object.keys(includingStaged.ehrDataByVhaId).length).to.equal(6);
    expect(Object.keys(excludingStaged.ehrDataByVhaId).length).to.equal(6);
  });

  it('returns data in expected format', () => {
    const {
      ehrDataByVhaId: _ehrDataByVhaId,
      cernerFacilities,
      vistaFacilities,
    } = normalizeAndCategorizeFacilities(vamcEhrData, true);

    expect(ehrDataByVhaId)
      .to.be.an('object')
      .that.has.all.keys(allFacilityIds);
    expect(_ehrDataByVhaId).to.deep.equal(ehrDataByVhaId);
    expect(cernerFacilities).to.have.deep.members([
      ...cernerFacilitiesNormalized,
      ...cernerStagedFacilitiesNormalized,
    ]);
    expect(vistaFacilities).to.have.deep.members(vistaFacilitiesNormalized);
  });
});
