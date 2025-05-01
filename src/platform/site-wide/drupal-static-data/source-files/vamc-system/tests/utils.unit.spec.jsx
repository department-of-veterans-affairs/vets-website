/* eslint-disable camelcase */
import { expect } from 'chai';
import { selectFacilitiesForSystem, selectVamcSystemData } from '../selectors';

describe('getVamcSystemNameFromVhaId', () => {
  const drupalStaticData = {
    drupalStaticData: {
      vamcSystemData: {
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
              vha_503:
                "James E. Van Zandt Veterans' Administration Medical Center",
              vha_503GA: 'Johnstown VA Clinic',
              vha_503GC: 'State College VA Clinic',
            },
          },
        },
      },
    },
  };

  it('selects VAMC facility id name tuples', () => {
    expect(selectVamcSystemData(drupalStaticData)).to.deep.equal(
      drupalStaticData.drupalStaticData.vamcSystemData.data.systems,
    );
    expect(
      selectFacilitiesForSystem(drupalStaticData, 'VA Altoona health care'),
    ).to.deep.equal([
      ['vha_503GB', 'DuBois VA Clinic'],
      ['vha_503GD', 'Huntingdon County VA Clinic'],
      ['vha_503GE', 'Indiana County VA Clinic'],
      ['vha_503', "James E. Van Zandt Veterans' Administration Medical Center"],
      ['vha_503GA', 'Johnstown VA Clinic'],
      ['vha_503GC', 'State College VA Clinic'],
    ]);
  });
});
