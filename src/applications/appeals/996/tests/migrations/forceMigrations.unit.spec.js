import { expect } from 'chai';
import forceMigrations from '../../migrations/forceMigrations';

import saveInProgress from '../fixtures/data/save-in-progress-v1';
import transformedV2 from '../fixtures/data/migrated/02-migrated-v1-to-v2.json';

describe('force all migrations', () => {
  it('should return phone object for representative', () => {
    expect(forceMigrations(saveInProgress().formData)).to.deep.equal(
      transformedV2.formData,
    );
  });
});
