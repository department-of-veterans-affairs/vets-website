import { expect } from 'chai';
import {
  migrateFieldNames,
  reverseFieldNames,
  createFieldMigrationMiddleware,
  getNewFieldName,
  getOldFieldName,
  hasFieldMapping,
  getAllFieldMappings,
  validateMigratedFields,
  FIELD_NAME_MAPPINGS,
  REVERSE_FIELD_MAPPINGS,
} from './field-name-migration';

describe('field-name-migration utilities', () => {
  describe('migrateFieldNames', () => {
    it('migrates simple field names from old to new', () => {
      const oldData = {
        claimantFullName: { first: 'John', last: 'Doe' },
        claimantDateOfBirth: '1980-01-01',
        otherField: 'unchanged',
      };

      const result = migrateFieldNames(oldData);

      expect(result).to.deep.equal({
        veteranFullName: { first: 'John', last: 'Doe' },
        veteranDateOfBirth: '1980-01-01',
        otherField: 'unchanged',
      });
    });

    it('migrates nested objects when deep is true', () => {
      const oldData = {
        formData: {
          claimantInfo: {
            claimantFullName: 'John Doe',
          },
        },
      };

      const result = migrateFieldNames(oldData, { deep: true });

      expect(result).to.deep.equal({
        formData: {
          veteranInfo: {
            veteranFullName: 'John Doe',
          },
        },
      });
    });

    it('does not migrate nested objects when deep is false', () => {
      const oldData = {
        formData: {
          claimantInfo: {
            claimantFullName: 'John Doe',
          },
        },
      };

      const result = migrateFieldNames(oldData, { deep: false });

      expect(result).to.deep.equal({
        formData: {
          claimantInfo: {
            claimantFullName: 'John Doe',
          },
        },
      });
    });

    it('preserves original fields when preserveOriginal is true', () => {
      const oldData = {
        claimantFullName: 'John Doe',
        otherField: 'unchanged',
      };

      const result = migrateFieldNames(oldData, { preserveOriginal: true });

      expect(result).to.deep.equal({
        claimantFullName: 'John Doe',
        veteranFullName: 'John Doe',
        otherField: 'unchanged',
      });
    });

    it('handles arrays correctly', () => {
      const oldData = {
        items: [{ claimantFullName: 'John' }, { claimantFullName: 'Jane' }],
      };

      const result = migrateFieldNames(oldData);

      expect(result).to.deep.equal({
        items: [{ veteranFullName: 'John' }, { veteranFullName: 'Jane' }],
      });
    });

    it('returns non-object values unchanged', () => {
      expect(migrateFieldNames(null)).to.be.null;
      expect(migrateFieldNames(undefined)).to.be.undefined;
      expect(migrateFieldNames('string')).to.equal('string');
      expect(migrateFieldNames(123)).to.equal(123);
    });

    it('handles empty objects', () => {
      expect(migrateFieldNames({})).to.deep.equal({});
    });
  });

  describe('reverseFieldNames', () => {
    it('reverses field names from new to old', () => {
      const newData = {
        veteranFullName: { first: 'John', last: 'Doe' },
        veteranDateOfBirth: '1980-01-01',
        otherField: 'unchanged',
      };

      const result = reverseFieldNames(newData);

      expect(result).to.deep.equal({
        claimantFullName: { first: 'John', last: 'Doe' },
        claimantDateOfBirth: '1980-01-01',
        otherField: 'unchanged',
      });
    });

    it('handles nested objects when deep is true', () => {
      const newData = {
        formData: {
          veteranInfo: {
            veteranFullName: 'John Doe',
          },
        },
      };

      const result = reverseFieldNames(newData, { deep: true });

      expect(result).to.deep.equal({
        formData: {
          claimantInfo: {
            claimantFullName: 'John Doe',
          },
        },
      });
    });

    it('preserves both old and new fields when preserveOriginal is true', () => {
      const newData = {
        veteranFullName: 'John Doe',
        otherField: 'unchanged',
      };

      const result = reverseFieldNames(newData, { preserveOriginal: true });

      expect(result).to.deep.equal({
        veteranFullName: 'John Doe',
        claimantFullName: 'John Doe',
        otherField: 'unchanged',
      });
    });
  });

  describe('createFieldMigrationMiddleware', () => {
    it('creates middleware for migrating to new names', () => {
      const middleware = createFieldMigrationMiddleware({ toNew: true });
      const oldData = {
        claimantFullName: 'John Doe',
        claimantEmail: 'john@example.com',
      };

      const result = middleware(oldData);

      expect(result).to.deep.equal({
        veteranFullName: 'John Doe',
        veteranEmail: 'john@example.com',
      });
    });

    it('creates middleware for migrating to old names', () => {
      const middleware = createFieldMigrationMiddleware({ toNew: false });
      const newData = {
        veteranFullName: 'John Doe',
        veteranEmail: 'john@example.com',
      };

      const result = middleware(newData);

      expect(result).to.deep.equal({
        claimantFullName: 'John Doe',
        claimantEmail: 'john@example.com',
      });
    });

    it('only migrates included fields when include is specified', () => {
      const middleware = createFieldMigrationMiddleware({
        toNew: true,
        include: ['claimantFullName'],
      });
      const oldData = {
        claimantFullName: 'John Doe',
        claimantEmail: 'john@example.com',
        otherField: 'unchanged',
      };

      const result = middleware(oldData);

      expect(result).to.deep.equal({
        veteranFullName: 'John Doe',
        claimantEmail: 'john@example.com', // Not included, so not migrated
        otherField: 'unchanged',
      });
    });

    it('excludes specified fields from migration', () => {
      const middleware = createFieldMigrationMiddleware({
        toNew: true,
        exclude: ['claimantEmail'],
      });
      const oldData = {
        claimantFullName: 'John Doe',
        claimantEmail: 'john@example.com',
        claimantPhone: '555-1234',
      };

      const result = middleware(oldData);

      expect(result).to.deep.equal({
        veteranFullName: 'John Doe',
        claimantEmail: 'john@example.com', // Excluded from migration
        veteranPhone: '555-1234',
      });
    });

    it('handles non-object input gracefully', () => {
      const middleware = createFieldMigrationMiddleware();

      expect(middleware(null)).to.be.null;
      expect(middleware(undefined)).to.be.undefined;
      expect(middleware('string')).to.equal('string');
      expect(middleware(123)).to.equal(123);
    });
  });

  describe('getNewFieldName', () => {
    it('returns new field name for mapped fields', () => {
      expect(getNewFieldName('claimantFullName')).to.equal('veteranFullName');
      expect(getNewFieldName('claimantDateOfBirth')).to.equal(
        'veteranDateOfBirth',
      );
    });

    it('returns original field name for unmapped fields', () => {
      expect(getNewFieldName('unmappedField')).to.equal('unmappedField');
      expect(getNewFieldName('randomField')).to.equal('randomField');
    });
  });

  describe('getOldFieldName', () => {
    it('returns old field name for mapped fields', () => {
      expect(getOldFieldName('veteranFullName')).to.equal('claimantFullName');
      expect(getOldFieldName('veteranDateOfBirth')).to.equal(
        'claimantDateOfBirth',
      );
    });

    it('returns original field name for unmapped fields', () => {
      expect(getOldFieldName('unmappedField')).to.equal('unmappedField');
      expect(getOldFieldName('randomField')).to.equal('randomField');
    });
  });

  describe('hasFieldMapping', () => {
    it('returns true for fields with mappings', () => {
      expect(hasFieldMapping('claimantFullName')).to.be.true;
      expect(hasFieldMapping('veteranFullName')).to.be.true;
      expect(hasFieldMapping('claimantEmail')).to.be.true;
      expect(hasFieldMapping('veteranEmail')).to.be.true;
    });

    it('returns false for fields without mappings', () => {
      expect(hasFieldMapping('unmappedField')).to.be.false;
      expect(hasFieldMapping('randomField')).to.be.false;
    });
  });

  describe('getAllFieldMappings', () => {
    it('returns both forward and reverse mappings', () => {
      const mappings = getAllFieldMappings();

      expect(mappings).to.have.property('forward');
      expect(mappings).to.have.property('reverse');
      expect(mappings.forward).to.deep.equal(FIELD_NAME_MAPPINGS);
      expect(mappings.reverse).to.deep.equal(REVERSE_FIELD_MAPPINGS);
    });

    it('returns copies of mappings, not references', () => {
      const mappings = getAllFieldMappings();

      mappings.forward.newField = 'test';
      expect(FIELD_NAME_MAPPINGS).to.not.have.property('newField');
    });
  });

  describe('validateMigratedFields', () => {
    const testData = {
      veteranFullName: 'John Doe',
      veteranDateOfBirth: '1980-01-01',
      veteranEmail: 'john@example.com',
    };

    it('validates presence of new field names', () => {
      const requiredFields = ['claimantFullName', 'claimantDateOfBirth'];
      const result = validateMigratedFields(testData, requiredFields, true);

      expect(result.valid).to.be.true;
      expect(result.missingFields).to.be.empty;
    });

    it('identifies missing new field names', () => {
      const requiredFields = ['claimantFullName', 'claimantPhone'];
      const result = validateMigratedFields(testData, requiredFields, true);

      expect(result.valid).to.be.false;
      expect(result.missingFields).to.deep.equal(['veteranPhone']);
    });

    it('validates presence of old field names when useNewNames is false', () => {
      const oldData = {
        claimantFullName: 'John Doe',
        claimantDateOfBirth: '1980-01-01',
      };
      const requiredFields = ['veteranFullName', 'veteranDateOfBirth'];
      const result = validateMigratedFields(oldData, requiredFields, false);

      expect(result.valid).to.be.true;
      expect(result.missingFields).to.be.empty;
    });

    it('handles unmapped required fields', () => {
      const requiredFields = ['unmappedField'];
      const result = validateMigratedFields(testData, requiredFields, true);

      expect(result.valid).to.be.false;
      expect(result.missingFields).to.deep.equal(['unmappedField']);
    });
  });

  describe('Integration tests', () => {
    it('performs round-trip migration correctly', () => {
      const originalData = {
        claimantFullName: { first: 'John', last: 'Doe' },
        claimantDateOfBirth: '1980-01-01',
        claimantAddress: {
          street: '123 Main St',
          city: 'Anytown',
        },
        unrelatedField: 'stays the same',
      };

      const migrated = migrateFieldNames(originalData);
      const reversed = reverseFieldNames(migrated);

      expect(reversed).to.deep.equal(originalData);
    });

    it('handles complex nested structures', () => {
      const complexData = {
        metadata: {
          version: '1.0',
        },
        form: {
          claimantInfo: {
            claimantFullName: 'John Doe',
            claimantDetails: {
              claimantDateOfBirth: '1980-01-01',
              claimantSocialSecurityNumber: '123-45-6789',
            },
          },
          benefitType: 'disability',
        },
      };

      const migrated = migrateFieldNames(complexData, { deep: true });

      expect(migrated.form.veteranInfo.veteranFullName).to.equal('John Doe');
      expect(
        migrated.form.veteranInfo.veteranDetails.veteranDateOfBirth,
      ).to.equal('1980-01-01');
      expect(
        migrated.form.veteranInfo.veteranDetails.veteranSocialSecurityNumber,
      ).to.equal('123-45-6789');
      expect(migrated.form.benefitType).to.equal('disability');
      expect(migrated.metadata.version).to.equal('1.0');
    });

    it('middleware chain works correctly', () => {
      const addTimestamp = data => ({
        ...data,
        timestamp: '2024-01-01',
      });

      const migrateMiddleware = createFieldMigrationMiddleware({ toNew: true });

      const pipeline = data => migrateMiddleware(addTimestamp(data));

      const result = pipeline({
        claimantFullName: 'John Doe',
      });

      expect(result).to.deep.equal({
        veteranFullName: 'John Doe',
        timestamp: '2024-01-01',
      });
    });
  });
});
