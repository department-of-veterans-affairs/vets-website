import { expect } from 'chai';
import { subYears } from 'date-fns';
import {
  includeSpousalInformation,
  includeHouseholdInformation,
  isMissingVeteranDob,
  isMissingVeteranGender,
  isSigiEnabled,
  hasDifferentHomeAddress,
  showFinancialStatusAlert,
  spouseDidNotCohabitateWithVeteran,
  spouseAddressDoesNotMatchVeterans,
  includeDependentInformation,
  includeInsuranceInformation,
  collectMedicareInformation,
  canVeteranProvideRadiationCleanupResponse,
  veteranBornBetween,
  canVeteranProvideGulfWarServiceResponse,
  canVeteranProvideCombatOperationsResponse,
  canVeteranProvideAgentOrangeResponse,
  includeGulfWarServiceDates,
  includeAgentOrangeExposureDates,
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

  context('when `isSigiEnabled` executes', () => {
    context('when value is `true`', () => {
      const formData = { 'view:isSigiEnabled': true };
      it('should return `true`', () => {
        expect(isSigiEnabled(formData)).to.be.true;
      });
    });

    context('when value is `false`', () => {
      const formData = { 'view:isSigiEnabled': false };
      it('should return `false`', () => {
        expect(isSigiEnabled(formData)).to.be.false;
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
        "and the user's DOB is between 1900 and the present day - 15 years",
      () => {
        const formData = {
          gulfWarService: true,
          hasTeraResponse: true,
          veteranDateOfBirth: '2009-07-16',
        };
        it('returns `true`', () => {
          expect(includeGulfWarServiceDates(formData)).to.be.true;
        });

        const formDataWithLatestPossibleDate = {
          gulfWarService: true,
          hasTeraResponse: true,
          veteranDateOfBirth: subYears(new Date(), 15),
        };
        it('returns `true`', () => {
          expect(includeGulfWarServiceDates(formDataWithLatestPossibleDate)).to
            .be.true;
        });
      },
    );

    context(
      'when the `gulfWarService` value is false, and/or `includeTeraInformation` evaluates ' +
        "to false, and/or the user's DOB is not between 1900 and the present day - 15 years",
      () => {
        const formData = {
          gulfWarService: true,
          hasTeraResponse: false,
          veteranDateOfBirth: '1899-10-25',
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
        "and the user's DOB is between 1900 and 1965",
      () => {
        const formData = {
          exposedToAgentOrange: true,
          hasTeraResponse: true,
          veteranDateOfBirth: '1963-05-21',
        };
        it('returns `true`', () => {
          expect(includeAgentOrangeExposureDates(formData)).to.be.true;
        });
      },
    );

    context(
      'when the `exposedToAgentOrange` value is false, and/or `includeTeraInformation` evaluates ' +
        "to false, and/or the user's DOB is not between 1900 and 1965",
      () => {
        const formData = {
          exposedToAgentOrange: true,
          hasTeraResponse: false,
          veteranDateOfBirth: '1966-02-12',
        };
        it('returns `false`', () => {
          expect(includeAgentOrangeExposureDates(formData)).to.be.false;
        });
      },
    );
  });

  context('when `veteranBornBetween` executes', () => {
    context(
      'when the `veteranDateOfBirth` value is not between the given date range',
      () => {
        const formData = {
          veteranDateOfBirth: '1957-11-18',
        };
        it('returns `false`', () => {
          expect(veteranBornBetween(formData, '1958-01-01', '1959-12-31')).to.be
            .false;
        });
      },
    );

    context(
      'when the `veteranDateOfBirth` value is between the given date range',
      () => {
        const formData = {
          veteranDateOfBirth: '1974-11-18',
        };
        it('returns `true`', () => {
          expect(veteranBornBetween(formData, '1968-01-01', '1974-11-18')).to.be
            .true;
        });
      },
    );
  });

  context('when `canVeteranProvideAgentOrangeResponse` executes', () => {
    context(
      "when `includeTeraInformation` evaluates to true and the user's DOB is " +
        'between 1900 and 1965',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1947-01-01',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideAgentOrangeResponse(formData)).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's DOB " +
        'is not between 1900 and 1965',
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
        'is between 1900 and 1965',
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
        'is not between 1900 and 1965',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1896-11-18',
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
        'is between 1900 and the present day - 15 years',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '2004-04-23',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideGulfWarServiceResponse(formData)).to.be.true;
        });

        const formDataWithLatestPossibleDate = {
          hasTeraResponse: true,
          veteranDateOfBirth: subYears(new Date(), 15),
        };
        it('returns `true`', () => {
          expect(
            canVeteranProvideGulfWarServiceResponse(
              formDataWithLatestPossibleDate,
            ),
          ).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's DOB " +
        'is not between 1900 and the present day - 15 years',
      () => {
        const formData = {
          hasTeraResponse: false,
          veteranDateOfBirth: '2023-10-18',
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
        'is between 1900 and the present day - 15 years',
      () => {
        const formData = {
          hasTeraResponse: true,
          veteranDateOfBirth: '1995-07-15',
        };
        it('returns `true`', () => {
          expect(canVeteranProvideCombatOperationsResponse(formData)).to.be
            .true;
        });

        const formDataWithLatestPossibleDate = {
          hasTeraResponse: true,
          veteranDateOfBirth: subYears(new Date(), 15),
        };
        it('returns `true`', () => {
          expect(
            canVeteranProvideCombatOperationsResponse(
              formDataWithLatestPossibleDate,
            ),
          ).to.be.true;
        });
      },
    );

    context(
      "when `includeTeraInformation` evaluates to false and/or the user's " +
        'DOB is not between 1900 and the present day - 15 years',
      () => {
        const formData = {
          hasTeraResponse: false,
          veteranDateOfBirth: '1895-10-18',
        };
        it('returns `false`', () => {
          expect(canVeteranProvideCombatOperationsResponse(formData)).to.be
            .false;
        });
      },
    );
  });
});
