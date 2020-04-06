import formConfig from '../../config/form';

const migrations = formConfig.migrations;

describe('HCA migrations', () => {
  describe('first migration', () => {
    test('should remove hispanic property and add in view: object', () => {
      const data = {
        formData: {
          isSpanishHispanicLatino: false,
        },
      };

      expect(migrations[0](data)).toEqual({
        formData: {
          'view:demographicCategories': {
            isSpanishHispanicLatino: false,
          },
        },
      });
    });
    test('should not remove existing hispanic choice', () => {
      const data = {
        formData: {
          isSpanishHispanicLatino: false,
          'view:demographicCategories': {
            isSpanishHispanicLatino: true,
          },
        },
      };

      expect(migrations[0](data)).toEqual({
        formData: {
          'view:demographicCategories': {
            isSpanishHispanicLatino: true,
          },
        },
      });
    });
  });
  describe('second migration', () => {
    const migration = migrations[1];
    test('should convert report children field', () => {
      const data = {
        formData: {
          'view:reportChildren': false,
        },
      };

      expect(migration(data).formData).toEqual({
        'view:reportDependents': data.formData['view:reportChildren'],
      });
    });
    test('should change name of empty children array', () => {
      const data = {
        formData: {
          children: [],
        },
      };

      expect(migration(data).formData).toEqual({
        dependents: [],
      });
    });
    test('should change field names inside children items', () => {
      const data = {
        formData: {
          children: [
            {
              childFullName: 'test',
              childRelation: 'Son',
              childEducationExpenses: 34,
              income: 2,
              'view:childSupportDescription': {},
            },
          ],
        },
      };

      expect(migration(data).formData).toEqual({
        dependents: [
          {
            fullName: data.formData.children[0].childFullName,
            dependentRelation: data.formData.children[0].childRelation,
            dependentEducationExpenses:
              data.formData.children[0].childEducationExpenses,
            income: data.formData.children[0].income,
            'view:dependentSupportDescription':
              data.formData.children[0]['view:childSupportDescription'],
          },
        ],
      });
    });
  });
  describe('third migration', () => {
    const migration = migrations[2];
    test('should update url when it matches', () => {
      const data = {
        formData: {
          'view:reportChildren': false,
        },
        metadata: {
          returnUrl: '/household-information/child-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata.returnUrl).toBe(
        '/household-information/dependent-information',
      );
      expect(formData).toBe(data.formData);
    });
    test('should leave url alone when it does not match', () => {
      const data = {
        formData: {
          'view:reportChildren': false,
        },
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata.returnUrl).toBe(data.metadata.returnUrl);
      expect(formData).toBe(data.formData);
    });
  });
  describe('fourth migration', () => {
    const migration = migrations[3];
    test('should leave data alone if not set', () => {
      const data = {
        formData: {},
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata).toBe(data.metadata);
      expect(formData).toBe(data.formData);
    });
    test('should set to none if all false', () => {
      const data = {
        formData: {
          compensableVaServiceConnected: false,
          receivesVaPension: false,
          isVaServiceConnected: false,
        },
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata).toBe(data.metadata);
      expect(formData.vaCompensationType).toBe('none');
      expect(formData.compensableVaServiceConnected).toBeUndefined();
      expect(formData.receivesVaPension).toBeUndefined();
      expect(formData.isVaServiceConnected).toBeUndefined();
    });
    test('should set to highDisability if isVaServiceConnected', () => {
      const data = {
        formData: {
          compensableVaServiceConnected: false,
          receivesVaPension: false,
          isVaServiceConnected: true,
        },
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata).toBe(data.metadata);
      expect(formData.vaCompensationType).toBe('highDisability');
      expect(formData.compensableVaServiceConnected).toBeUndefined();
      expect(formData.receivesVaPension).toBeUndefined();
      expect(formData.isVaServiceConnected).toBeUndefined();
    });
    test('should set to lowDisability if compensableVaServiceConnected', () => {
      const data = {
        formData: {
          compensableVaServiceConnected: true,
          receivesVaPension: false,
          isVaServiceConnected: false,
        },
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata).toBe(data.metadata);
      expect(formData.vaCompensationType).toBe('lowDisability');
      expect(formData.compensableVaServiceConnected).toBeUndefined();
      expect(formData.receivesVaPension).toBeUndefined();
      expect(formData.isVaServiceConnected).toBeUndefined();
    });
    test('should set to pension if receivesVaPension', () => {
      const data = {
        formData: {
          compensableVaServiceConnected: false,
          receivesVaPension: true,
          isVaServiceConnected: false,
        },
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata).toBe(data.metadata);
      expect(formData.vaCompensationType).toBe('pension');
      expect(formData.compensableVaServiceConnected).toBeUndefined();
      expect(formData.receivesVaPension).toBeUndefined();
      expect(formData.isVaServiceConnected).toBeUndefined();
    });
    test('should set url if any other combination of choices', () => {
      const data = {
        formData: {
          compensableVaServiceConnected: true,
          receivesVaPension: true,
          isVaServiceConnected: false,
        },
        metadata: {
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { formData, metadata } = migration(data);
      expect(metadata.returnUrl).toBe('/va-benefits/basic-information');
      expect(formData.vaCompensationType).toBeUndefined();
      expect(formData.compensableVaServiceConnected).toBeUndefined();
      expect(formData.receivesVaPension).toBeUndefined();
      expect(formData.isVaServiceConnected).toBeUndefined();
    });
    test('should not set url if prefill', () => {
      const data = {
        formData: {
          compensableVaServiceConnected: true,
          receivesVaPension: true,
          isVaServiceConnected: false,
        },
        metadata: {
          prefill: true,
          returnUrl: '/household-information/spouse-information',
        },
      };

      const { metadata } = migration(data);
      expect(metadata.returnUrl).toBe(
        '/household-information/spouse-information',
      );
    });
  });
  describe('fifth migration', () => {
    const migration = migrations[4];
    test('should unset required fields that are blank strings', () => {
      const data = {
        formData: {
          veteranFullName: {
            first: '   ',
            last: ' ',
          },
          veteranAddress: {
            street: '                    ',
            city: ' ',
          },
        },
      };

      const { formData } = migration(data);
      expect(formData.veteranFullName).toEqual({});
      expect(formData.veteranAddress).toEqual({});
    });
    test('set the return URL to veteran address when address updated', () => {
      const data = {
        formData: {
          veteranAddress: {
            street: '                    ',
            city: ' ',
          },
        },
      };

      const { formData, metadata } = migration(data);
      expect(formData.veteranAddress).toEqual({});
      expect(metadata.returnUrl).toBe('veteran-information/veteran-address');
    });
    test('set the return URL to veteran information when veteranFullName updated', () => {
      const data = {
        formData: {
          veteranFullName: {
            first: '   ',
            last: ' ',
          },
        },
      };

      const { formData, metadata } = migration(data);
      expect(formData.veteranFullName).toEqual({});
      expect(metadata.returnUrl).toBe(
        'veteran-information/personal-information',
      );
    });
  });
  describe('sixth migration', () => {
    const migration = migrations[5];
    test('should unset insurance fields that are blank strings', () => {
      const data = {
        formData: {
          providers: [
            {
              insuranceGroupCode: '    ',
              insurancePolicyNumber: ' ',
            },
            {
              insuranceGroupCode: '   t',
              insurancePolicyNumber: ' ',
            },
          ],
        },
      };

      const { formData } = migration(data);
      expect(formData.providers[0]).toEqual({});
      expect(formData.providers[1]).toEqual({ insuranceGroupCode: '   t' });
    });
  });
});
