import { expect } from 'chai';
import { shallow } from 'enzyme';
import { maxYear, minYear } from 'platform/forms-system/src/js/helpers';
import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';

import {
  CHAR_LIMITS,
  PTSD_MATCHES,
  SAVED_SEPARATION_DATE,
} from '../../constants';
import {
  activeServicePeriods,
  baseDoNew4142Logic,
  capitalizeEachWord,
  fieldsHaveInput,
  formatFullName,
  hasGuardOrReservePeriod,
  hasHospitalCare,
  hasNewPtsdDisability,
  hasOtherEvidence,
  increaseOnly,
  isAnswering781aQuestions,
  isAnswering781Questions,
  isBDD,
  isDisabilityPtsd,
  isExpired,
  isNotExpired,
  isUndefined,
  isUploading781aForm,
  isUploading781aSupportingDocuments,
  isUploading781Form,
  isValidFullDate,
  isValidServicePeriod,
  isWithinRange,
  makeConditionsSchema,
  needsToAnswerUnemployability,
  needsToEnter781,
  needsToEnter781a,
  needsToEnterUnemployability,
  newConditionsOnly,
  ReservesGuardDescription,
  servedAfter911,
  show526Wizard,
  showPtsdCombat,
  showPtsdNonCombat,
  showSeparationLocation,
  showToxicExposureDestructionModal,
  skip781,
  truncateDescriptions,
  validateConditions,
  viewifyFields,
} from '../../utils';
import {
  daysFromToday,
  formatDateRange,
  formatDate,
  parseDate,
  formatMonthYearDate,
  DATE_TEMPLATE,
  DATE_FORMAT,
  DATE_FORMAT_SHORT,
} from '../../utils/dates/formatting';
import { testBranches } from '../../utils/serviceBranches';

