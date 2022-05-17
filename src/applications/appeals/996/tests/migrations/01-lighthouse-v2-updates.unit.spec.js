import { expect } from 'chai';
import version2Updates from '../../migrations/01-lighthouse-v2-updates';

import saveInProgress from '../fixtures/data/save-in-progress-v1.json';
import transformedV2 from '../fixtures/data/transformed/migration-v2.json';

describe('HLR v2 migration', () => {
  it('should return SiP data untouched if v2 feature is off', () => {
    const data = {
      formData: {
        ...saveInProgress.formData,
        hlrV2: false,
      },
      metadata: saveInProgress.metadata,
    };
    expect(version2Updates(data)).to.deep.equal(data);
  });
  it('should return v2 migrated data', () => {
    expect(version2Updates(saveInProgress)).to.deep.equal(transformedV2);
  });
});
