import { expect } from 'chai';
import { emptyMigration } from '../../migrations';

describe('Check empty migration', () => {
  it('should return same data', () => {
    expect(emptyMigration('test')).to.equal('test');
    expect(emptyMigration(undefined)).to.equal(undefined);
    expect(emptyMigration(null)).to.equal(null);
    expect(emptyMigration({})).to.deep.equal({});
  });
});
