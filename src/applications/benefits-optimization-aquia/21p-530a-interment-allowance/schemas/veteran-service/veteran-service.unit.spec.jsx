/**
 * Unit tests for service period schemas
 * Tests the fix for the Zod schema issue where .shape was undefined
 */

import { expect } from 'chai';
import {
  alternateNameSchema,
  branchOfServiceSchema,
  dateEnteredServiceSchema,
  dateSeparatedSchema,
  formatPreviousNameSummary,
  formatServicePeriodSummary,
  hasAlternateNamesSchema,
  isPreviousNameEmpty,
  isServicePeriodEmpty,
  placeEnteredServiceSchema,
  placeSeparatedSchema,
  previousNameItemSchema,
  previousNamesSchema,
  rankSchema,
  servicePeriodBase,
  servicePeriodItemSchema,
  servicePeriodsSchema,
  veteranServiceSchema,
} from './veteran-service';

describe('Service Period Schemas', () => {
  describe('servicePeriodBase', () => {
    it('should have a shape property with field schemas', () => {
      expect(servicePeriodBase).to.exist;
      expect(servicePeriodBase.shape).to.exist;
      expect(servicePeriodBase.shape.branchOfService).to.exist;
      expect(servicePeriodBase.shape.dateFrom).to.exist;
      expect(servicePeriodBase.shape.dateTo).to.exist;
      expect(servicePeriodBase.shape.placeOfEntry).to.exist;
      expect(servicePeriodBase.shape.placeOfSeparation).to.exist;
      expect(servicePeriodBase.shape.rank).to.exist;
    });

    it('should validate a valid service period', () => {
      const validPeriod = {
        branchOfService: 'army',
        dateFrom: '1962-01-01',
        dateTo: '1965-05-19',
        placeOfEntry: 'Coruscant Jedi Temple',
        placeOfSeparation: 'Mustafar',
        rank: 'Jedi Knight / General',
      };

      const result = servicePeriodBase.safeParse(validPeriod);
      expect(result.success).to.be.true;
    });

    it('should require branchOfService', () => {
      const invalidPeriod = {
        dateFrom: '2010-01-01',
        dateTo: '2014-12-31',
      };

      const result = servicePeriodBase.safeParse(invalidPeriod);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].path[0]).to.equal('branchOfService');
      }
    });

    it('should require dateFrom and dateTo', () => {
      const invalidPeriod = {
        branchOfService: 'army',
      };

      const result = servicePeriodBase.safeParse(invalidPeriod);
      expect(result.success).to.be.false;
      if (!result.success) {
        const paths = result.error.issues.map(issue => issue.path[0]);
        expect(paths).to.include('dateFrom');
        expect(paths).to.include('dateTo');
      }
    });

    it('should accept optional fields', () => {
      const minimalPeriod = {
        branchOfService: 'navy',
        dateFrom: '2015-01-01',
        dateTo: '2019-12-31',
      };

      const result = servicePeriodBase.safeParse(minimalPeriod);
      expect(result.success).to.be.true;
    });
  });

  describe('servicePeriodItemSchema', () => {
    it('should NOT have a shape property (uses .refine)', () => {
      expect(servicePeriodItemSchema).to.exist;
      expect(servicePeriodItemSchema.shape).to.be.undefined;
    });

    it('should validate dates are in correct order', () => {
      const invalidDates = {
        branchOfService: 'air force',
        dateFrom: '2014-12-31',
        dateTo: '2010-01-01', // End date before start date
        placeOfEntry: '',
        placeOfSeparation: '',
        rank: '',
      };

      const result = servicePeriodItemSchema.safeParse(invalidDates);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.include(
          'Service start date must be before end date',
        );
      }
    });

    it('should allow same dates or missing dates', () => {
      const sameDates = {
        branchOfService: 'marine corps',
        dateFrom: '2010-01-01',
        dateTo: '2010-01-01',
      };

      const result = servicePeriodItemSchema.safeParse(sameDates);
      expect(result.success).to.be.true;
    });

    it('should validate valid branch values', () => {
      const invalidBranch = {
        branchOfService: 'invalid_branch',
        dateFrom: '2010-01-01',
        dateTo: '2014-12-31',
      };

      const result = servicePeriodItemSchema.safeParse(invalidBranch);
      expect(result.success).to.be.false;
    });
  });

  describe('servicePeriodsSchema', () => {
    it('should validate an array of service periods', () => {
      const periods = [
        {
          branchOfService: 'army',
          dateFrom: '1962-01-01',
          dateTo: '1965-05-19',
          placeOfEntry: 'Coruscant Jedi Temple',
          placeOfSeparation: 'Mustafar',
          rank: 'Jedi Knight / General',
        },
        {
          branchOfService: 'navy',
          dateFrom: '1965-05-20',
          dateTo: '1984-05-04',
          placeOfEntry: 'Death Star I',
          placeOfSeparation: 'Death Star II',
          rank: 'Supreme Commander',
        },
      ];

      const result = servicePeriodsSchema.safeParse(periods);
      expect(result.success).to.be.true;
    });

    it('should require at least one service period', () => {
      const emptyArray = [];

      const result = servicePeriodsSchema.safeParse(emptyArray);
      expect(result.success).to.be.false;
      if (!result.success) {
        expect(result.error.issues[0].message).to.equal(
          'At least one service period is required',
        );
      }
    });
  });

  describe('Helper Functions', () => {
    describe('formatServicePeriodSummary', () => {
      it('should format a complete service period summary', () => {
        const period = {
          branchOfService: 'army',
          dateFrom: '2010-01-15',
          dateTo: '2014-12-31',
        };

        const summary = formatServicePeriodSummary(period);
        expect(summary).to.include('Army');
        expect(summary).to.match(/January (14|15), 2010/);
        expect(summary).to.match(/December (30|31), 2014/);
      });

      it('should handle missing dates gracefully', () => {
        const period = {
          branchOfService: 'navy',
          dateFrom: '',
          dateTo: '',
        };

        const summary = formatServicePeriodSummary(period);
        expect(summary).to.include('Navy');
      });

      it('should handle empty period', () => {
        const period = {
          branchOfService: '',
          dateFrom: '',
          dateTo: '',
        };

        const summary = formatServicePeriodSummary(period);
        expect(summary).to.equal('');
      });
    });

    describe('isServicePeriodEmpty', () => {
      it('should return true for empty period', () => {
        const emptyPeriod = {
          branchOfService: '',
          dateFrom: '',
          dateTo: '',
          placeOfEntry: '',
          placeOfSeparation: '',
          rank: '',
        };

        expect(isServicePeriodEmpty(emptyPeriod)).to.be.true;
      });

      it('should return false if any field has value', () => {
        const periodWithBranch = {
          branchOfService: 'army',
          dateFrom: '',
          dateTo: '',
          placeOfEntry: '',
          placeOfSeparation: '',
          rank: '',
        };

        expect(isServicePeriodEmpty(periodWithBranch)).to.be.false;
      });

      it('should return false if only optional fields have values', () => {
        const periodWithRank = {
          branchOfService: '',
          dateFrom: '',
          dateTo: '',
          placeOfEntry: '',
          placeOfSeparation: '',
          rank: 'Captain',
        };

        expect(isServicePeriodEmpty(periodWithRank)).to.be.false;
      });
    });
  });

  describe('Schema Compatibility', () => {
    it('should use servicePeriodBase.shape for individual field validation', () => {
      const branchSchema = servicePeriodBase.shape.branchOfService;
      expect(branchSchema).to.exist;

      const validBranch = 'army';
      const invalidBranch = 'invalid';

      expect(branchSchema.safeParse(validBranch).success).to.be.true;
      expect(branchSchema.safeParse(invalidBranch).success).to.be.false;
    });

    it('should use servicePeriodItemSchema for complete validation', () => {
      const period = {
        branchOfService: 'coast guard',
        dateFrom: '2020-01-01',
        dateTo: '2022-12-31',
      };

      const result = servicePeriodItemSchema.safeParse(period);
      expect(result.success).to.be.true;
    });
  });
});