describe('526 helpers', () => {
  describe('hasGuardOrReservePeriod', () => {
    it('should return true when reserve period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air Force Reserves',
            dateRange: {
              to: '2011-05-06',
              from: '2015-05-06',
            },
          },
        ],
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.true;
    });

    it('should return true when national guard period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air National Guard',
            dateRange: {
              to: '2011-05-06',
              from: '2015-05-06',
            },
          },
        ],
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.true;
    });

    it('should return false when no reserves or guard period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air Force',
            dateRange: {
              from: '2011-05-06',
              to: '2015-05-06',
            },
          },
        ],
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.false;
    });

    it('should return false when no service history present', () => {
      const formData = {};

      expect(hasGuardOrReservePeriod(formData)).to.be.false;
    });
  });

  describe('reservesGuardDescription', () => {
    it('should pick the most recent service branch', () => {
      const form = {
        formData: {
          servicePeriods: [
            {
              serviceBranch: 'Air Force',
              dateRange: {
                from: '2010-05-08',
                to: '2018-10-08',
              },
            },
            {
              serviceBranch: 'Air Force Reserves',
              dateRange: {
                from: '2000-05-08',
                to: '2011-10-08',
              },
            },
            {
              serviceBranch: 'Marine Corps Reserves',
              dateRange: {
                from: '2000-05-08',
                to: '2018-10-08',
              },
            },
          ],
        },
      };

      const renderedText = shallow(ReservesGuardDescription(form));
      expect(renderedText.render().text()).to.contain('Marine Corps Reserves');
      renderedText.unmount();
    });

    it('should return null when no service periods present', () => {
      const form = {
        formData: {},
      };

      expect(ReservesGuardDescription(form)).to.equal(null);
    });
  });

  describe('capitalizeEachWord', () => {
    it('should return string with each word capitalized when name supplied', () => {
      [
        ['some disability - some detail', 'Some Disability - Some Detail'],
        ['some disability (some detail)', 'Some Disability (Some Detail)'],
        [
          'some disability with hyphenated-words',
          'Some Disability With Hyphenated-Words',
        ],
        [
          "some disability with possessive's stuff",
          "Some Disability With Possessive's Stuff",
        ],
        [
          "some disability with possessive's-hyphen",
          "Some Disability With Possessive's-Hyphen",
        ],
        ['some "quote" disability', 'Some "Quote" Disability'],
      ].forEach(pair => expect(capitalizeEachWord(pair[0])).to.equal(pair[1]));
    });
    it('should return null with undefined name', () => {
      expect(capitalizeEachWord()).to.equal(null);
    });
    it('should return null when input is empty string', () => {
      expect(capitalizeEachWord('')).to.equal(null);
    });
    it('should return null when name is not a string', () => {
      expect(capitalizeEachWord(249481)).to.equal(null);
    });
  });

  describe('hasotherEvidence', () => {
    it('should return false if additional evidence type is not selected', () => {
      const formData = {
        'view:selectableEvidenceTypes': {
          // 'view:hasOtherEvidence': no data
        },
      };
      expect(hasOtherEvidence(formData)).to.equal(false);
    });

    it('should return true if additional evidence type is selected', () => {
      const formData = {
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      };
      expect(hasOtherEvidence(formData)).to.equal(true);
    });
  });

  describe('fieldsHaveInput', () => {
    it('should return false when empty array given', () => {
      expect(fieldsHaveInput({ test: '123' }, [])).to.be.false;
    });

    it('should return false when empty formData given', () => {
      expect(fieldsHaveInput({}, ['someField'])).to.be.false;
    });

    it('should return false property does not exist', () => {
      expect(fieldsHaveInput({ test: '123' }, ['someField'])).to.be.false;
    });

    it('should return false when property is empty', () => {
      expect(fieldsHaveInput({ test: null }, ['test'])).to.be.false;
      expect(fieldsHaveInput({ test: '' }, ['test'])).to.be.false;
    });

    it('should return true when property is not empty', () => {
      expect(fieldsHaveInput({ test: 'hi!' }, ['test'])).to.be.true;
    });

    it('should return true when some properties empty and some not', () => {
      const testPaths = ['test0', 'test2', 'test4'];
      expect(fieldsHaveInput({ test2: 'hi!' }, testPaths)).to.be.true;
    });
  });

  describe('servedAfter911', () => {
    it('should return false if no serviceInformation', () => {
      expect(servedAfter911({})).to.be.false;
    });

    it('should return false if no servicePeriods', () => {
      expect(servedAfter911({ serviceInformation: {} })).to.be.false;
    });

    it('should return false if no dateRange', () => {
      const formData = {
        serviceInformation: {
          servicePeriods: [{}],
        },
      };
      expect(servedAfter911(formData)).to.be.false;
    });

    it('should return false if no `to` date', () => {
      const formData = {
        serviceInformation: {
          servicePeriods: [
            {
              dateRange: {},
            },
          ],
        },
      };
      expect(servedAfter911(formData)).to.be.false;
    });

    it('should return false if `to` date is on or before 9/11/01', () => {
      const formData = {
        serviceInformation: {
          servicePeriods: [
            {
              dateRange: {
                to: '2001-09-11',
              },
            },
          ],
        },
      };
      expect(servedAfter911(formData)).to.be.false;
    });

    it('should return true if `to` date is after 9/11/01', () => {
      const formData = {
        serviceInformation: {
          servicePeriods: [
            {
              dateRange: {
                to: '2001-09-12',
              },
            },
          ],
        },
      };
      expect(servedAfter911(formData)).to.be.true;
    });

    it('should return true if any `to` date is after 9/11/01', () => {
      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { to: '1980-09-11' } },
            { dateRange: { to: '1999-09-12' } },
            { dateRange: { to: '2014-09-12' } },
            { dateRange: { to: '1975-09-12' } },
          ],
        },
      };
      expect(servedAfter911(formData)).to.be.true;
    });
  });

  describe('needsToEnter781', () => {
    it('should return true if user has selected Combat PTSD types', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:combatPtsdType': true,
        },
      };
      expect(needsToEnter781(formData)).to.be.true;
    });

    it('should return true if user has selected Non-combat PTSD types', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:nonCombatPtsdType': true,
        },
      };
      expect(needsToEnter781(formData)).to.be.true;
    });

    it('should return false if user has not selected Combat or Non-Combat PTSD types', () => {
      const formData = {};
      expect(needsToEnter781(formData)).to.be.false;
    });
    it('should return false if skip questions are set to true', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:combatPtsdType': true,
        },
      };
      expect(
        needsToEnter781({
          ...formData,
          skip781ForCombatReason: true,
        }),
      ).to.be.false;
      expect(
        needsToEnter781({
          ...formData,
          skip781ForNonCombatReason: true,
        }),
      ).to.be.false;
    });
    it('should return false if in BDD flow', () => {
      expect(
        needsToEnter781({
          'view:isBddData': true,
          serviceInformation: {
            servicePeriods: [
              {
                dateRange: {
                  to: daysFromToday(90),
                },
              },
            ],
          },
          'view:claimType': { 'view:claimingnew': true },
          newDisabilities: [{ condition: 'PTSD' }],
        }),
      ).to.be.false;
    });
  });

  describe('needsToEnter781a', () => {
    it('should return true if user has selected MST PTSD types', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:mstPtsdType': true,
        },
      };
      expect(needsToEnter781a(formData)).to.be.true;
    });

    it('should return true if user has selected Assault PTSD types', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:assaultPtsdType': true,
        },
      };
      expect(needsToEnter781a(formData)).to.be.true;
    });

    it('should return false if user has not selected Assault or MST PTSD types', () => {
      const formData = {};
      expect(needsToEnter781a(formData)).to.be.false;
    });

    describe('PTSD flow migration', () => {
      const ptsdFormData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:mstPtsdType': true,
        },
      };

      describe('when the modern 0781 flow is enabled', () => {
        const ptsdFormDataModernFlowEnabled = {
          syncModern0781Flow: true,
          ...ptsdFormData,
        };

        it('should return false so the legacy PTSD flow is hidden', () => {
          expect(needsToEnter781a(ptsdFormDataModernFlowEnabled)).to.be.false;
        });
      });

      describe('when the modern 0781 flow is disabled', () => {
        const ptsdFormDataModernFlowEnabled = {
          syncModern0781Flow: false,
          ...ptsdFormData,
        };

        it('should return true so the legacy PTSD flow is visible', () => {
          expect(needsToEnter781a(ptsdFormDataModernFlowEnabled)).to.be.true;
        });
      });
    });
  });

  describe('isUploading781Form', () => {
    it('should return true if user has chosen to upload 781', () => {
      const formData = {
        'view:upload781Choice': 'upload',
      };
      expect(isUploading781Form(formData)).to.be.true;
    });

    it('should return false if user has not chosen to upload 781', () => {
      const formData = {};
      expect(isUploading781Form(formData)).to.be.false;
    });
  });

  describe('isUploading781aForm', () => {
    it('should return true if user has chosen to upload 781a', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:upload781aChoice': 'upload',
      };
      expect(isUploading781aForm(formData)).to.be.true;
    });

    it('should return false if user has not chosen to upload 781a', () => {
      const formData = {};
      expect(isUploading781aForm(formData)).to.be.false;
    });
  });

  describe('viewifyFields', () => {
    const formData = {
      prop1: {
        'view:nestedProp': {
          anotherNestedProp: 'value',
          'view:doubleView': 'whoa, man--it’s like inception',
        },
        siblingProp: 'another value',
      },
      'view:prop2': 'this is a string',
    };

    it('should prefix all the property names with "view:" if needed', () => {
      const viewifiedFormData = {
        'view:prop1': {
          'view:nestedProp': {
            'view:anotherNestedProp': 'value',
            'view:doubleView': 'whoa, man--it’s like inception',
          },
          'view:siblingProp': 'another value',
        },
        'view:prop2': 'this is a string',
      };
      expect(viewifyFields(formData)).to.eql(viewifiedFormData);
    });
  });

  describe('activeServicePeriods', () => {
    it('should return an array of service periods with no end `to` date or a `to` date in the future', () => {
      const inactivePeriod = { dateRange: { to: '1999-03-03' } };
      const futurePeriod = {
        dateRange: {
          to: daysFromToday(1),
        },
      };
      const noToDate = { dateRange: { to: undefined } };
      const formData = {
        serviceInformation: {
          servicePeriods: [inactivePeriod, futurePeriod, noToDate],
        },
      };

      expect(activeServicePeriods(formData)).to.eql([futurePeriod, noToDate]);
    });
  });

  describe('isUndefined', () => {
    it('should detect undefined (falsy) values', () => {
      let undef;
      expect(isUndefined()).to.be.true;
      expect(isUndefined(false)).to.be.true;
      expect(isUndefined('')).to.be.true;
      expect(isUndefined(0)).to.be.true;
      expect(isUndefined(undef)).to.be.true;
      expect(isUndefined('0')).to.be.false;
      expect(isUndefined(' ')).to.be.false;
      expect(isUndefined(1)).to.be.false;
      expect(isUndefined(true)).to.be.false;
    });
  });
});

