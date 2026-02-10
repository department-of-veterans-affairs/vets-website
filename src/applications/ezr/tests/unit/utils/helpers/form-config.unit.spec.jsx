import { expect } from 'chai';
import {
  includeSpousalInformation,
  includeHouseholdInformation,
  isMissingVeteranDob,
  isMissingVeteranGender,
  hasDifferentHomeAddress,
  showFinancialStatusAlert,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  includeInsuranceInformation,
  collectMedicareInformation,
  canVeteranProvideRadiationCleanupResponse,
  canVeteranProvideGulfWarServiceResponse,
  canVeteranProvideCombatOperationsResponse,
  canVeteranProvideAgentOrangeResponse,
  canVeteranProvidePostSept11ServiceResponse,
  includeGulfWarServiceDates,
  includeAgentOrangeExposureDates,
  includePostSept11ServiceDates,
} from '../../../../utils/helpers/form-config';
import {
  DEPENDENT_VIEW_FIELDS,
  INSURANCE_VIEW_FIELDS,
} from '../../../../utils/constants';

describe('ezr form config helpers', () => {
  context('when `isMissingVeteranDob` executes', () => {
    context('when viewfield is `null`', () => {
      const formData = { 'view:userDob': null };
      it('should return `true`', () => {
        expect(isMissingVeteranDob(formData)).to.be.true;
      });
    });

    context('when viewfield is populated', () => {
      const formData = { 'view:userDob': '1990-01-01' };
      it('should return `false`', () => {
        expect(isMissingVeteranDob(formData)).to.be.false;
      });
    });
  });

  context('when `isMissingVeteranGender` executes', () => {
    context('when gender is `null`', () => {
      const formData = { 'view:userGender': null };
      it('should return `true`', () => {
        expect(isMissingVeteranGender(formData)).to.be.true;
      });
    });

    context('when viewfield is populated', () => {
      const formData = { 'view:userGender': 'F' };
      it('should return `false`', () => {
        expect(isMissingVeteranGender(formData)).to.be.false;
      });
    });
  });

  context('when `hasDifferentHomeAddress` executes', () => {
    context('when mailing matches home address', () => {
      const formData = { 'view:doesMailingMatchHomeAddress': true };
      it('should return `false`', () => {
        expect(hasDifferentHomeAddress(formData)).to.be.false;
      });
    });

    context('when mailing does not match home address', () => {
      const formData = { 'view:doesMailingMatchHomeAddress': false };
      it('should return `true`', () => {
        expect(hasDifferentHomeAddress(formData)).to.be.true;
      });
    });
  });

  context('when `includeHouseholdInformation` executes', () => {
    context('when household section is enabled', () => {
      const formData = { 'view:householdEnabled': true };
      it('should return `true`', () => {
        expect(includeHouseholdInformation(formData)).to.be.true;
      });
    });

    context('when household section is disabled', () => {
      const formData = { 'view:householdEnabled': false };
      it('should return `false`', () => {
        expect(includeHouseholdInformation(formData)).to.be.false;
      });
    });
  });

  context('when `showFinancialStatusAlert` executes', () => {
    context('when household section is enabled', () => {
      const formData = { 'view:householdEnabled': true };
      it('should return `false`', () => {
        expect(showFinancialStatusAlert(formData)).to.be.false;
      });
    });

    context('when household section is disabled', () => {
      const formData = { 'view:householdEnabled': false };
      it('should return `true`', () => {
        expect(showFinancialStatusAlert(formData)).to.be.true;
      });
    });
  });

  context('when `includeSpousalInformation` executes', () => {
    context('when household information section is disabled', () => {
      const formData = { 'view:householdEnabled': false };
      it('should return `false`', () => {
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });

    context('when marital status is `never married`', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'never married' },
        'view:householdEnabled': true,
      };
      it('should return `false`', () => {
        expect(includeSpousalInformation(formData)).to.be.false;
      });
    });

    context('when marital status is `married`', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'married' },
        'view:householdEnabled': true,
      };
      it('should return `true`', () => {
        expect(includeSpousalInformation(formData)).to.be.true;
      });
    });

    context('when marital status is `separated`', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'separated' },
        'view:householdEnabled': true,
      };
      it('should return `true`', () => {
        expect(includeSpousalInformation(formData)).to.be.true;
      });
    });
  });

  context('when `spouseDidNotCohabitateWithVeteran` executes', () => {
    context('when Veteran was not married or legally separarted', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'not married' },
        'view:householdEnabled': true,
      };
      it('should return `false`', () => {
        expect(spouseDidNotCohabitateWithVeteran(formData)).to.be.false;
      });
    });

    context('when spouse did cohabitate with Veteran', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'married' },
        'view:householdEnabled': true,
        cohabitedLastYear: true,
      };
      it('should return `false`', () => {
        expect(spouseDidNotCohabitateWithVeteran(formData)).to.be.false;
      });
    });

    context('when spouse did not cohabitate with Veteran', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'married' },
        'view:householdEnabled': true,
        cohabitedLastYear: false,
      };
      it('should return `true`', () => {
        expect(spouseDidNotCohabitateWithVeteran(formData)).to.be.true;
      });
    });
  });

  context('when `spouseAddressDoesNotMatchVeterans` executes', () => {
    context('when Veteran was not married or legally separarted', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'not married' },
        'view:householdEnabled': true,
      };
      it('should return `false`', () => {
        expect(spouseAddressDoesNotMatchVeterans(formData)).to.be.false;
      });
    });

    context('when spouse address matches Veteran', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'married' },
        'view:householdEnabled': true,
        sameAddress: true,
      };
      it('should return `false`', () => {
        expect(spouseAddressDoesNotMatchVeterans(formData)).to.be.false;
      });
    });

    context('when spouse address does not match Veteran', () => {
      const formData = {
        'view:maritalStatus': { maritalStatus: 'married' },
        'view:householdEnabled': true,
        sameAddress: false,
      };
      it('should return `true`', () => {
        expect(spouseAddressDoesNotMatchVeterans(formData)).to.be.true;
      });
    });
  });

  context('when `includeDependentInformation` executes', () => {
    context('when skip value is `true`', () => {
      const formData = {
        'view:householdEnabled': true,
        [DEPENDENT_VIEW_FIELDS.skip]: true,
      };
      it('should return `false`', () => {
        expect(includeDependentInformation(formData)).to.be.false;
      });
    });

    context('when skip value is `false`', () => {
      const formData = {
        'view:householdEnabled': true,
        [DEPENDENT_VIEW_FIELDS.skip]: false,
      };
      it('should return `true`', () => {
        expect(includeDependentInformation(formData)).to.be.true;
      });
    });
  });

  context('when `collectMedicareInformation` executes', () => {
    context('when Veteran is enrolled in Medicare', () => {
      const formData = {
        'view:isEnrolledMedicarePartA': { isEnrolledMedicarePartA: true },
      };
      it('should return `true`', () => {
        expect(collectMedicareInformation(formData)).to.be.true;
      });
    });

    context('when Veteran is not enrolled in Medicare', () => {
      const formData = {
        'view:isEnrolledMedicarePartA': { isEnrolledMedicarePartA: false },
      };
      it('should return `false`', () => {
        expect(collectMedicareInformation(formData)).to.be.false;
      });
    });
  });

  context('when `includeInsuranceInformation` executes', () => {
    context('when skip value is `true`', () => {
      const formData = { [INSURANCE_VIEW_FIELDS.skip]: true };
      it('should return `false`', () => {
        expect(includeInsuranceInformation(formData)).to.be.false;
      });
    });

    context('when skip value is `false`', () => {
      const formData = { [INSURANCE_VIEW_FIELDS.skip]: false };
      it('should return `true`', () => {
        expect(includeInsuranceInformation(formData)).to.be.true;
      });
    });
  });

  context('when `includeGulfWarServiceDates` executes', () => {
    context(
      'when the `gulfWarService` value is true, `includeTeraInformation` evaluates to true, ' +
        "and the user's DOB is prior to 1976",
      () => {
        const formData = {
          gulfWarService: true,
          hasTeraResponse: true,
          veteranDateOfBirth: '1975-12-31',
        };
        it('returns `true`', () => {
          expect(includeGulfWarServiceDates(formData)).to.be.true;
        });
      },
    );

    context(
      'when the `gulfWarService` value is false, and/or `includeTeraInformation` evaluates ' +
        "to false, and/or the user's DOB is NOT prior to 1976",
      () => {
        const formData = {
          gulfWarService: true,
          hasTeraResponse: false,
          veteranDateOfBirth: '2004-10-25',
        };
        it('returns `false`', () => {
          expect(includeGulfWarServiceDates(formData)).to.be.false;
        });
      },
    );
  });

  context('when `includeAgentOrangeExposureDates` executes', () => {
    context(
      'when the `exposedToAgentOrange` value is true, `includeTeraInformation` evaluates to true, ' +
        "and the user's DOB is prior to 1966",
      () => {
        const formData = {
          exposedToAgentOrange: true,
          hasTeraResponse: true,
          veteranDateOfBirth: '1965-12-31',
        };
        it('returns `true`', () => {
          expect(includeAgentOrangeExposureDates(formData)).to.be.true;
        });
      },
    );

    context(
      'when the `exposedToAgentOrange` value is false, and/or `includeTeraInformation` evaluates ' +
        "to false, and/or the user's DOB is NOT prior to 1966",
      () => {
        const formData = {
          exposedToAgentOrange: true,
          hasTeraResponse: false,
          veteranDateOfBirth: '1967-01-01',
        };
        it('returns `false`', () => {
          expect(includeAgentOrangeExposureDates(formData)).to.be.false;
        });
      },
    );
  });

  context('when `includePostSept11ServiceDates` executes', () => {
    context(
      'when the `gulfWarService` value is true, `includeTeraInformation` evaluates to true, ' +
        "and the user's DOB is between 1976 and the present day - 15 years",
      () => {
        const formData = {
          gulfWarService: true,
          hasTeraResponse: true,
          veteranDateOfBirth: '1976-01-01',
        };
        it('returns `true`', () => {
          expect(includePostSept11ServiceDates(formData)).to.be.true;
        });

        // Use a fixed date well within the valid range (1976 to today - 15 years)
        // to avoid timing issues with dynamic date calculations
        const formDataWithDateInRange = {
          gulfWarService: true,
          hasTeraResponse: true,
          veteranDateOfBirth: '2000-06-15',
        };
        it('returns `true`', () => {
          expect(includePostSept11ServiceDates(formDataWithDateInRange)).to.be
            .true;
        });
      },
    );

    context(
      'when the `gulfWarService` value is false, and/or `includeTeraInformation` evaluates ' +
        "to false, and/or the user's DOB is not between 1976 and the present day - 15 years",
      () => {
        const formData = {
          gulfWarService: true,
          hasTeraResponse: false,
          veteranDateOfBirth: '1966-02-12',
        };
        it('returns `false`', () => {
          expect(includePostSept11ServiceDates(formData)).to.be.false;
        });
      },
    );
  });

  context('when `canVeteranProvideAgentOrangeResponse` executes', () => {
    context(
      "when `includeTeraInformation` evaluates to true and the user's DOB is " +
        'prior to 1966',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1965-12-31',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideAgentOrangeResponse(formData)).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's DOB " +
        'is NOT prior to 1966',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1974-10-18',
        };
        it('returns `false`', () => {
          expect(canVeteranProvideAgentOrangeResponse(formData)).to.be.false;
        });
      },
    );
  });

  context('when `canVeteranProvideRadiationCleanupResponse` executes', () => {
    context(
      "when `includeTeraInformation` evaluates to true and the user's DOB " +
        'is prior to 1966',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1965-12-31',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideRadiationCleanupResponse(formData)).to.be
            .true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's DOB " +
        'is NOT prior to 1966',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1996-11-18',
        };
        it('returns `false`', () => {
          expect(canVeteranProvideRadiationCleanupResponse(formData)).to.be
            .false;
        });
      },
    );
  });

  context('when `canVeteranProvideGulfWarResponse` executes', () => {
    context(
      "when `includeTeraInformation` evaluates to true and the user's DOB " +
        'is prior to 1976',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1975-12-31',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideGulfWarServiceResponse(formData)).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's DOB " +
        'is NOT prior to 1976',
      () => {
        const formData = {
          hasTeraResponse: false,
          veteranDateOfBirth: '2001-10-18',
        };
        it('returns `false`', () => {
          expect(canVeteranProvideGulfWarServiceResponse(formData)).to.be.false;
        });
      },
    );
  });

  context('when `canVeteranProvideCombatOperationsResponse` executes', () => {
    context(
      "when `includeTeraInformation` evaluates to true and the user's DOB " +
        'is exactly 15 years ago from the present day or prior',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1995-07-15',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideCombatOperationsResponse(formData)).to.be
            .true;
        });

        // Use a fixed date well within the valid range (before today - 15 years)
        // to avoid timing issues with dynamic date calculations
        const formDataWithDateInRange = {
          hasTeraResponse: true,
          veteranDateOfBirth: '2000-06-15',
        };
        it('returns `true`', () => {
          expect(
            canVeteranProvideCombatOperationsResponse(formDataWithDateInRange),
          ).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's " +
        'DOB is NOT exactly 15 years ago from the present day or prior',
      () => {
        // Use a fixed recent date that is clearly NOT before (today - 15 years)
        const formData = {
          hasTeraResponse: false,
          veteranDateOfBirth: '2020-01-01',
        };
        it('returns `false`', () => {
          expect(canVeteranProvideCombatOperationsResponse(formData)).to.be
            .false;
        });
      },
    );
  });

  context('when `canVeteranProvidePostSept11Response` executes', () => {
    context(
      "when `includeTeraInformation` evaluates to true and the user's DOB " +
        'is between 1976 and the present day - 15 years',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1976-01-01',
        };
        it('returns `true`', () => {
          expect(canVeteranProvidePostSept11ServiceResponse(formData)).to.be
            .true;
        });

        // Use a fixed date well within the valid range (1976 to today - 15 years)
        // to avoid timing issues with dynamic date calculations
        const formDataWithDateInRange = {
          hasTeraResponse: true,
          veteranDateOfBirth: '2000-06-15',
        };
        it('returns `true`', () => {
          expect(
            canVeteranProvidePostSept11ServiceResponse(formDataWithDateInRange),
          ).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's DOB " +
        'is NOT between 1976 and the present day - 15 years',
      () => {
        // Use a fixed recent date that is clearly NOT in the valid range
        const formData = {
          hasTeraResponse: false,
          veteranDateOfBirth: '2020-01-01',
        };
        it('returns `false`', () => {
          expect(canVeteranProvidePostSept11ServiceResponse(formData)).to.be
            .false;
        });
      },
    );
  });
});
