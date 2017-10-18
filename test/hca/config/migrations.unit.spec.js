import { expect } from 'chai';

import formConfig from '../../../src/js/hca/config/form';

const migrations = formConfig.migrations;

describe('HCA migrations', () => {
  describe('first migration', () => {
    it('should remove hispanic property and add in view: object', () => {
      const data = {
        formData: {
          isSpanishHispanicLatino: false
        }
      };

      expect(migrations[0](data)).to.eql({
        formData: {
          'view:demographicCategories': {
            isSpanishHispanicLatino: false
          }
        }
      });
    });
    it('should not remove existing hispanic choice', () => {
      const data = {
        formData: {
          isSpanishHispanicLatino: false,
          'view:demographicCategories': {
            isSpanishHispanicLatino: true
          }
        }
      };

      expect(migrations[0](data)).to.eql({
        formData: {
          'view:demographicCategories': {
            isSpanishHispanicLatino: true
          }
        }
      });
    });
  });
  describe('second migration', () => {
    const migration = migrations[1];
    it('should convert report children field', () => {
      const data = {
        formData: {
          'view:reportChildren': false
        }
      };

      expect(migration(data).formData).to.eql({
        'view:reportDependents': data.formData['view:reportChildren']
      });
    });
    it('should change name of empty children array', () => {
      const data = {
        formData: {
          children: []
        }
      };

      expect(migration(data).formData).to.eql({
        dependents: []
      });
    });
    it('should change field names inside children items', () => {
      const data = {
        formData: {
          children: [{
            childFullName: 'test',
            childRelation: 'Son',
            childEducationExpenses: 34,
            income: 2,
            'view:childSupportDescription': {}
          }]
        }
      };

      expect(migration(data).formData).to.eql({
        dependents: [{
          fullName: data.formData.children[0].childFullName,
          dependentRelation: data.formData.children[0].childRelation,
          dependentEducationExpenses: data.formData.children[0].childEducationExpenses,
          income: data.formData.children[0].income,
          'view:dependentSupportDescription': data.formData.children[0]['view:childSupportDescription']
        }]
      });
    });
  });
  describe('third migration', () => {
    const migration = migrations[2];
    it('should update url when it matches', () => {
      const data = {
        formData: {
          'view:reportChildren': false
        },
        metadata: {
          returnUrl: '/household-information/child-information'
        }
      };

      const { formData, metadata } = migration(data);
      expect(metadata.returnUrl).to.equal('/household-information/dependent-information');
      expect(formData).to.equal(data.formData);
    });
    it('should leave url alone when it does not match', () => {
      const data = {
        formData: {
          'view:reportChildren': false
        },
        metadata: {
          returnUrl: '/household-information/spouse-information'
        }
      };

      const { formData, metadata } = migration(data);
      expect(metadata.returnUrl).to.equal(data.metadata.returnUrl);
      expect(formData).to.equal(data.formData);
    });
  });
});
