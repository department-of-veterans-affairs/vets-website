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
import { addAlert } from '../../actions/alerts';
import * as Constants from '../../util/constants';
import { dispatchDetails } from '../../util/helpers';

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
});

describe('Get care summaries and notes details action', () => {
  it('should dispatch a get details action', async () => {
    const noteList = [];
    const mockData = note;
    const dispatch = sinon.spy();

    const getDetail = async () => mockData;

    try {
      await dispatchDetails(
        'ex-MHV-note-1',
        noteList,
        dispatch,
        getDetail,
        Actions.CareSummariesAndNotes.GET_FROM_LIST,
        Actions.CareSummariesAndNotes.GET,
      );
      expect(dispatch.called).to.be.true;
      expect(dispatch.firstCall.args[0]).to.exist;
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.GET_FROM_LIST,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
    }
  });
});

describe('Get care summaries and notes details action', () => {
  it('should dispatch a get details action and pull from the list', () => {
    const mockData = { id: '1', title: 'Sample Note' };
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    return getCareSummaryAndNotesDetails('1', [
      { id: '1', title: 'Sample Note' },
    ])(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.CareSummariesAndNotes.GET_FROM_LIST,
      );
    });
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
