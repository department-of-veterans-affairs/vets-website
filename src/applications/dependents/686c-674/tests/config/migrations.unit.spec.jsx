import { expect } from 'chai';

import migrations from '../../config/migrations';

describe('Migrations', () => {
  const runMigrations = savedData =>
    migrations.reduce((data, migration) => migration(data), savedData);

  it('should run all migrations', () => {
    const savedData = {
      formData: { test: true },
      metadata: {
        returnUrl: '/veteran-information',
      },
    };

    const migratedData = runMigrations(savedData);

    expect(migratedData).to.deep.equal(savedData);
  });

  it('should run all migrations', () => {
    const savedData = {
      formData: { test: true },
      metadata: {
        returnUrl: '/add-spouse/personal-information',
      },
    };

    const migratedData = runMigrations(savedData);

    expect(migratedData).to.deep.equal({
      formData: { test: true },
      metadata: {
        returnUrl: '/add-spouse/current-legal-name',
      },
    });
  });
});
