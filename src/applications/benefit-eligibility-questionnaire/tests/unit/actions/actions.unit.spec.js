import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from '../../../reducers/actions';
import { mockFormData } from '../mocks/mockFormData';
import { BENEFITS_LIST } from '../../../constants/benefits';

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
    it('returns valid response when list of ids is passed', async () => {
      const dispatch = sinon.spy();
      actions
        .displayResults(['GIB', 'SBP'])(dispatch)
        .then(() => {
          expect(dispatch.firstCall.args[0].type).to.equal(
            'FETCH_RESULTS_STARTED',
          );

          expect(dispatch.secondCall.args[0].type).to.equal(
            'FETCH_RESULTS_SUCCESS',
          );

          const expectedResults = BENEFITS_LIST.filter(b =>
            ['GIB', 'SBP'].includes(b.id),
          );
          expect(dispatch.secondCall.args[0].payload).to.equal(expectedResults);
        });
    });
  });
});