describe('Branch of Service Schema', () => {
  it('should validate all valid branches', () => {
    const validBranches = [
      'air force',
      'army',
      'coast guard',
      'marine corps',
      'merchant seaman',
      'navy',
      'noaa',
      'space force',
      'usphs',
      'f.commonwealth',
      'f.guerilla',
      'f.scouts new',
      'f.scouts old',
    ];

    validBranches.forEach(branch => {
      const result = branchOfServiceSchema.safeParse(branch);
      expect(result.success).to.be.true;
    });
  });

  it('should reject empty string', () => {
    const result = branchOfServiceSchema.safeParse('');
    expect(result.success).to.be.false;
  });

  it('should reject invalid branch', () => {
    const result = branchOfServiceSchema.safeParse('starfleet');
    expect(result.success).to.be.false;
  });
});

describe('Date Schemas', () => {
  describe('dateEnteredServiceSchema', () => {
    it('should validate valid date', () => {
      const result = dateEnteredServiceSchema.safeParse('1962-01-01');
      expect(result.success).to.be.true;
    });

    it('should reject empty string', () => {
      const result = dateEnteredServiceSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject invalid date', () => {
      const result = dateEnteredServiceSchema.safeParse('not-a-date');
      expect(result.success).to.be.false;
    });

    it('should reject invalid date format', () => {
      const result = dateEnteredServiceSchema.safeParse('13/45/2020');
      expect(result.success).to.be.false;
    });
  });

  describe('dateSeparatedSchema', () => {
    it('should validate valid date', () => {
      const result = dateSeparatedSchema.safeParse('1984-05-04');
      expect(result.success).to.be.true;
    });

    it('should reject empty string', () => {
      const result = dateSeparatedSchema.safeParse('');
      expect(result.success).to.be.false;
    });

    it('should reject invalid date', () => {
      const result = dateSeparatedSchema.safeParse('invalid');
      expect(result.success).to.be.false;
    });
  });
});

