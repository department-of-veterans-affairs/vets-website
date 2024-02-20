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
} from '../../actions/careSummariesAndNotes';

describe('Get care summaries and notes list action', () => {
  it('should dispatch a get list action', () => {
    const mockData = notes;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getCareSummariesAndNotesList()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.GET_LIST,
      );
    });
  });

  it('should dispatch an add alert action', () => {
    const mockData = notes;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    return getCareSummariesAndNotesList()(dispatch).then(() => {
      expect(typeof dispatch.firstCall.args[0]).to.equal('function');
    });
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
});

describe('Get care summaries and notes details action', () => {
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
