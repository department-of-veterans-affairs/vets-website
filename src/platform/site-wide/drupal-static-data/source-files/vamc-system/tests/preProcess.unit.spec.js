/* eslint-disable camelcase */
import { expect } from 'chai';
import { preProcessSystemData } from '../connect/preProcess';

describe('does nothing, output format is same as source', () => {
  const vamcSystemData = {
    data: {
      systems: {
        'VA Pittsburgh health care': {
          vha_646GC: 'Beaver County VA Clinic',
          vha_646GA: 'Belmont County VA Clinic',
          vha_646GE: 'Fayette County VA Clinic',
          vha_646A4:
            'H. John Heinz III Department of Veterans Affairs Medical Center',
          vha_646GF: 'Monroeville VA Clinic',
          vha_646: 'Pittsburgh VA Medical Center-University Drive',
          vha_646GD: 'Washington County VA Clinic',
          vha_646GB: 'Westmoreland County VA Clinic',
        },
        'VA Altoona health care': {
          vha_503GB: 'DuBois VA Clinic',
          vha_503GD: 'Huntingdon County VA Clinic',
          vha_503GE: 'Indiana County VA Clinic',
          vha_503: "James E. Van Zandt Veterans' Administration Medical Center",
          vha_503GA: 'Johnstown VA Clinic',
          vha_503GC: 'State College VA Clinic',
        },
      },
    },
  };

  it('returns empty objects when no data present', () => {
    const emptyVamcSystemData = {};
    expect(preProcessSystemData(emptyVamcSystemData)).to.deep.equal({});
  });

  it('does not change input', () => {
    expect(preProcessSystemData(vamcSystemData)).to.deep.equal(vamcSystemData);
  });
});
