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
    return getCareSummariesAndNotesList(false, true)(dispatch).then(() => {
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
    return getCareSummaryAndNotesDetails('ex-MHV-note-1', undefined)(
      dispatch,
    ).then(() => {
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

  it('should dispatch GET_FROM_LIST for accelerating vista notes', () => {
    const dispatch = sinon.spy();
    const noteList = [{ id: '1', source: 'vista' }];
    return getCareSummaryAndNotesDetails('1', noteList, true)(dispatch).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.CareSummariesAndNotes.GET_FROM_LIST,
        );
        expect(dispatch.firstCall.args[0].response).to.deep.equal({
          id: '1',
          source: 'vista',
        });
      },
    );
  });

  it('should dispatch exactly once for accelerating vista notes without making an API call', () => {
    const dispatch = sinon.spy();
    const noteList = [{ id: '1', source: 'vista' }];
    return getCareSummaryAndNotesDetails('1', noteList, true)(dispatch).then(
      () => {
        expect(dispatch.calledOnce).to.be.true;
      },
    );
  });

  it('should dispatch GET_FROM_LIST for accelerating notes with no explicit source', () => {
    const dispatch = sinon.spy();
    const noteList = [{ id: '1' }];
    return getCareSummaryAndNotesDetails('1', noteList, true)(dispatch).then(
      () => {
        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.CareSummariesAndNotes.GET_FROM_LIST,
        );
      },
    );
  });

  it('should call the API and dispatch GET_UNIFIED_ITEM_FROM_LIST for accelerating oracle-health notes', () => {
    const mockData = {
      data: { id: '2', type: 'clinical_note', source: 'oracle-health' },
    };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const noteList = [{ id: '2', source: 'oracle-health' }];
    return getCareSummaryAndNotesDetails('2', noteList, true)(dispatch).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM_FROM_LIST,
        );
        // Verify the response has the { data: {...} } shape the reducer expects
        expect(dispatch.firstCall.args[0].response).to.have.property('data');
        expect(dispatch.firstCall.args[0].response.data.id).to.equal('2');
      },
    );
  });

  it('should pass the API response for oracle-health notes in JSON:API shape', () => {
    const mockData = {
      data: {
        id: '2',
        type: 'clinical_note',
        attributes: {
          source: 'oracle-health',
          title: 'Oracle Note',
        },
      },
    };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const noteList = [{ id: '2', source: 'oracle-health' }];
    return getCareSummaryAndNotesDetails('2', noteList, true)(dispatch).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM_FROM_LIST,
        );
        expect(dispatch.firstCall.args[0].response).to.deep.equal(mockData);
        // Ensure the shape matches what the reducer accesses: action.response.data
        expect(dispatch.firstCall.args[0].response.data.id).to.equal('2');
      },
    );
  });

  it('should dispatch an alert when oracle-health API call fails', async () => {
    mockApiRequest({}, false);
    const dispatch = sinon.spy();
    const noteList = [{ id: '2', source: 'oracle-health' }];
    await getCareSummaryAndNotesDetails('2', noteList, true)(dispatch);
    // The first dispatched action should be the addAlert thunk
    expect(typeof dispatch.firstCall.args[0]).to.equal('function');
  });

  it('should not dispatch any action when note ID is not found in list and isAccelerating is true', () => {
    const dispatch = sinon.spy();
    const noteList = [{ id: '1', source: 'vista' }];
    return getCareSummaryAndNotesDetails('999', noteList, true)(dispatch).then(
      () => {
        expect(dispatch.called).to.be.false;
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
    return updateNotesDateRange(option, fromDate, toDate)(dispatch).then(() => {
      expect(dispatch.calledOnce).to.be.true;
      const action = dispatch.firstCall.args[0];
      expect(action.type).to.equal(
        Actions.CareSummariesAndNotes.SET_DATE_RANGE,
      );
      expect(action.payload).to.deep.equal({ option, fromDate, toDate });
    });
  });
});