describe('isAnswering781Questions', () => {
  it('should return true if user is answering first set of 781 incident questions', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
    };
    expect(isAnswering781Questions(0)(formData)).to.be.true;
  });
  it('should return true if user has chosen to answer questions for a 781 PTSD incident', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
      'view:enterAdditionalEvents0': true,
    };
    expect(isAnswering781Questions(1)(formData)).to.be.true;
  });
  it('should return false if user has chosen not to enter another incident', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
      'view:enterAdditionalEvents0': false,
    };
    expect(isAnswering781Questions(1)(formData)).to.be.false;
  });

  describe('PTSD flow migration', () => {
    const ptsdFormData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
    };

    describe('when the modern 0781 flow is enabled', () => {
      const ptsdFormDataModernFlowEnabled = {
        syncModern0781Flow: true,
        ...ptsdFormData,
      };

      it('should return false so the legacy 0781 pages are hidden', () => {
        expect(isAnswering781Questions(0)(ptsdFormDataModernFlowEnabled)).to.be
          .false;
      });
    });

    describe('when the modern 0781 flow is disabled', () => {
      const ptsdFormDataModernFlowDisabled = {
        syncModern0781Flow: false,
        ...ptsdFormData,
      };

      it('should return true so the legacy 0781 flow is visible', () => {
        expect(isAnswering781Questions(0)(ptsdFormDataModernFlowDisabled)).to.be
          .true;
      });
    });
  });
});

describe('isAnswering781Questions', () => {
  it('should return true if user is answering first set of 781 incident questions', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
    };
    expect(isAnswering781Questions(0)(formData)).to.be.true;
  });
  it('should return true if user has chosen to answer questions for a 781 PTSD incident', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
      'view:enterAdditionalEvents0': true,
    };
    expect(isAnswering781Questions(1)(formData)).to.be.true;
  });
  it('should return false if user has chosen not to enter another incident', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
      'view:enterAdditionalEvents0': false,
    };
    expect(isAnswering781Questions(1)(formData)).to.be.false;
  });
});

describe('isAnswering781aQuestions', () => {
  it('should return true if user is answering first set of 781a incident questions', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
      'view:upload781aChoice': 'answerQuestions',
    };
    expect(isAnswering781aQuestions(0)(formData)).to.be.true;
  });
  it('should return true if user has chosen to answer questions for a 781a PTSD incident', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
      'view:upload781aChoice': 'answerQuestions',
      'view:enterAdditionalSecondaryEvents0': true,
    };
    expect(isAnswering781aQuestions(1)(formData)).to.be.true;
  });
  it('should return false if user has chosen not to enter another incident', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
      'view:upload781aChoice': 'answerQuestions',
      'view:enterAdditionalSecondaryEvents0': false,
    };
    expect(isAnswering781aQuestions(1)(formData)).to.be.false;
  });

  describe('isUploading781aSupportingDocuments', () => {
    it('should return true when a user selects yes to upload sources', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
        'view:selectablePtsdTypes': {
          'view:assaultPtsdType': true,
        },
        'view:upload781aChoice': 'answerQuestions',
        secondaryIncident0: {
          'view:uploadSources': true,
        },
      };
      expect(isUploading781aSupportingDocuments(0)(formData)).to.be.true;
    });
  });

  describe('PTSD flow migration', () => {
    const ptsdFormData = {
      newDisabilities: [
        {
          condition: 'Ptsd personal trauma',
        },
      ],
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
      'view:upload781aChoice': 'answerQuestions',
      secondaryIncident0: {
        'view:uploadSources': true,
      },
    };

    describe('when the modern 0781 flow is enabled', () => {
      const ptsdFormDataModernFlowEnabled = {
        syncModern0781Flow: true,
        ...ptsdFormData,
      };

      it('should return false so the legacy 0781a pages are hidden', () => {
        expect(isAnswering781aQuestions(0)(ptsdFormDataModernFlowEnabled)).to.be
          .false;
      });
    });

    describe('when the modern 0781 flow is disabled', () => {
      const ptsdFormDataModernFlowDisabled = {
        syncModern0781Flow: false,
        ...ptsdFormData,
      };

      it('should return true so the legacy 0781a flow is visible', () => {
        expect(isAnswering781aQuestions(0)(ptsdFormDataModernFlowDisabled)).to
          .true;
      });
    });
  });

  describe('needsToEnterUnemployability', () => {
    it('should return true if user selects yes', () => {
      const formData = {
        'view:unemployable': true,
      };
      expect(needsToEnterUnemployability(formData)).to.be.true;
    });
    it('should return false if user does not select anything', () => {
      const formData = {};
      expect(needsToEnterUnemployability(formData)).to.be.false;
    });
    it('should return false if user selects no', () => {
      const formData = {
        'view:unemployable': false,
      };
      expect(needsToEnterUnemployability(formData)).to.be.false;
    });
  });

  describe('needsToAnswerUnemployability', () => {
    it('should return true if user selects to answer unemployability questions', () => {
      const formData = {
        'view:unemployable': true,
        'view:unemployabilityUploadChoice': 'answerQuestions',
      };
      expect(needsToAnswerUnemployability(formData)).to.be.true;
    });
    it('should return false if user selects to upload an 8940 form', () => {
      const formData = {
        'view:unemployable': true,
        'view:unemployabilityUploadChoice': 'upload',
      };
      expect(needsToAnswerUnemployability(formData)).to.be.false;
    });
  });

  describe('needsToAnswerHospitalCare', () => {
    it('should be default of false', () => {
      const formData = {};
      expect(hasHospitalCare(formData)).to.be.false;
    });
    it('should be true', () => {
      const formData = {
        'view:medicalCareType': {
          'view:hospialized': true,
        },
      };
      expect(hasHospitalCare(formData)).to.be.false;
    });
  });
});

