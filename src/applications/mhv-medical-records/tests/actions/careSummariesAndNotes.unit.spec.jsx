import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import note from '../fixtures/dischargeSummary.json';
import notes from '../fixtures/notes.json';
import {
  clearCareSummariesDetails,
  getCareSummariesAndNotesList,
  getCareSummaryAndNotesDetails,
  updateNotesDateRange,
} from '../../actions/careSummariesAndNotes';

describe('Get care summaries and notes list action', () => {
  it('should dispatch a get list action', () => {
    const mockData = notes;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getCareSummariesAndNotesList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.GET_LIST,
      );
    });
  });

  it('should dispatch GET_UNIFIED_LIST when isAccelerating is true', () => {
    const mockData = notes;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getCareSummariesAndNotesList(
      false,
      true,
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
      );
      // If you have a CLEAR_INITIAL_FHIR_LOAD action, check it here
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.GET_UNIFIED_LIST,
      );
    });
  });

  it('should dispatch an add alert action on error and not throw', async () => {
    const mockData = notes;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    await getCareSummariesAndNotesList()(dispatch);
    expect(typeof dispatch.secondCall.args[0]).to.equal('function');
  });
});

describe('Get care summaries and notes details action', () => {
  it('should dispatch a get details action', () => {
    const mockData = note;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getCareSummaryAndNotesDetails(
      'ex-MHV-note-1',
      undefined,
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.GET,
      );
    });
  });

  it('should dispatch a get details action and pull from the list', () => {
    const dispatch = sinon.spy();
    return getCareSummaryAndNotesDetails('1', [{ id: '1' }])(dispatch).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.CareSummariesAndNotes.GET_FROM_LIST,
        );
      },
    );
  });

  it('should dispatch an add alert action on error and not throw', async () => {
    mockApiRequest(note, false);
    const dispatch = sinon.spy();
    await getCareSummaryAndNotesDetails('ex-MHV-note-1', undefined)(dispatch);
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });
});

describe('Clear care summaries and notes details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearCareSummariesDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.CLEAR_DETAIL,
      );
    });
  });
});

describe('Update notes date range action', () => {
  it('should dispatch a set date range action with correct payload', () => {
    const dispatch = sinon.spy();
    const option = '6';
    const fromDate = '2025-05-13';
    const toDate = '2025-11-13';
    return updateNotesDateRange(
      option,
      fromDate,
      toDate,
    )(dispatch).then(() => {
      expect(dispatch.calledOnce).to.be.true;
      const action = dispatch.firstCall.args[0];
      expect(action.type).to.equal(
        Actions.CareSummariesAndNotes.SET_DATE_RANGE,
      );
      expect(action.payload).to.deep.equal({ option, fromDate, toDate });
    });
  });
});
