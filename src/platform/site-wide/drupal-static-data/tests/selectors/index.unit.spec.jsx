import { expect } from 'chai';
import * as selectors from '../../selectors';

describe('selectDrupalStaticData', () => {
  it('pulls out state.drupalStaticData', () => {
    const state = {
      drupalStaticData: {
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
    };
    expect(selectors.selectDrupalStaticData(state)).to.deep.equal(
      state.drupalStaticData,
    );
  });
  it('returns empty object when not set on state', () => {
    const state = {};
    expect(selectors.selectDrupalStaticData(state)).to.deep.equal({});
  });
});
