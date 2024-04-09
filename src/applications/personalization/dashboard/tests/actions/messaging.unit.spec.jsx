import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  FETCH_FOLDER_FAILURE,
  FETCH_FOLDER_SUCCESS,
  LOADING_FOLDER,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  LOADING_RECIPIENTS,
  FETCH_UNREAD_MESSAGES_COUNT_SUCCESS,
  FETCH_UNREAD_MESSAGES_COUNT_ERROR,
  LOADING_UNREAD_MESSAGES_COUNT,
  fetchUnreadMessagesCount,
  fetchFolder,
  fetchRecipients,
} from '../../actions/messaging';
import {
  messagesSuccess,
  messagesError,
  folderSuccess,
  folderError,
  recipientSuccess,
  recipientError,
} from '../fixtures/test-messaging-response';

describe('/actions/messaging', () => {
  describe('fetchUnreadMessagesCount', () => {
    let dispatchSpy;
    beforeEach(() => {
      mockFetch();
      dispatchSpy = sinon.spy();
    });

    it('should dispatch loading and success actions for unread messages count', () => {
      const response = messagesSuccess;
      setFetchJSONResponse(global.fetch.onCall(0), response);
      const thunk = fetchUnreadMessagesCount();
      const dispatch = action => {
        dispatchSpy(action);

        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.equal(
            LOADING_UNREAD_MESSAGES_COUNT,
          );
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            FETCH_UNREAD_MESSAGES_COUNT_SUCCESS,
          );
        }
      };
      thunk(dispatch);
    });

    describe('onError callback', () => {
      it('should dispatch error action', () => {
        const response = messagesError;
        setFetchJSONFailure(global.fetch.onCall(0), response);
        const thunk = fetchUnreadMessagesCount();
        const dispatch = action => {
          dispatchSpy(action);

          if (dispatchSpy.callCount === 2) {
            expect(dispatchSpy.secondCall.args[0].type).to.equal(
              FETCH_UNREAD_MESSAGES_COUNT_ERROR,
            );
          }
        };
        thunk(dispatch);
      });

      it('should dispatch error action, even if there is no error object from response', () => {
        setFetchJSONFailure(global.fetch.onCall(0), '');
        const thunk = fetchUnreadMessagesCount();
        const dispatch = action => {
          dispatchSpy(action);
          if (dispatchSpy.callCount === 2) {
            expect(dispatchSpy.secondCall.args[0].type).to.equal(
              FETCH_UNREAD_MESSAGES_COUNT_ERROR,
            );
          }
        };
        thunk(dispatch);
      });
    });
  });

  describe('fetchFolder', () => {
    let dispatchSpy;
    beforeEach(() => {
      mockFetch();
      dispatchSpy = sinon.spy();
    });

    it('should dispatch loading and success actions for fetching folders', () => {
      const response = folderSuccess;
      setFetchJSONResponse(global.fetch.onCall(0), response);
      const thunk = fetchFolder(0, '?page=1&per_page=999&use_cache=false');
      const dispatch = action => {
        dispatchSpy(action);

        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.equal(LOADING_FOLDER);
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            FETCH_FOLDER_SUCCESS,
          );
        }
      };
      thunk(dispatch);
    });

    it('should dispatch error action for fetching folders', () => {
      const response = folderError;
      setFetchJSONFailure(global.fetch.onCall(0), response);
      const thunk = fetchFolder();
      const dispatch = action => {
        dispatchSpy(action);

        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            FETCH_FOLDER_FAILURE,
          );
        }
      };
      thunk(dispatch);
    });
  });

  describe('fetchRecipients', () => {
    let dispatchSpy;
    beforeEach(() => {
      mockFetch();
      dispatchSpy = sinon.spy();
    });

    it('should dispatch loading and success actions for fetching folders', () => {
      const response = recipientSuccess;
      setFetchJSONResponse(global.fetch.onCall(0), response);
      const thunk = fetchRecipients();
      const dispatch = action => {
        dispatchSpy(action);

        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.firstCall.args[0].type).to.equal(
            LOADING_RECIPIENTS,
          );
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            FETCH_RECIPIENTS_SUCCESS,
          );
        }
      };
      thunk(dispatch);
    });

    it('should dispatch error action', () => {
      const response = recipientError;
      setFetchJSONFailure(global.fetch.onCall(0), response);
      const thunk = fetchRecipients();
      const dispatch = action => {
        dispatchSpy(action);

        if (dispatchSpy.callCount === 2) {
          expect(dispatchSpy.secondCall.args[0].type).to.equal(
            FETCH_RECIPIENTS_FAILURE,
          );
        }
      };
      thunk(dispatch);
    });
  });
});
