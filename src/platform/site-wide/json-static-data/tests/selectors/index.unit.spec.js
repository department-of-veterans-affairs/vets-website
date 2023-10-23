import { expect } from 'chai';
import * as selectors from '../../selectors';

describe('selectDrupalStaticData', () => {
  it('pulls out state.jsonStaticData', () => {
    const state = {
      jsonStaticData: {
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
      state.jsonStaticData,
    );
  });
  it('returns empty object when not set on state', () => {
    const state = {};
    expect(selectors.selectDrupalStaticData(state)).to.deep.equal({});
  });
});