describe('all claims utils - isWithinRange', () => {
  const dateRange = { from: '1990-02-03', to: '1992-03-03' };
  it('should return true for a date that is within the date range specified', () => {
    expect(isWithinRange('1991-01-01', dateRange)).to.be.true;
  });

  it('should return true for a date range that is completely within the date range specified', () => {
    expect(isWithinRange({ from: '1991-01-01', to: '1992-01-01' }, dateRange))
      .to.be.true;
  });

  it('should return false for a date that is before the date range specified', () => {
    expect(isWithinRange('1989-01-01', dateRange)).to.be.false;
  });

  it('should return false for a date that is after the date range specified', () => {
    expect(isWithinRange('1999-01-01', dateRange)).to.be.false;
  });
  it('should return false for a date range that starts before the date range specified', () => {
    expect(isWithinRange({ from: '1990-01-01', to: '1992-01-01' }, dateRange))
      .to.be.false;
  });
  it('should return false for a date range that ends after the date range specified', () => {
    expect(isWithinRange({ from: '1991-01-01', to: '1993-01-01' }, dateRange))
      .to.be.false;
  });
});

describe('526 v2 depends functions', () => {
  const increaseOnlyData = {
    'view:claimType': {
      'view:claimingIncrease': true,
      'view:claimingNew': false,
    },
    ratedDisabilities: [{}],
  };
  const newOnlyData = {
    'view:claimType': {
      'view:claimingIncrease': false,
      'view:claimingNew': true,
    },
  };
  const increaseAndNewData = {
    'view:claimType': {
      'view:claimingIncrease': true,
      'view:claimingNew': true,
    },
    ratedDisabilities: [{}],
  };
  // Shouldn't be possible, but worth testing anyhow
  const noneSelected = {
    'view:claimType': {
      'view:claimingIncrease': false,
      'view:claimingNew': false,
    },
  };
  const isBDDTrueData = {
    'view:isBddData': true,
    serviceInformation: {
      servicePeriods: [
        {
          dateRange: {
            to: daysFromToday(0),
          },
        },
        {
          dateRange: {
            to: daysFromToday(90),
          },
        },
      ],
    },
  };
  const isBDDLessThan90Data = {
    'view:isBddData': true,
    serviceInformation: {
      servicePeriods: [
        {
          dateRange: {
            to: daysFromToday(0),
          },
        },
        {
          dateRange: {
            to: daysFromToday(89),
          },
        },
      ],
    },
  };

  const empty = {
    ratedDisabilities: [{}, {}],
    'view:claimType': {},
  };

  describe('newOnly', () => {
    it('should return true if only new conditions are claimed', () => {
      expect(newConditionsOnly(newOnlyData)).to.be.true;
    });
    it('should return false if already-rated conditions are claimed', () => {
      expect(newConditionsOnly(increaseOnlyData)).to.be.false;
      expect(newConditionsOnly(increaseAndNewData)).to.be.false;
    });
    it('should return false if no claim type is selected', () => {
      expect(newConditionsOnly(noneSelected)).to.be.false;
      expect(newConditionsOnly(empty)).to.be.false;
    });
  });
  describe('increaseOnly', () => {
    it('should return true if only alread-rated conditions are claimed', () => {
      expect(increaseOnly(increaseOnlyData)).to.be.true;
    });
    it('should return false if new conditions are claimed', () => {
      expect(increaseOnly(newOnlyData)).to.be.false;
      expect(increaseOnly(increaseAndNewData)).to.be.false;
    });
    it('should return false if no claim type is selected', () => {
      expect(increaseOnly(noneSelected)).to.be.false;
      expect(increaseOnly(empty)).to.be.false;
    });
  });

  describe('format date & date range', () => {
    describe('formatDate', () => {
      it('should format dates with full month names', () => {
        expect(formatDate('2020-01-31')).to.equal('January 31, 2020');
        expect(formatDate('2020-04-05')).to.equal('April 5, 2020');
        expect(formatDate('2020-05-05')).to.equal('May 5, 2020');
        expect(formatDate('2020-06-15')).to.equal('June 15, 2020');
        expect(formatDate('2020-07-25')).to.equal('July 25, 2020');
        expect(formatDate('2020-08-05')).to.equal('August 5, 2020');
        expect(formatDate('2020-12-05')).to.equal('December 5, 2020');
      });
      it('should return valid dates with custom format', () => {
        expect(formatDate('2020-01-31', DATE_TEMPLATE)).to.equal('2020-01-31');
        expect(formatDate('2020-05-05', DATE_FORMAT)).to.equal('May 5, 2020');
        expect(formatDate('2020-12-05', DATE_FORMAT_SHORT)).to.equal(
          '12/05/2020',
        );
      });
      it('should return "Unknown" for invalid dates', () => {
        expect(formatDate(true)).to.equal('Unknown');
        expect(formatDate(null)).to.equal('Unknown');
        expect(formatDate(undefined)).to.equal('Unknown');
        expect(formatDate('')).to.equal('Unknown');
        expect(formatDate('foobar')).to.equal('Unknown');
        expect(formatDate('2020-02-31')).to.equal('Unknown');
      });
      it('should return "Unknown" for partial dates', () => {
        expect(formatDate('2020-01-XX')).to.equal('Unknown');
        expect(formatDate('2020-XX-15')).to.equal('Unknown');
        // because moment.js uses 2001 when it can't parse the year
        expect(formatDate('XXXX-01-15')).to.equal('January 15, 2001');
      });
    });
    describe('formatDateRange', () => {
      it('should format dates ranges', () => {
        expect(
          formatDateRange({ from: '2020-01-31', to: '2020-02-14' }),
        ).to.equal('January 31, 2020 to February 14, 2020');
        expect(
          formatDateRange({ from: '2020-04-05', to: '2020-05-05' }),
        ).to.equal('April 5, 2020 to May 5, 2020');
        expect(
          formatDateRange({ from: '2020-06-15', to: '2020-12-31' }),
        ).to.equal('June 15, 2020 to December 31, 2020');
      });
      it('should return a valid range with custom format', () => {
        expect(
          formatDateRange(
            { from: '2020-01-31', to: '2020-02-14' },
            DATE_TEMPLATE,
          ),
        ).to.equal('2020-01-31 to 2020-02-14');
      });
      it('should return "Unknown" for the omitted or invalid portion of a range', () => {
        expect(formatDateRange({ from: '2020-01-31' })).to.equal(
          'January 31, 2020 to Unknown',
        );
        expect(formatDateRange({ from: '2020-04-05' })).to.equal(
          'April 5, 2020 to Unknown',
        );
        expect(formatDateRange({ to: '2020-02-14' })).to.equal(
          'Unknown to February 14, 2020',
        );
        expect(formatDateRange({ to: '2020-05-05' })).to.equal(
          'Unknown to May 5, 2020',
        );
        expect(
          formatDateRange({ from: 'invalid-date', to: '2020-02-14' }),
        ).to.equal('Unknown to February 14, 2020');
        expect(
          formatDateRange({ from: '2020-01-31', to: 'invalid-date' }),
        ).to.equal('January 31, 2020 to Unknown');
        expect(
          formatDateRange({ from: 'invalid-date', to: 'invalid-date' }),
        ).to.equal('Unknown to Unknown');
      });
      it('should return "Unknown" for entirely empty/invald ranges', () => {
        expect(formatDateRange({})).to.equal('Unknown');
        expect(formatDateRange(null)).to.equal('Unknown');
        expect(formatDateRange(undefined)).to.equal('Unknown');
      });
    });
  });

  describe('isBDD', () => {
    afterEach(() => {
      window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    });

    it('should return true if the most recent service period has a separation date 90 to 180 days from today', () => {
      expect(isBDD(isBDDTrueData)).to.be.true;
    });
    it('should return false if the most recent service period has a separation before 90 days from today', () => {
      expect(isBDD(isBDDLessThan90Data)).to.be.false;
    });
    it('should return false if no service period is provided with a separation date', () => {
      expect(isBDD(null)).to.be.false;
    });
    it('should return false if no service period is provided with a separation date', () => {
      expect(isBDD({ 'view:isBddData': true })).to.be.false;
    });
    it('should return true if a valid date is added to session storage from the wizard', () => {
      window.sessionStorage.setItem(SAVED_SEPARATION_DATE, daysFromToday(90));
      expect(isBDD(null)).to.be.true;
    });
    it('should return true if a valid date is added to session storage from the wizard even if active duty flag is false', () => {
      window.sessionStorage.setItem(SAVED_SEPARATION_DATE, daysFromToday(90));
      expect(isBDD({ 'view:isBddData': true })).to.be.true;
    });
    it('should return false for invalid dates in session storage from the wizard', () => {
      window.sessionStorage.setItem(SAVED_SEPARATION_DATE, daysFromToday(200));
      expect(isBDD(null)).to.be.false;
    });
    it('should return false for invalid dates in session storage from the wizard even if active duty flag is true', () => {
      window.sessionStorage.setItem(SAVED_SEPARATION_DATE, daysFromToday(200));
      expect(isBDD({ 'view:isBddData': true })).to.be.false;
    });
    it('should ignore in range service periods if not on active duty', () => {
      expect(isBDD({ ...isBDDTrueData, 'view:isBddData': false })).to.be.false;
    });
  });

  describe('showWizard', () => {
    it('should get wizard feature flag value of true', () => {
      expect(show526Wizard({ featureToggles: { show526Wizard: true } })).to.be
        .true;
    });
    it('should get wizard feature flag value of false', () => {
      expect(show526Wizard({ featureToggles: { show526Wizard: false } })).to.be
        .false;
    });
  });

  describe('isDisabilityPTSD', () => {
    it('should return true for all variations in PTSD_MATCHES', () => {
      PTSD_MATCHES.forEach(ptsdString => {
        expect(isDisabilityPtsd(ptsdString)).to.be.true;
      });
    });
    it('should return false for disabilities unrealted to PTSD', () => {
      expect(isDisabilityPtsd('uncontrollable transforming into the Hulk')).to
        .be.false;
    });
  });

  describe('isNotExpired', () => {
    it('should return true for current or future dates', () => {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);

      expect(isNotExpired(nextYear.toISOString().split('T')[0])).to.be.true;
    });
    it('should return false for past dates', () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      expect(isNotExpired(lastMonth.toISOString().split('T')[0])).to.be.false;
    });
    it('should return false for empty/undefined dates', () => {
      expect(isNotExpired()).to.be.false;
      expect(isNotExpired('')).to.be.false;
      expect(isNotExpired(null)).to.be.false;
      expect(isNotExpired(undefined)).to.be.false;
    });
    it('should handle invalid date values', () => {
      expect(isNotExpired('invalid-date')).to.be.false;
      expect(isNotExpired('2025-02-30')).to.be.false;
      expect(isNotExpired('XXXX-01-01')).to.be.false;
    });
  });

  describe('isValidFullDate', () => {
    it('should return true when a date is valid', () => {
      expect(isValidFullDate('2021-01-01')).to.be.true;
      expect(isValidFullDate(`${minYear}-01-01`)).to.be.true;
      expect(isValidFullDate(`${maxYear}-01-01`)).to.be.true;
    });
    it('should return false when a date is invalid', () => {
      expect(isValidFullDate()).to.be.false;
      expect(isValidFullDate('')).to.be.false;
      expect(isValidFullDate('2021')).to.be.false;
      expect(isValidFullDate('2021-01')).to.be.false;
      expect(isValidFullDate('01-01')).to.be.false;
      expect(isValidFullDate('XXXX-01-01')).to.be.false;
      expect(isValidFullDate('2021-XX-01')).to.be.false;
      expect(isValidFullDate('2021-01-XX')).to.be.false;
      expect(isValidFullDate('2021-02-31')).to.be.false;
      expect(isValidFullDate(`${minYear - 1}-01-01`)).to.be.false;
      expect(isValidFullDate(`${maxYear + 1}-01-01`)).to.be.false;
      expect(isValidFullDate(new Date())).to.be.false;
    });
  });

  describe('isValidServicePeriod', () => {
    const check = (serviceBranch, from, to) =>
      isValidServicePeriod({ serviceBranch, dateRange: { from, to } });
    it('should return true when a service period data is valid', () => {
      testBranches();
      expect(check('Army', '2020-01-31', '2020-02-14')).to.be.true;
      expect(check('Army Reserves', '2020-01-31', '2020-02-14')).to.be.true;
      expect(check('Army', `${minYear}-01-31`, `${maxYear}-02-14`)).to.be.true;
    });
    it('should return false when a service period data is invalid', () => {
      testBranches();
      expect(check('civilian', '2020-01-31', '2020-02-14')).to.be.false;
      expect(check('Army', 'XXXX-01-31', '2020-02-14')).to.be.false;
      expect(check('Army', '2020-XX-31', '2020-02-14')).to.be.false;
      expect(check('Army', '2020-01-XX', '2020-02-14')).to.be.false;
      expect(check('Army', '2020-01-31', 'XXXX-02-14')).to.be.false;
      expect(check('Army', '2020-01-31', '2020-XX-14')).to.be.false;
      expect(check('Army', '2020-01-31', '2020-02-XX')).to.be.false;
      expect(check('Army', '2020-02-14', '2020-01-31')).to.be.false;
    });
  });

  describe('showSeparationLocation', () => {
    const getDays = days => daysFromToday(days);
    const getFormData = (activeDate, reserveDate) => ({
      serviceInformation: {
        servicePeriods: [{ dateRange: { to: activeDate } }],
        reservesNationalGuardService: {
          title10Activation: {
            anticipatedSeparationDate: reserveDate,
          },
        },
      },
    });
    it('should return false for empty values', () => {
      expect(showSeparationLocation({})).to.be.false;
      expect(showSeparationLocation({ serviceInformation: {} })).to.be.false;
      expect(
        showSeparationLocation({ serviceInformation: { servicePeriods: '' } }),
      ).to.be.false;
      expect(
        showSeparationLocation({
          serviceInformation: {
            servicePeriods: [],
            reservesNationalGuardService: {},
          },
        }),
      ).to.be.false;
      expect(
        showSeparationLocation({
          serviceInformation: {
            servicePeriods: '',
            reservesNationalGuardService: {
              title10Activation: {},
            },
          },
        }),
      ).to.be.false;
      expect(showSeparationLocation(getFormData())).to.be.false;
    });

    const days190 = getDays(190);
    it('should return false for active duty release outside of the range', () => {
      expect(showSeparationLocation(getFormData(getDays(-1), ''))).to.be.false;
      expect(showSeparationLocation(getFormData(getDays(), ''))).to.be.false;
      expect(showSeparationLocation(getFormData(days190, ''))).to.be.false;
    });
    it('should return false for active reserve release outside of the range', () => {
      expect(showSeparationLocation(getFormData('', getDays(-1)))).to.be.false;
      expect(showSeparationLocation(getFormData('', getDays()))).to.be.false;
      expect(showSeparationLocation(getFormData('', days190))).to.be.false;
    });

    const days1 = getDays(1);
    const days90 = getDays(90);
    const days180 = getDays(180);
    it('should return true for active duty release inside of the range', () => {
      expect(showSeparationLocation(getFormData(days1, ''))).to.be.true;
      expect(showSeparationLocation(getFormData(days90, ''))).to.be.true;
      expect(showSeparationLocation(getFormData(days180, ''))).to.be.true;
    });

    it('should return true for active reserve release inside of the range', () => {
      expect(showSeparationLocation(getFormData('', days1))).to.be.true;
      expect(showSeparationLocation(getFormData('', days90))).to.be.true;
      expect(showSeparationLocation(getFormData('', days180))).to.be.true;
    });
    it('should return true for any release inside of the range', () => {
      expect(showSeparationLocation(getFormData(days1, days1))).to.be.true;
      expect(showSeparationLocation(getFormData(days1, days90))).to.be.true;
      expect(showSeparationLocation(getFormData(days1, days180))).to.be.true;
      expect(showSeparationLocation(getFormData(days90, days1))).to.be.true;
      expect(showSeparationLocation(getFormData(days90, days90))).to.be.true;
      expect(showSeparationLocation(getFormData(days90, days180))).to.be.true;
      expect(showSeparationLocation(getFormData(days180, days1))).to.be.true;
      expect(showSeparationLocation(getFormData(days180, days90))).to.be.true;
      expect(showSeparationLocation(getFormData(days180, days180))).to.be.true;
    });

    it('should return true after finding the most recent service period', () => {
      const bddData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { to: '2000-01-01' } },
            { dateRange: { to: days90 } },
            { dateRange: { to: '2020-01-01' } },
          ],
        },
      };
      expect(showSeparationLocation(bddData)).to.be.true;
    });
    it('should return false after finding the most recent service period', () => {
      const nonBddData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { to: '2000-01-01' } },
            { dateRange: { to: days190 } },
            { dateRange: { to: '2020-01-01' } },
          ],
        },
      };
      expect(showSeparationLocation(nonBddData)).to.be.false;
    });
  });
});

