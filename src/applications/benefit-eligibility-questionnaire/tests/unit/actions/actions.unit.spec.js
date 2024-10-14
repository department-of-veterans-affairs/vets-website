import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from '../../../reducers/actions';
import { mockFormData } from '../mocks/mockFormData';
import { BENEFITS_LIST, anyType } from '../../../constants/benefits';

describe('actions', () => {
  describe('getResults', () => {
    it('returns valid response when formData is passed', async () => {
      const dispatch = sinon.spy();
      actions
        .getResults(mockFormData)(dispatch)
        .then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            'FETCH_RESULTS_STARTED',
          );

          expect(dispatch.secondCall.args[0].type).to.equal(
            'FETCH_RESULTS_SUCCESS',
          );

          const expectedResults = BENEFITS_LIST.filter(b =>
            ['GIB', 'FHV', 'SVC', 'VSC'].includes(b.id),
          );
          expect(dispatch.secondCall.args[0].payload).to.equal(expectedResults);
        });
    });
  });

  describe('displayResults', () => {
    it('dispatches FETCH_RESULTS_STARTED and FETCH_RESULTS_SUCCESS with valid benefit ids', async () => {
      const dispatch = sinon.spy();
      await actions.displayResults(['GIB', 'SBP'])(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal('FETCH_RESULTS_STARTED');
      expect(dispatch.secondCall.args[0].type).to.equal(
        'FETCH_RESULTS_SUCCESS',
      );

      const expectedResults = BENEFITS_LIST.filter(b =>
        ['GIB', 'SBP'].includes(b.id),
      );
      expect(dispatch.secondCall.args[0].payload).to.eql(expectedResults);
    });

    it('dispatches FETCH_RESULTS_FAILURE when an error occurs during displayResults', async () => {
      const dispatch = sinon.spy();
      const invalidIds = null;

      await actions
        .displayResults(invalidIds)(dispatch)
        .catch(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            'FETCH_RESULTS_STARTED',
          );
          expect(dispatch.secondCall.args[0].type).to.equal(
            'FETCH_RESULTS_FAILURE',
          );
          expect(dispatch.secondCall.args[0].error).to.exist;
        });
    });
  });

  describe('checkExtraConditions', () => {
    it('returns true if no extraConditions are provided', () => {
      const benefit = {};
      const formData = {};
      const result = actions.checkExtraConditions(benefit, formData);
      expect(result).to.be.true;
    });

    it('returns false when extraConditions fail', () => {
      const benefit = {
        extraConditions: {
          oneIsNotBlank: ['someField'],
        },
      };
      const formData = {
        someField: '',
      };
      const result = actions.checkExtraConditions(benefit, formData);
      expect(result).to.be.false;
    });

    it('returns true when extraConditions pass', () => {
      const benefit = {
        extraConditions: {
          oneIsNotBlank: ['someField'],
        },
      };
      const formData = {
        someField: 'notBlank',
      };
      const result = actions.checkExtraConditions(benefit, formData);
      expect(result).to.be.true;
    });
  });

  describe('mapBenefitFromFormInputData', () => {
    it('returns true if benefit passes mapping conditions', () => {
      const benefit = {
        mappings: {
          GOALS: [anyType.ANY],
        },
      };
      const formData = {};
      const result = actions.mapBenefitFromFormInputData(benefit, formData);
      expect(result).to.be.true;
    });
  });
});
