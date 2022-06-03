import { expect } from 'chai';
import version2Updates, {
  forceV2Migration,
} from '../../migrations/01-lighthouse-v2-updates';

import saveInProgress from '../fixtures/data/save-in-progress-v1.json';
import transformed01 from '../fixtures/data/migrated/01-migrated-v1-to-v2.json';

describe('HLR v2 migration', () => {
  it('should return v2 migrated data', () => {
    expect(version2Updates(saveInProgress)).to.deep.equal(transformed01);
  });
  it('should return v2 migrated data', () => {
    expect(forceV2Migration(saveInProgress.formData)).to.deep.equal(
      transformed01.formData,
    );
  });
});