describe('Place Schemas', () => {
  describe('placeEnteredServiceSchema', () => {
    it('should validate valid place', () => {
      const result = placeEnteredServiceSchema.safeParse(
        'Coruscant Jedi Temple',
      );
      expect(result.success).to.be.true;
    });

    it('should accept empty string', () => {
      const result = placeEnteredServiceSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject string over 100 characters', () => {
      const longString = 'a'.repeat(101);
      const result = placeEnteredServiceSchema.safeParse(longString);
      expect(result.success).to.be.false;
    });

    it('should accept string at 100 characters', () => {
      const maxString = 'a'.repeat(100);
      const result = placeEnteredServiceSchema.safeParse(maxString);
      expect(result.success).to.be.true;
    });
  });

  describe('placeSeparatedSchema', () => {
    it('should validate valid place', () => {
      const result = placeSeparatedSchema.safeParse('Mustafar');
      expect(result.success).to.be.true;
    });

    it('should accept empty string', () => {
      const result = placeSeparatedSchema.safeParse('');
      expect(result.success).to.be.true;
    });

    it('should reject string over 100 characters', () => {
      const longString = 'b'.repeat(101);
      const result = placeSeparatedSchema.safeParse(longString);
      expect(result.success).to.be.false;
    });
  });
});

describe('Rank Schema', () => {
  it('should validate valid rank', () => {
    const result = rankSchema.safeParse('Jedi Knight');
    expect(result.success).to.be.true;
  });

  it('should accept empty string', () => {
    const result = rankSchema.safeParse('');
    expect(result.success).to.be.true;
  });

  it('should reject string over 50 characters', () => {
    const longRank = 'a'.repeat(51);
    const result = rankSchema.safeParse(longRank);
    expect(result.success).to.be.false;
  });

  it('should accept string at 50 characters', () => {
    const maxRank = 'a'.repeat(50);
    const result = rankSchema.safeParse(maxRank);
    expect(result.success).to.be.true;
  });
});

describe('Has Alternate Names Schema', () => {
  it('should validate "yes"', () => {
    const result = hasAlternateNamesSchema.safeParse('yes');
    expect(result.success).to.be.true;
  });

  it('should validate "no"', () => {
    const result = hasAlternateNamesSchema.safeParse('no');
    expect(result.success).to.be.true;
  });

  it('should reject invalid value', () => {
    const result = hasAlternateNamesSchema.safeParse('maybe');
    expect(result.success).to.be.false;
  });

  it('should have custom error message', () => {
    const result = hasAlternateNamesSchema.safeParse('invalid');
    expect(result.success).to.be.false;
    if (!result.success) {
      expect(result.error.issues[0].message).to.equal(
        'Please select yes or no',
      );
    }
  });
});

