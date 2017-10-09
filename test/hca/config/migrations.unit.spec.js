import { expect } from 'chai';

import formConfig from '../../../src/js/hca/config/form';

const migrations = formConfig.migrations;

describe('HCA migrations', () => {
  describe('first migration', () => {
    it('should remove hispanic property and add in view: object', () => {
      const data = {
        isSpanishHispanicLatino: false
      };

      expect(migrations[0](data)).to.eql({
        'view:demographicCategories': {
          isSpanishHispanicLatino: false
        }
      });
    });
    it('should not remove existing hispanic choice', () => {
      const data = {
        isSpanishHispanicLatino: false,
        'view:demographicCategories': {
          isSpanishHispanicLatino: true
        }
      };

      expect(migrations[0](data)).to.eql({
        'view:demographicCategories': {
          isSpanishHispanicLatino: true
        }
      });
    });
  });
  describe('second migration', () => {
    const migration = migrations[1];
    it('should convert report children field', () => {
      const data = {
        'view:reportChildren': false
      };

      expect(migration(data)).to.eql({
        'view:reportDependents': data['view:reportChildren']
      });
    });
    it('should change name of empty children array', () => {
      const data = {
        children: []
      };

      expect(migration(data)).to.eql({
        dependents: []
      });
    });
    it('should change field names inside children items', () => {
      const data = {
        children: [{
          childFullName: 'test',
          childRelation: 'Son',
          childEducationExpenses: 34,
          income: 2,
          'view:childSupportDescription': {}
        }]
      };

      expect(migration(data)).to.eql({
        dependents: [{
          fullName: data.children[0].childFullName,
          dependentRelation: data.children[0].childRelation,
          dependentEducationExpenses: data.children[0].childEducationExpenses,
          income: data.children[0].income,
          'view:dependentSupportDescription': data.children[0]['view:childSupportDescription']
        }]
      });
    });
  });
});
