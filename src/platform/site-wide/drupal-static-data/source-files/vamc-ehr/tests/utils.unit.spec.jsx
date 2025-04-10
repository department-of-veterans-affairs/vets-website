import { expect } from 'chai';
import { removeVhaPrefix, getVamcSystemNameFromVhaId } from '../utils';

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

describe('getVamcSystemNameFromVhaId', () => {
  const ehrDataByVhaId = {
    '402': {
      vhaId: '402',
      vamcFacilityName: 'Togus VA Medical Center',
      vamcSystemName: 'VA Maine health care',
      ehr: 'vista',
    },
    '405HA': {
      vhaId: '405HA',
      vamcFacilityName: 'Burlington Lakeside VA Clinic',
      vamcSystemName: 'VA White River Junction health care',
      ehr: 'vista',
    },
  };

  it('returns VAMC system name when it exists', () => {
    expect(getVamcSystemNameFromVhaId(ehrDataByVhaId, '402')).to.equal(
      'VA Maine health care',
    );
    expect(getVamcSystemNameFromVhaId(ehrDataByVhaId, '405HA')).to.equal(
      'VA White River Junction health care',
    );
  });

  it('returns undefined when passed id is not found in data', () => {
    expect(getVamcSystemNameFromVhaId(ehrDataByVhaId, '400')).to.be.undefined;
  });
});