describe('Previous Name Schemas', () => {
  describe('previousNameItemSchema', () => {
    it('should validate complete name', () => {
      const name = {
        firstName: 'Anakin',
        middleName: '',
        lastName: 'Skywalker',
      };
      const result = previousNameItemSchema.safeParse(name);
      expect(result.success).to.be.true;
    });

    it('should require firstName', () => {
      const name = {
        firstName: '',
        lastName: 'Skywalker',
      };
      const result = previousNameItemSchema.safeParse(name);
      expect(result.success).to.be.false;
    });

    it('should require lastName', () => {
      const name = {
        firstName: 'Anakin',
        lastName: '',
      };
      const result = previousNameItemSchema.safeParse(name);
      expect(result.success).to.be.false;
    });

    it('should accept name without middleName', () => {
      const name = {
        firstName: 'Luke',
        lastName: 'Skywalker',
      };
      const result = previousNameItemSchema.safeParse(name);
      expect(result.success).to.be.true;
    });

    it('should reject firstName over 50 characters', () => {
      const name = {
        firstName: 'a'.repeat(51),
        lastName: 'Skywalker',
      };
      const result = previousNameItemSchema.safeParse(name);
      expect(result.success).to.be.false;
    });

    it('should reject lastName over 50 characters', () => {
      const name = {
        firstName: 'Anakin',
        lastName: 'b'.repeat(51),
      };
      const result = previousNameItemSchema.safeParse(name);
      expect(result.success).to.be.false;
    });
  });

  describe('previousNamesSchema', () => {
    it('should validate array with one name', () => {
      const names = [
        {
          firstName: 'Darth',
          middleName: '',
          lastName: 'Vader',
        },
      ];
      const result = previousNamesSchema.safeParse(names);
      expect(result.success).to.be.true;
    });

    it('should validate array with multiple names', () => {
      const names = [
        { firstName: 'Anakin', lastName: 'Skywalker' },
        { firstName: 'Darth', lastName: 'Vader' },
      ];
      const result = previousNamesSchema.safeParse(names);
      expect(result.success).to.be.true;
    });

    it('should reject empty array', () => {
      const result = previousNamesSchema.safeParse([]);
      expect(result.success).to.be.false;
    });
  });

  describe('isPreviousNameEmpty', () => {
    it('should return true for completely empty name', () => {
      const name = { firstName: '', middleName: '', lastName: '' };
      expect(isPreviousNameEmpty(name)).to.be.true;
    });

    it('should return false when firstName is present', () => {
      const name = { firstName: 'Anakin', middleName: '', lastName: '' };
      expect(isPreviousNameEmpty(name)).to.be.false;
    });

    it('should return false when middleName is present', () => {
      const name = { firstName: '', middleName: 'Danger', lastName: '' };
      expect(isPreviousNameEmpty(name)).to.be.false;
    });

    it('should return false when lastName is present', () => {
      const name = { firstName: '', middleName: '', lastName: 'Skywalker' };
      expect(isPreviousNameEmpty(name)).to.be.false;
    });
  });

  describe('formatPreviousNameSummary', () => {
    it('should format full name with middle name', () => {
      const name = {
        firstName: 'Leia',
        middleName: 'Amidala',
        lastName: 'Organa',
      };
      const summary = formatPreviousNameSummary(name);
      expect(summary).to.equal('Leia Amidala Organa');
    });

    it('should format name without middle name', () => {
      const name = { firstName: 'Luke', middleName: '', lastName: 'Skywalker' };
      const summary = formatPreviousNameSummary(name);
      expect(summary).to.equal('Luke Skywalker');
    });

    it('should return empty string for empty name', () => {
      const name = { firstName: '', middleName: '', lastName: '' };
      const summary = formatPreviousNameSummary(name);
      expect(summary).to.equal('');
    });

    it('should filter out empty parts', () => {
      const name = {
        firstName: 'Anakin',
        middleName: undefined,
        lastName: 'Skywalker',
      };
      const summary = formatPreviousNameSummary(name);
      expect(summary).to.equal('Anakin Skywalker');
    });
  });
});

