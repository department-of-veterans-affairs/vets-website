import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _ from '../../../../platform/utilities/data';

import formConfig from '../config/form';

import {
  hasGuardOrReservePeriod,
  ReservesGuardDescription,
  isInFuture,
  getDisabilityName,
  transformDisabilities,
  queryForFacilities,
  hasOtherEvidence,
  fieldsHaveInput,
  servedAfter911,
  needsToEnter781,
  needsToEnter781a,
  isAnswering781Questions,
  isAnswering781aQuestions,
  isUploading781aSupportingDocuments,
  isUploading781Form,
  isUploading781aForm,
  transformRelatedDisabilities,
  viewifyFields,
  transformMVPData,
  transform,
  needsToEnterUnemployability,
  needsToAnswerUnemployability,
} from '../utils.jsx';

import {
  transformedMinimalData,
  transformedMaximalData,
} from './schema/transformedData';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';

import initialData from './initialData';

import { SERVICE_CONNECTION_TYPES } from '../../all-claims/constants';

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

  describe('getDisabilityName', () => {
    it('should return string with each word capitalized when name supplied', () => {
      expect(getDisabilityName('some disability - some detail')).to.equal(
        'Some Disability - Some Detail',
      );
    });
    it('should return Unknown Condition with undefined name', () => {
      expect(getDisabilityName()).to.equal('Unknown Condition');
    });
    it('should return Unknown Condition when input is empty string', () => {
      expect(getDisabilityName('')).to.equal('Unknown Condition');
    });
    it('should return Unknown Condition when name is not a string', () => {
      expect(getDisabilityName(249481)).to.equal('Unknown Condition');
    });
  });

  describe('transformDisabilities', () => {
    const rawDisability = initialData.ratedDisabilities[1];
    const formattedDisability = Object.assign(
      { disabilityActionType: 'INCREASE' },
      rawDisability,
    );
    it('should create a list of disabilities with disabilityActionType set to INCREASE', () => {
      expect(transformDisabilities([rawDisability])).to.deep.equal([
        formattedDisability,
      ]);
    });
    it('should return an empty array when given undefined input', () => {
      expect(transformDisabilities(undefined)).to.deep.equal([]);
    });
    it('should remove ineligible disabilities', () => {
      const ineligibleDisability = _.set(
        'decisionCode',
        SERVICE_CONNECTION_TYPES.notServiceConnected,
        rawDisability,
      );
      expect(transformDisabilities([ineligibleDisability])).to.deep.equal([]);
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
        'view:selectablePtsdTypes': {
          'view:combatPtsdType': true,
        },
      };
      expect(needsToEnter781(formData)).to.be.true;
    });

    it('should return true if user has selected Non-combat PTSD types', () => {
      const formData = {
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
        'view:selectablePtsdTypes': {
          'view:mstPtsdType': true,
        },
      };
      expect(needsToEnter781a(formData)).to.be.true;
    });

    it('should return true if user has selected Assault PTSD types', () => {
      const formData = {
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
        'view:upload781aChoice': 'upload',
      };
      expect(isUploading781aForm(formData)).to.be.true;
    });

    it('should return false if user has not chosen to upload 781a', () => {
      const formData = {};
      expect(isUploading781aForm(formData)).to.be.false;
    });
  });

  describe('transformRelatedDisabilities', () => {
    it('should return an array of strings', () => {
      const claimedConditions = [
        'some condition name',
        'another condition name',
      ];
      const treatedDisabilityNames = {
        'Some condition name': true,
        'Another condition name': true,
        'This condition is falsey!': false,
      };
      expect(
        transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
      ).to.eql(['some condition name', 'another condition name']);
    });
    it('should not add conditions if they are not claimed', () => {
      const claimedConditions = ['some condition name'];
      const treatedDisabilityNames = {
        'Some condition name': true,
        'Another condition name': true,
        'This condition is falsey!': false,
      };
      expect(
        transformRelatedDisabilities(treatedDisabilityNames, claimedConditions),
      ).to.eql(['some condition name']);
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
});

describe('isAnsweringPtsdForm', () => {
  it('should return false if user has chosen to not answer questions', () => {
    const formData = {};
    expect(needsToEnter781(formData)).to.be.false;
  });
});

describe('isAnswering781Questions', () => {
  it('should return true if user is answering first set of 781 incident questions', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
    };
    expect(isAnswering781Questions(0)(formData)).to.be.true;
  });
  it('should return true if user has chosen to answer questions for a 781 PTSD incident', () => {
    const formData = {
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

describe('transformMVPData', () => {
  it('should omit the veteran property and spread its subproperties', () => {
    const formData = {
      veteran: {
        emailAddress: 'asdf',
        mailingAddress: { foo: 'bar' },
        primaryPhone: '1231231234',
      },
    };
    expect(transformMVPData(formData)).to.eql(formData.veteran);
  });
  it('should nest service periods and reservesNationalGuardService under serviceInformation', () => {
    const formData = {
      servicePeriods: [{ from: 'adf', to: 'asdf' }],
      reservesNationalGuardService: 'asdf',
    };
    expect(transformMVPData(formData)).to.eql({
      serviceInformation: formData,
    });
  });
  it('should handle no pre-filled information', () => {
    expect(transformMVPData({})).to.eql({});
  });
});

describe('transform', () => {
  it('should transform minimal data correctly', () => {
    expect(JSON.parse(transform(formConfig, minimalData))).to.deep.equal(
      transformedMinimalData,
    );
  });

  it('should transform maximal data correctly', () => {
    expect(JSON.parse(transform(formConfig, maximalData))).to.deep.equal(
      transformedMaximalData,
    );
  });
});

describe('isAnswering781Questions', () => {
  it('should return true if user is answering first set of 781 incident questions', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
      'view:upload781Choice': 'answerQuestions',
    };
    expect(isAnswering781Questions(0)(formData)).to.be.true;
  });
  it('should return true if user has chosen to answer questions for a 781 PTSD incident', () => {
    const formData = {
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
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
      'view:upload781aChoice': 'answerQuestions',
    };
    expect(isAnswering781aQuestions(0)(formData)).to.be.true;
  });
  it('should return true if user has chosen to answer questions for a 781a PTSD incident', () => {
    const formData = {
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
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
      'view:upload781aChoice': 'answerQuestions',
      'view:enterAdditionalSecondaryEvents0': false,
    };
    expect(isAnswering781aQuestions(1)(formData)).to.be.false;
  });

  describe('isUploading781aSupportingDocuments', () => {
    it('', () => {
      const formData = {
        'view:selectablePtsdTypes': {
          'view:assaultPtsdType': true,
        },
        'view:uploadChoice0': true,
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
});
