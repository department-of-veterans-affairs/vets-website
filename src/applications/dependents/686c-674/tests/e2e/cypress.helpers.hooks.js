export const pageHooks = {
  introduction: ({ afterHook }) => {
    afterHook(() => {
      cy.wait('@mockVaFileNumber');
      cy.injectAxeThenAxeCheck();
      cy.clickStartForm();
    });
  },

  'current-marriage-information/date-of-marriage': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (data.currentMarriageInformation?.date) {
          cy.fillVaMemorableDate(
            'root_currentMarriageInformation_date',
            data.currentMarriageInformation.date,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'current-marriage-information/location-of-marriage': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (data.currentMarriageInformation?.outsideUsa) {
          cy.get(
            'va-checkbox[name="root_currentMarriageInformation_outsideUsa"]',
          )
            .shadow()
            .find('input[type="checkbox"]')
            .check({ force: true });
        }

        const location = data.currentMarriageInformation?.location;

        if (location?.city) {
          cy.fillVaTextInput(
            'root_currentMarriageInformation_location_city',
            location.city,
          );
        }

        // Fill state (if inside USA)
        if (location?.state) {
          cy.get(
            'select[name="root_currentMarriageInformation_location_state"]',
          ).select(location.state);
        }

        // Fill country (if outside USA)
        if (location?.country) {
          cy.get(
            'va-select[name="root_currentMarriageInformation_location_country"]',
          ).should('be.visible');
          cy.selectVaSelect(
            'root_currentMarriageInformation_location_country',
            location.country,
          );
        }

        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'current-marriage-information/spouse-address': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const address = data.doesLiveWithSpouse?.address;

        cy.fillAddressWebComponentPattern(
          'doesLiveWithSpouse_address',
          address,
        );

        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'current-spouse-marriage-history/:index/date-marriage-started': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const marriage = data.spouseMarriageHistory?.[0];
        if (marriage?.startDate) {
          cy.fillVaMemorableDate('root_startDate', marriage.startDate);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'current-spouse-marriage-history/:index/date-marriage-ended': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const marriage = data.spouseMarriageHistory?.[0];
        if (marriage?.endDate) {
          cy.fillVaMemorableDate('root_endDate', marriage.endDate);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'veteran-marriage-history/:index/date-marriage-started': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const marriage = data.veteranMarriageHistory?.[0];
        if (marriage?.startDate) {
          cy.fillVaMemorableDate('root_startDate', marriage.startDate);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'veteran-marriage-history/:index/date-marriage-ended': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const marriage = data.veteranMarriageHistory?.[0];
        if (marriage?.endDate) {
          cy.fillVaMemorableDate('root_endDate', marriage.endDate);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  '686-report-marriage-of-child/:index/date-child-married': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const child = data.childMarriage?.[0];
        if (child?.dateMarried) {
          cy.fillVaMemorableDate('root_dateMarried', child.dateMarried);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-child-stopped-attending-school/:index/date-child-left-school': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const child = data.childStoppedAttendingSchool?.[0];
        if (child?.dateChildLeftSchool) {
          cy.fillVaMemorableDate(
            'root_dateChildLeftSchool',
            child.dateChildLeftSchool,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  '686-stepchild-no-longer-part-of-household/:index/child-address': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const stepchild = data.stepChildren?.[0];
        const address = stepchild?.address;

        cy.fillAddressWebComponentPattern('address', address);

        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  '686-report-dependent-death/:index/date-of-death': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const death = data.deaths?.[0];
        if (death?.dependentDeathDate) {
          cy.fillVaMemorableDate(
            'root_dependentDeathDate',
            death.dependentDeathDate,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  '686-stepchild-no-longer-part-of-household/:index/date-child-left-household': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const stepchild = data.stepChildren?.[0];
        if (stepchild.dateStepchildLeftHousehold) {
          cy.fillVaMemorableDate(
            'root_dateStepchildLeftHousehold',
            stepchild.dateStepchildLeftHousehold,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  '686-report-add-child/:index/marriage-end-details': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const child = data.childrenToAdd?.[0];

        if (child?.marriageEndDate) {
          cy.fillVaMemorableDate('root_marriageEndDate', child.marriageEndDate);
        }

        if (child?.marriageEndReason) {
          cy.selectVaRadioOption(
            'root_marriageEndReason',
            child.marriageEndReason,
          );
        }

        // Fill if "Other" is selected
        if (
          child?.marriageEndReason === 'Other' &&
          child?.marriageEndDescription
        ) {
          cy.fillVaTextInput(
            'root_marriageEndDescription',
            child.marriageEndDescription,
          );
        }

        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'check-veteran-pension': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (data?.veteranInformation?.isInReceiptOfPension === -1) {
          cy.selectYesNoVaRadioOption('view:checkVeteranPension', true);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'current-spouse-marriage-history/:index/location-where-marriage-started': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        if (data.currentMarriageInformation?.outsideUsa) {
          cy.get('va-checkbox[name="root_startLocation_outsideUsa"]')
            .shadow()
            .find('input[type="checkbox"]')
            .check({ force: true });
        }

        const location = data.currentMarriageInformation?.location;

        if (location?.city) {
          cy.fillVaTextInput('root_startLocation_location_city', location.city);
        }

        if (location?.state) {
          cy.selectVaSelect(
            'root_startLocation_location_state',
            location.state,
          );
        }

        if (location?.country) {
          cy.get(
            'va-select[name="root_startLocation_location_country"]',
          ).should('be.visible');
          cy.selectVaSelect(
            'root_startLocation_location_country',
            location.country,
          );
        }

        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/student-marriage-date': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const student = data.studentInformation?.[0];
        if (student?.marriageDate) {
          cy.fillVaMemorableDate('root_marriageDate', student.marriageDate);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/student-relationship': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const student = data.studentInformation?.[0];

        if (student?.relationshipToStudent) {
          cy.selectVaRadioOption(
            'root_relationshipToStudent',
            student.relationshipToStudent,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/student-education-benefits/start-date': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const student = data.studentInformation?.[0];
        if (student?.benefitPaymentDate) {
          cy.fillVaMemorableDate(
            'root_benefitPaymentDate',
            student.benefitPaymentDate,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/term-dates': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const termDates =
          data.studentInformation?.[0]?.schoolInformation?.currentTermDates;
        if (termDates?.officialSchoolStartDate) {
          cy.fillVaMemorableDate(
            'root_schoolInformation_currentTermDates_officialSchoolStartDate',
            termDates.officialSchoolStartDate,
          );
        }
        if (termDates?.expectedStudentStartDate) {
          cy.fillVaMemorableDate(
            'root_schoolInformation_currentTermDates_expectedStudentStartDate',
            termDates.expectedStudentStartDate,
          );
        }
        if (termDates?.expectedGraduationDate) {
          cy.fillVaMemorableDate(
            'root_schoolInformation_currentTermDates_expectedGraduationDate',
            termDates.expectedGraduationDate,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/previous-term-dates': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const lastTerm =
          data.studentInformation?.[0]?.schoolInformation
            ?.lastTermSchoolInformation;

        if (lastTerm?.termBegin) {
          cy.fillVaMemorableDate(
            'root_schoolInformation_lastTermSchoolInformation_termBegin',
            lastTerm.termBegin,
          );
        }

        if (lastTerm?.dateTermEnded) {
          cy.fillVaMemorableDate(
            'root_schoolInformation_lastTermSchoolInformation_dateTermEnded',
            lastTerm.dateTermEnded,
          );
        }

        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/date-student-stopped-attending': ({
    afterHook,
  }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const date =
          data.studentInformation?.[0]?.schoolInformation?.dateFullTimeEnded;

        if (date) {
          cy.fillVaMemorableDate(
            'root_schoolInformation_dateFullTimeEnded',
            date,
          );
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'report-674/add-students/:index/additional-remarks': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(data => {
        const student = data.studentInformation?.[0];
        if (student?.remarks) {
          cy.fillVaTextarea('root_remarks', student.remarks);
        }
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },

  'review-and-submit': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then((/* data */) => {
        cy.fillVaStatementOfTruth({
          fullName: 'John Doe', // data.statementOfTruthSignature,
          checked: true,
        });
        cy.injectAxeThenAxeCheck();
        cy.clickFormContinue();
      });
    });
  },
};