describe('isExpired', () => {
  const getDays = days => ({
    // in seconds from epoch as our backend uses that format
    expiresAt: parseDate(daysFromToday(days)).getTime() / 1000,
  });
  it('should return true for dates that are invalid or in the past', () => {
    expect(isExpired('')).to.be.true;
    expect(isExpired(0)).to.be.true;
    expect(isExpired(getDays(-1))).to.be.true;
  });
  it('should return false for dates in the future', () => {
    expect(isExpired(getDays(0))).to.be.false;
    expect(isExpired(getDays(1))).to.be.false;
    expect(isExpired(getDays(365))).to.be.false;
  });
});

describe('truncateDescriptions', () => {
  const getResult = (key, sizeDiff) =>
    truncateDescriptions({
      [key]: new Array(CHAR_LIMITS[key] + sizeDiff).fill('-').join(''),
    });
  it('should return an object untouched', () => {
    const data = { test: 'abc', test2: 123 };
    expect(truncateDescriptions(data)).to.deep.equal(data);
    data.primaryDescription = 'blah';
    expect(truncateDescriptions(data)).to.deep.equal(data);
    const key = 'primaryDescription';
    expect(getResult(key, -20)[key].length).to.equal(CHAR_LIMITS[key] - 20);
  });
  it('should truncate long descriptions', () => {
    [
      'primaryDescription', // 400
      'causedByDisabilityDescription', // 400
      'worsenedDescription', // 50
      'worsenedEffects', // 350
      'vaMistreatmentDescription', // 350
      'vaMistreatmentLocation', // 25
      'vaMistreatmentDate', // 25
    ].forEach(key => {
      expect(getResult(key, +20)[key].length).to.eq(CHAR_LIMITS[key]);
    });
  });
});