describe('Alternate Name Schema', () => {
  it('should validate when hasAlternateName is no', () => {
    const data = {
      hasAlternateName: 'no',
    };
    const result = alternateNameSchema.safeParse(data);
    expect(result.success).to.be.true;
  });

  it('should validate when hasAlternateName is yes with complete data', () => {
    const data = {
      hasAlternateName: 'yes',
      alternateName: 'Darth Vader',
      alternateServiceInfo: 'Served as Supreme Commander of Imperial Forces',
    };
    const result = alternateNameSchema.safeParse(data);
    expect(result.success).to.be.true;
  });

  it('should reject when hasAlternateName is yes but alternateName is missing', () => {
    const data = {
      hasAlternateName: 'yes',
      alternateServiceInfo: 'Some info',
    };
    const result = alternateNameSchema.safeParse(data);
    expect(result.success).to.be.false;
  });

  it('should reject when hasAlternateName is yes but alternateServiceInfo is missing', () => {
    const data = {
      hasAlternateName: 'yes',
      alternateName: 'Darth Vader',
    };
    const result = alternateNameSchema.safeParse(data);
    expect(result.success).to.be.false;
  });

  it('should have custom error message for enum validation', () => {
    const data = {
      hasAlternateName: 'maybe',
    };
    const result = alternateNameSchema.safeParse(data);
    expect(result.success).to.be.false;
    if (!result.success) {
      expect(result.error.issues[0].message).to.include(
        'Please indicate if veteran served under another name',
      );
    }
  });
});

describe('Veteran Service Schema', () => {
  it('should validate complete veteran service data', () => {
    const data = {
      branchOfService: 'army',
      dateEnteredService: '1962-01-01',
      placeEnteredService: 'Coruscant',
      rankAtSeparation: 'General',
      dateSeparated: '1965-05-19',
      placeSeparated: 'Mustafar',
      alternateNameInfo: {
        hasAlternateName: 'no',
      },
    };
    const result = veteranServiceSchema.safeParse(data);
    expect(result.success).to.be.true;
  });

  it('should reject when entry date is after separation date', () => {
    const data = {
      branchOfService: 'army',
      dateEnteredService: '1984-05-04',
      placeEnteredService: '',
      rankAtSeparation: '',
      dateSeparated: '1962-01-01',
      placeSeparated: '',
      alternateNameInfo: {
        hasAlternateName: 'no',
      },
    };
    const result = veteranServiceSchema.safeParse(data);
    expect(result.success).to.be.false;
    if (!result.success) {
      expect(result.error.issues[0].message).to.include(
        'Service entry date must be before separation date',
      );
    }
  });

  it('should require all mandatory fields', () => {
    const data = {};
    const result = veteranServiceSchema.safeParse(data);
    expect(result.success).to.be.false;
  });
});

describe('Additional formatServicePeriodSummary Edge Cases', () => {
  it('should handle period with only dateFrom', () => {
    const period = {
      branchOfService: 'navy',
      dateFrom: '2010-01-15',
      dateTo: '',
    };
    const summary = formatServicePeriodSummary(period);
    expect(summary).to.include('Navy');
    expect(summary).to.include('Unknown');
  });

  it('should handle period with only dateTo', () => {
    const period = {
      branchOfService: 'air force',
      dateFrom: '',
      dateTo: '2014-12-31',
    };
    const summary = formatServicePeriodSummary(period);
    expect(summary).to.include('Air Force');
    expect(summary).to.include('Unknown');
  });

  it('should handle unknown branch gracefully', () => {
    const period = {
      branchOfService: 'unknown_branch',
      dateFrom: '2010-01-01',
      dateTo: '2014-12-31',
    };
    const summary = formatServicePeriodSummary(period);
    expect(summary).to.include('unknown_branch');
  });

  it('should handle period with only rank', () => {
    const period = {
      branchOfService: '',
      dateFrom: '',
      dateTo: '',
      placeOfEntry: '',
      placeOfSeparation: '',
      rank: 'Captain',
    };
    const summary = formatServicePeriodSummary(period);
    expect(summary).to.equal('');
  });
});
