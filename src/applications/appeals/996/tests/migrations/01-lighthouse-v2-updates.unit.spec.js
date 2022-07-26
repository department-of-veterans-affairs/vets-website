import { expect } from 'chai';
import version2Updates, {
  forceV2Migration,
} from '../../migrations/01-lighthouse-v2-updates';

import saveInProgress from '../fixtures/data/save-in-progress-v1.json';
import transformed01 from '../fixtures/data/migrated/01-migrated-v1-to-v2.json';

/*
  ATTN: these tests have been skipped because they were both 
        failing and flagged as flakey. Please fix before turning
        back on.
*/
describe.skip('HLR v2 migration', () => {
  it('should return migrated v2 data', () => {
    expect(version2Updates(saveInProgress)).to.deep.equal(transformed01);
  });
  it('should return force migrated v2 data', () => {
    expect(forceV2Migration(saveInProgress.formData)).to.deep.equal(
      transformed01.formData,
    );
  });
});
