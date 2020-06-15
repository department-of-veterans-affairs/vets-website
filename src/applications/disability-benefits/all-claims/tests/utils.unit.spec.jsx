import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import {
  makeSchemaForNewDisabilities,
  makeSchemaForRatedDisabilities,
  makeSchemaForAllDisabilities,
  capitalizeEachWord,
  fieldsHaveInput,
  hasGuardOrReservePeriod,
  hasHospitalCare,
  hasOtherEvidence,
  increaseOnly,
  isAnswering781aQuestions,
  isAnswering781Questions,
  isInFuture,
  isUploading781aForm,
  isUploading781aSupportingDocuments,
  isUploading781Form,
  isWithinRange,
  needsToAnswerUnemployability,
  needsToEnter781,
  needsToEnter781a,
  needsToEnterUnemployability,
  newConditionsOnly,
  queryForFacilities,
  ReservesGuardDescription,
  servedAfter911,
  viewifyFields,
  activeServicePeriods,
  formatDate,
  formatDateRange,
} from '../utils.jsx';

describe('526 helpers', () => {
  describe('hasGuardOrReservePeriod', () => {
    it('should return true when reserve period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air Force Reserve',
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
              serviceBranch: 'Air Force Reserve',
              dateRange: {
                from: '2000-05-08',
                to: '2011-10-08',
              },
            },
            {
              serviceBranch: 'Marine Corps Reserve',
              dateRange: {
                from: '2000-05-08',
                to: '2018-10-08',
              },
            },
          ],
        },
      };

      const renderedText = shallow(ReservesGuardDescription(form));
      expect(renderedText.render().text()).to.contain('Marine Corps Reserve');
      renderedText.unmount();
    });

    it('should return null when no service periods present', () => {
      const form = {
        formData: {},
      };

      expect(ReservesGuardDescription(form)).to.equal(null);
    });
  });

  describe('isInFuture', () => {
    it('adds an error when entered date is today or earlier', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = '2018-04-12';

      isInFuture(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('does not add an error when the entered date is in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = '2099-04-12';

      isInFuture(errors, fieldData);
      expect(addError.callCount).to.equal(0);
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

  describe('makeSchemaForNewDisabilities', () => {
    it('should return schema with downcased keynames', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Ptsd personal trauma',
          },
        ],
      };
      expect(makeSchemaForNewDisabilities(formData)).to.eql({
        properties: {
          'ptsd personal trauma': {
            title: 'Ptsd Personal Trauma',
            type: 'boolean',
          },
        },
      });
    });

    it('should return correct schema when periods used', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'period. Period.',
          },
        ],
      };
      expect(makeSchemaForNewDisabilities(formData)).to.eql({
        properties: {
          'period. period.': {
            title: 'Period. Period.',
            type: 'boolean',
          },
        },
      });
    });
  });

  describe('makeSchemaForRatedDisabilities', () => {
    it('should return schema for selected disabilities only', () => {
      const formData = {
        ratedDisabilities: [
          {
            name: 'Ptsd personal trauma',
            'view:selected': false,
          },
          {
            name: 'Diabetes mellitus',
            'view:selected': true,
          },
        ],
      };
      expect(makeSchemaForRatedDisabilities(formData)).to.eql({
        properties: {
          'diabetes mellitus': {
            title: 'Diabetes Mellitus',
            type: 'boolean',
          },
        },
      });
    });
  });

  describe('makeSchemaForAllDisabilities', () => {
    it('should return schema for all (selected) disabilities', () => {
      const formData = {
        ratedDisabilities: [
          {
            name: 'Ptsd personal trauma',
            'view:selected': false,
          },
          {
            name: 'Diabetes mellitus',
            'view:selected': true,
          },
        ],
        newDisabilities: [
          {
            condition: 'A new Condition.',
          },
        ],
      };
      expect(makeSchemaForAllDisabilities(formData)).to.eql({
        properties: {
          'diabetes mellitus': {
            title: 'Diabetes Mellitus',
            type: 'boolean',
          },
          'a new condition.': {
            title: 'A New Condition.',
            type: 'boolean',
          },
        },
      });
    });
  });

  describe('queryForFacilities', () => {
    const originalFetch = global.fetch;
    beforeEach(() => {
      // Replace fetch with a spy
      global.fetch = sinon.stub();
      global.fetch.catch = sinon.stub();
      global.fetch.resolves({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => ({
          data: [
            { id: 0, attributes: { name: 'first' } },
            { id: 1, attributes: { name: 'second' } },
          ],
        }),
      });
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should not call the api if the input length is < 3', () => {
      queryForFacilities('12');
      expect(global.fetch.called).to.be.false;
    });

    it('should call the api if the input length is >= 3', () => {
      queryForFacilities('123');
      expect(global.fetch.called).to.be.true;
    });

    it('should call the api with the input', () => {
      queryForFacilities('asdf');
      expect(global.fetch.firstCall.args[0]).to.contain(
        '/facilities/suggested?type%5B%5D=health&type%5B%5D=dod_health&name_part=asdf',
      );
    });

    it('should return the mapped data for autosuggest if successful', () => {
      // Doesn't matter what we call this with since our stub will always return the same thing
      const requestPromise = queryForFacilities('asdf');
      return requestPromise.then(result => {
        expect(result).to.eql([
          { id: 0, label: 'first' },
          { id: 1, label: 'second' },
        ]);
      });
    });

    it('should return an empty array if unsuccessful', () => {
      global.fetch.resolves({ ok: false });
      // Doesn't matter what we call this with since our stub will always return the same thing
      const requestPromise = queryForFacilities('asdf');
      return requestPromise.then(result => {
        // This .then() fires after the apiRequest failure callback returns []
        expect(result).to.eql([]);
      });
    });
  });

  describe('hasotherEvidence', () => {
    it('should return false if additional evidence type is not selected', () => {
      const formData = {
        'view:hasEvidenceFollowUp': {
          'view:selectableEvidenceTypes': {
            // 'view:hasOtherEvidence': no data
          },
        },
      };
      expect(hasOtherEvidence(formData)).to.equal(false);
    });

    it('should return true if additional evidence type is selected', () => {
      const formData = {
        'view:hasEvidenceFollowUp': {
          'view:selectableEvidenceTypes': {
            'view:hasOtherEvidence': true,
          },
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
        'view:newDisabilities': true,
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
        'view:newDisabilities': true,
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
  });

  describe('needsToEnter781a', () => {
    it('should return true if user has selected MST PTSD types', () => {
      const formData = {
        'view:newDisabilities': true,
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
        'view:newDisabilities': true,
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
        'view:newDisabilities': true,
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
          to: moment()
            .add(1, 'day')
            .format('YYYY-MM-DD'),
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
});

describe('isAnswering781Questions', () => {
  it('should return true if user is answering first set of 781 incident questions', () => {
    const formData = {
      'view:newDisabilities': true,
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
      'view:newDisabilities': true,
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

describe('isAnswering781Questions', () => {
  it('should return true if user is answering first set of 781 incident questions', () => {
    const formData = {
      'view:newDisabilities': true,
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
      'view:newDisabilities': true,
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
      'view:newDisabilities': true,
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
      'view:newDisabilities': true,
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
      'view:newDisabilities': true,
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
        'view:newDisabilities': true,
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
  };
  // Shouldn't be possible, but worth testing anyhow
  const noneSelected = {
    'view:claimType': {
      'view:claimingIncrease': false,
      'view:claimingNew': false,
    },
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
    });
  });

  describe('format date & date range', () => {
    it('should format dates with full month names', () => {
      expect(formatDate(true)).to.be.null;
      expect(formatDate('foobar')).to.be.null;
      expect(formatDate('2020-02-31')).to.be.null;
      expect(formatDate('2020-01-31')).to.equal('January 31, 2020');
      expect(formatDate('2020-04-05')).to.equal('April 5, 2020');
      expect(formatDate('2020-05-05')).to.equal('May 5, 2020');
      expect(formatDate('2020-06-15')).to.equal('June 15, 2020');
      expect(formatDate('2020-07-25')).to.equal('July 25, 2020');
      expect(formatDate('2020-08-05')).to.equal('August 5, 2020');
      expect(formatDate('2020-12-05')).to.equal('December 5, 2020');
    });
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
  });
});
