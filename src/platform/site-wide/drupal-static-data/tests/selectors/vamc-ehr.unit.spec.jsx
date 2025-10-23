import { expect } from 'chai';
import * as selectors from '../../source-files/vamc-ehr/selectors';

const emptyState = {};
const state = {
  drupalStaticData: {
    vamcEhrData: {
      data: {
        cernerFacilities: [
          {
            vhaId: '757',
            vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
            vamcSystemName: 'VA Central Ohio health care',
            ehr: 'cerner',
          },
          {
            vhaId: '687',
            vamcFacilityName:
              'Jonathan M. Wainwright Memorial VA Medical Center',
            vamcSystemName: 'VA Walla Walla health care',
            ehr: 'cerner',
          },
        ],
      },
    },
  },
};

describe('selectCernerFacilities', () => {
  it('pulls out state.drupalStaticData.vamcEhrData.cernerFacilities.data when set on state', () => {
    expect(selectors.selectCernerFacilities(state)).to.deep.equal(
      state.drupalStaticData.vamcEhrData.data.cernerFacilities,
    );
  });
  it('returns empty array when Cerner facilities not set on state', () => {
    expect(selectors.selectCernerFacilities(emptyState)).to.deep.equal([]);
  });
});

describe('selectCernerFacilityIds', () => {
  it('returns non-empty, flat array of ids when Cerner facilities set on state', () => {
    expect(selectors.selectCernerFacilityIds(state)).to.deep.equal([
      '757',
      '687',
    ]);
  });
  it('returns empty array when Cerner facilities not set on state', () => {
    expect(selectors.selectCernerFacilityIds(emptyState)).to.deep.equal([]);
  });
});