describe('skip PTSD questions', () => {
  const getData = ({
    combat,
    skipCombat,
    nonCombat,
    skipNonCombat,
    condition = 'PTSD',
  } = {}) => ({
    newDisabilities: [{ condition }],
    'view:claimType': {
      'view:claimingNew': true,
    },
    'view:selectablePtsdTypes': {
      'view:combatPtsdType': combat,
      'view:nonCombatPtsdType': nonCombat,
    },
    skip781ForCombatReason: skipCombat,
    skip781ForNonCombatReason: skipNonCombat,
  });

  describe('hasNewPtsdDisability', () => {
    const getPtsdData = (date, bddState = true) => ({
      'view:isBddData': bddState,
      serviceInformation: {
        servicePeriods: [{ dateRange: { to: date } }],
      },
      'view:claimType': { 'view:claimingnew': true },
      newDisabilities: [{ condition: 'PTSD' }],
    });

    it('should return true for PTSD in non-BDD flow', () => {
      expect(hasNewPtsdDisability(getPtsdData('2020-01-01', false))).to.be.true;
      // invalid BDD separation date negates BDD flow
      const today = daysFromToday(0);
      expect(hasNewPtsdDisability(getPtsdData(today, true))).to.be.true;
    });
    it('should return false for PTSD in BDD flow', () => {
      const date = daysFromToday(90);
      expect(hasNewPtsdDisability(getPtsdData(date, true))).to.be.false;
    });

    describe('PTSD flow migration', () => {
      const ptsdFormData = {
        'view:isBddData': false,
        // Set service end to date in the past; Benefits Delivery Discharge claims never go through the PTSD flow
        serviceInformation: {
          servicePeriods: [{ dateRange: { to: '2020-01-01' } }],
        },
        'view:claimType': { 'view:claimingnew': true },
        newDisabilities: [{ condition: 'PTSD' }],
      };

      describe('when the modern 0781 flow is enabled', () => {
        const ptsdFormDataModernFlowEnabled = {
          syncModern0781Flow: true,
          ...ptsdFormData,
        };

        it('should return false so the legacy PTSD flow is hidden', () => {
          expect(hasNewPtsdDisability(ptsdFormDataModernFlowEnabled)).to.be
            .false;
        });
      });

      describe('when the modern 0781 flow is disabled', () => {
        const ptsdFormDataModernFlowEnabled = {
          syncModern0781Flow: false,
          ...ptsdFormData,
        };

        it('should return true so the legacy PTSD flow is visible', () => {
          expect(hasNewPtsdDisability(ptsdFormDataModernFlowEnabled)).to.be
            .true;
        });
      });
    });
  });

  describe('showPtsdCombat', () => {
    it('should return false PTSD is not included', () => {
      expect(
        showPtsdCombat(
          getData({
            combat: false,
            nonCombat: false,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdCombat(
          getData({
            combat: true,
            nonCombat: false,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdCombat(
          getData({
            combat: false,
            nonCombat: true,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdCombat(
          getData({
            combat: true,
            nonCombat: true,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
    });
    it('should return false if PTSD is not combat', () => {
      expect(
        showPtsdCombat(
          getData({
            combat: false,
            nonCombat: false,
          }),
        ),
      ).to.be.false;
      expect(showPtsdCombat(getData())).to.be.false;
      expect(
        showPtsdCombat(
          getData({
            combat: false,
            nonCombat: true,
          }),
        ),
      ).to.be.false;
    });
    it('should return true if combat PTSD is included', () => {
      expect(showPtsdCombat(getData({ combat: true }))).to.be.true;
    });
  });

  describe('showPtsdNonCombat', () => {
    it('should return false PTSD is not included', () => {
      expect(
        showPtsdNonCombat(
          getData({
            combat: false,
            nonCombat: false,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdNonCombat(
          getData({
            combat: true,
            nonCombat: false,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdNonCombat(
          getData({
            combat: false,
            nonCombat: true,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdNonCombat(
          getData({
            combat: true,
            nonCombat: true,
            condition: 'abc',
          }),
        ),
      ).to.be.false;
    });
    it('should return false if PTSD is not none combat', () => {
      expect(
        showPtsdNonCombat(
          getData({
            combat: false,
            nonCombat: false,
          }),
        ),
      ).to.be.false;
      expect(
        showPtsdNonCombat(
          getData({
            combat: true,
            nonCombat: false,
          }),
        ),
      ).to.be.false;
    });
    it('should return true if non combat PTSD is included', () => {
      expect(
        showPtsdNonCombat(
          getData({
            combat: false,
            nonCombat: true,
          }),
        ),
      ).to.be.true;
    });
  });

  describe('skip781', () => {
    it('should return false if not skipping', () => {
      expect(skip781(getData())).to.be.false;
      expect(
        skip781(
          getData({
            skipCombat: false,
            skipNonCombat: false,
          }),
        ),
      ).to.be.false;
    });
    it('should return true if skipping', () => {
      expect(
        skip781(
          getData({
            skipCombat: true,
            skipNonCombat: false,
          }),
        ),
      ).to.be.true;
      expect(
        skip781(
          getData({
            skipCombat: false,
            skipNonCombat: true,
          }),
        ),
      ).to.be.true;
      expect(
        skip781(
          getData({
            skipCombat: true,
            skipNonCombat: true,
          }),
        ),
      ).to.be.true;
    });
  });
});

describe('formatMonthYearDate', () => {
  it('should return empty when empty date', () => {
    expect(formatMonthYearDate('')).to.equal('');
    expect(formatMonthYearDate(undefined)).to.equal('');
  });

  it('should return appropriate month and year when date provided', () => {
    expect(formatMonthYearDate('2000-01-01')).to.equal('January 2000');
    expect(formatMonthYearDate('2001-02-01')).to.equal('February 2001');
    expect(formatMonthYearDate('2002-03-01')).to.equal('March 2002');
    expect(formatMonthYearDate('2003-04-01')).to.equal('April 2003');
    expect(formatMonthYearDate('2004-05-01')).to.equal('May 2004');
    expect(formatMonthYearDate('2005-06-01')).to.equal('June 2005');
    expect(formatMonthYearDate('2006-07-01')).to.equal('July 2006');
    expect(formatMonthYearDate('2007-08-01')).to.equal('August 2007');
    expect(formatMonthYearDate('2008-09-01')).to.equal('September 2008');
    expect(formatMonthYearDate('2009-10-01')).to.equal('October 2009');
    expect(formatMonthYearDate('2010-11-01')).to.equal('November 2010');
    expect(formatMonthYearDate('1970-12-01')).to.equal('December 1970');
  });
});

describe('makeConditionsSchema', () => {
  it('should generate the correct schema from formData', () => {
    const formData = {
      newDisabilities: [
        { condition: 'condition1' },
        { condition: 'condition2' },
      ],
    };

    const result = makeConditionsSchema(formData);

    expect(result).to.deep.equal(
      checkboxGroupSchema(['condition1', 'condition2', 'none']),
    );
  });

  it('should handle empty newDisabilities array', () => {
    const formData = { newDisabilities: [] };
    const result = makeConditionsSchema(formData);

    expect(result).to.deep.equal(checkboxGroupSchema(['none']));
  });
});

describe('validateConditions', () => {
  const errorKey = 'mentalHealth';
  const errorMessage = 'None may only be selected by itself';
  let errors;

  beforeEach(() => {
    errors = {
      mentalHealth: {
        conditions: {
          addError: msg => {
            errors.mentalHealth.conditions.errorMessage = msg;
          },
        },
      },
    };
  });

  it('should add an error if the "none" checkbox is selected along with another condition', () => {
    const conditions = { none: true, conditionA: true };
    validateConditions(conditions, errors, errorKey, errorMessage);
    expect(errors.mentalHealth.conditions.errorMessage).to.equal(errorMessage);
  });

  it('should NOT add an error if only "none" is selected and no other condition', () => {
    const conditions = { none: true };
    validateConditions(conditions, errors, errorKey, errorMessage);
    expect(errors.mentalHealth.conditions.errorMessage).to.be.undefined;
  });

  it('should NOT add an error if no conditions are selected', () => {
    const conditions = {};
    validateConditions(conditions, errors, errorKey, errorMessage);
    expect(errors.mentalHealth.conditions.errorMessage).to.be.undefined;
  });

  it('should NOT add an error if one or more condition is selected and "none" is not selected', () => {
    const conditions = { conditionA: true, conditionB: true };
    validateConditions(conditions, errors, errorKey, errorMessage);
    expect(errors.mentalHealth.conditions.errorMessage).to.be.undefined;
  });
});

describe('formatFullName', () => {
  it('formats name with all parts', () => {
    const fullName = {
      first: 'Hector',
      middle: 'Lee',
      last: 'Brooks',
      suffix: 'Jr.',
    };

    expect(formatFullName(fullName)).to.equal('Hector Lee Brooks Jr.');
  });

  it('formats name when missing first name', () => {
    const fullName = {
      first: '',
      middle: 'Lee',
      last: 'Brooks',
      suffix: 'Jr.',
    };

    expect(formatFullName(fullName)).to.equal('Lee Brooks Jr.');
  });

  it('formats name when missing middle name', () => {
    const fullName = {
      first: 'Hector',
      middle: '',
      last: 'Brooks',
      suffix: 'Jr.',
    };

    expect(formatFullName(fullName)).to.equal('Hector Brooks Jr.');
  });

  it('formats name when missing last name', () => {
    const fullName = {
      first: 'Hector',
      middle: 'Lee',
      last: '',
      suffix: 'Jr.',
    };

    expect(formatFullName(fullName)).to.equal('Hector Lee Jr.');
  });

  it('formats name when missing suffix', () => {
    const fullName = {
      first: 'Hector',
      middle: 'Lee',
      last: 'Brooks',
      suffix: undefined,
    };

    expect(formatFullName(fullName)).to.equal('Hector Lee Brooks');
  });

  it('formats name when missing most things', () => {
    const fullName = {
      first: '',
      middle: '',
      last: '',
      suffix: 'Jr.',
    };

    expect(formatFullName(fullName)).to.equal('Jr.');
  });

  it('formats name when all empty or missing parts', () => {
    expect(formatFullName(undefined)).to.equal('');
    expect(formatFullName({})).to.equal('');
    expect(
      formatFullName({
        first: null,
        middle: null,
        last: null,
        suffix: null,
      }),
    ).to.equal('');
    expect(
      formatFullName({
        first: '',
        middle: '',
        last: '',
        suffix: '',
      }),
    ).to.equal('');
  });
});

describe('baseDoNew4142Logic', () => {
  const baseFormData = {
    disability526Enable2024Form4142: true,
    'view:hasEvidence': true,
    'view:patientAcknowledgement': {
      'view:acknowledgement': true,
    },
    'view:uploadPrivateRecordsQualifier': {
      'view:hasPrivateRecordsToUpload': false,
    },
    patient4142Acknowledgement: false,
  };

  describe('when all conditions are met', () => {
    it('should return true when user is still choosing to upload private medical records', () => {
      const formData = {
        ...baseFormData,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.true;
    });
  });

  describe('when private medical records condition is not met', () => {
    it('should return false when user is not choosing to upload private medical records', () => {
      const formData = {
        ...baseFormData,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': false,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });

    it('should return false when view:selectableEvidenceTypes is undefined', () => {
      const formData = {
        ...baseFormData,
        // 'view:selectableEvidenceTypes' is not set
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });

    it('should return false when view:hasPrivateMedicalRecords is undefined', () => {
      const formData = {
        ...baseFormData,
        'view:selectableEvidenceTypes': {
          // 'view:hasPrivateMedicalRecords' is not set
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });

    it('should return false when view:hasPrivateMedicalRecords is null', () => {
      const formData = {
        ...baseFormData,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': null,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });

    it('should return false when view:hasEvidence is null', () => {
      const formData = {
        ...baseFormData,
        'view:hasEvidence': null,
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('when feature flag is disabled', () => {
    it('should return false even if user wants to upload private medical records', () => {
      const formData = {
        ...baseFormData,
        disability526Enable2024Form4142: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('when user has not acknowledged 4142 authorization', () => {
    it('should return false even if user wants to upload private medical records', () => {
      const formData = {
        ...baseFormData,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:patientAcknowledgement': {
          'view:acknowledgement': false,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('when user has switched to upload option', () => {
    it('should return false even if user wants to upload private medical records', () => {
      const formData = {
        ...baseFormData,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('when user has switched to no evidence option', () => {
    it('should return false even if legacy data exists', () => {
      const formData = {
        ...baseFormData,
        'view:hasEvidence': false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('when user has already acknowledged the new 4142', () => {
    it('should return false even if user wants to upload private medical records', () => {
      const formData = {
        ...baseFormData,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        patient4142Acknowledgement: true,
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('edge cases', () => {
    it('should handle empty formData gracefully', () => {
      expect(baseDoNew4142Logic({})).to.be.false;
    });
  });
});

describe('showToxicExposureDestructionModal', () => {
  it('should get toxic exposure destruction modal feature flag value of true', () => {
    expect(
      showToxicExposureDestructionModal({
        featureToggles: {
          disabilityCompensationToxicExposureDestructionModal: true,
        },
      }),
    ).to.be.true;
  });
  it('should get toxic exposure destruction modal feature flag value of false', () => {
    expect(
      showToxicExposureDestructionModal({
        featureToggles: {
          disabilityCompensationToxicExposureDestructionModal: false,
        },
      }),
    ).to.be.false;
  });
});
