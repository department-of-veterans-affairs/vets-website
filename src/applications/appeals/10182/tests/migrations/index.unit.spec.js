import { expect } from 'chai';
import migrations from '../../migrations';

describe('emptyMigration', () => {
  it('should return unaltered data', () => {
    const data = { formData: {}, metadata: { version: 1 } };
    expect(migrations[0](data)).to.deep.equal(data);
  });
});
