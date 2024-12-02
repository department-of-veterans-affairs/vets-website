import { expect } from 'chai';

import migrations from '../../migrations';
import inProgressData from '../fixtures/mocks/in-progress-forms.json';

describe('migrations', () => {
  it('should return saved data', () => {
    const [emptyMigration] = migrations;

    expect(emptyMigration()).to.eq(undefined);
    expect(emptyMigration('test')).to.eq('test');
    expect(emptyMigration({})).to.deep.equal({});
    expect(emptyMigration(inProgressData)).to.deep.equal(inProgressData);
  });
});
