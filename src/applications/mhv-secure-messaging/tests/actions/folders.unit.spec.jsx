import {
  mockApiRequest,
  mockFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { expect } from 'chai';
import { Actions } from '../../util/actionTypes';
import * as foldersListResponse from '../e2e/fixtures/folder-response.json';
import * as folderInboxResponse from '../e2e/fixtures/folder-inbox-response.json';
import * as folderDeletedResponse from '../e2e/fixtures/trashResponse/folder-deleted-metadata.json';
import * as newFolderResponse from '../e2e/fixtures/customResponse/created-folder-response.json';
import {
  clearFolder,
  delFolder,
  getFolders,
  newFolder,
  renameFolder,
  retrieveFolder,
} from '../../actions/folders';
import * as Constants from '../../util/constants';
import * as apiCalls from '../../api/SmApi';

describe('folders actions', () => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  const initialState = {
    sm: {
      app: undefined,
    },
  };
  const isPilotState = {
    sm: {
      app: {
        isPilot: true,
      },
    },
  };

  const errorResponse = {
    errors: [
      {
        title: 'Service unavailable',
        detail: 'Backend Service Outage',
        code: '503',
        status: '503',
      },
    ],
  };
  const folderExistsResponse = {
    errors: [
      {
        title: 'Operation failed',
        detail: 'The folder already exists with the requested name',
        code: 'SM126',
        status: '422',
      },
    ],
  };

  let sinonSandbox;

  beforeEach(() => {
    sinonSandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  it('should dispatch response on getFolders action', async () => {
    mockApiRequest(foldersListResponse);
    const store = mockStore(initialState);
    await store.dispatch(getFolders()).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.GET_LIST,
        response: foldersListResponse,
      });
    });
  });

  it('should call getFolderList with arg true when isPilot', async () => {
    mockApiRequest(foldersListResponse);
    const store = mockStore(isPilotState);
    const getFolderListSpy = sinonSandbox.spy(apiCalls, 'getFolderList');
    await store.dispatch(getFolders()).then(() => {
      expect(getFolderListSpy.calledWith(true)).to.be.true;
    });
  });

  it('should dispatch error on unsuccessful getFolders action', async () => {
    mockApiRequest({ ...errorResponse, status: 503 });
    const store = mockStore();
    await store.dispatch(getFolders()).then(() => {
      const err = errorResponse.errors[0];
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: err.title,
          content: err.detail,
          response: err,
        },
      });
    });
  });

  it('should dispatch response on retrieveFolder action', async () => {
    mockApiRequest(folderInboxResponse);
    const store = mockStore();

    await store.dispatch(retrieveFolder(0)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.GET,
        response: folderInboxResponse,
      });
    });
  });

  it('should call getFolder with arg true when isPilot', async () => {
    mockApiRequest(folderInboxResponse);
    const store = mockStore(isPilotState);
    const getFolderSpy = sinonSandbox.spy(apiCalls, 'getFolder');
    await store.dispatch(retrieveFolder(0)).then(() => {
      expect(getFolderSpy.calledWith({ folderId: 0, isPilot: true })).to.be
        .true;
    });
  });

  it('should dispatch an error on unsuccessful retrieveFolder action', async () => {
    mockApiRequest({ ...errorResponse, status: 503 });
    const store = mockStore();

    await store.dispatch(retrieveFolder(0)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.GET,
        response: null,
      });
    });
  });

  it('should dispatch response on retrieveFolder action for DELETED folder', async () => {
    mockApiRequest(folderDeletedResponse);
    const store = mockStore();
    expect(folderDeletedResponse.data.attributes.name).to.equal('Deleted');
    await store.dispatch(retrieveFolder(0)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.GET,
        response: folderDeletedResponse,
      });
      expect(store.getActions()[0].response.data.attributes.name).to.equal(
        'Trash',
      );
    });
  });

  it('should dispatch response on clearFolder action', async () => {
    const store = mockStore();

    await store.dispatch(clearFolder()).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.CLEAR,
      });
    });
  });

  it('should dispatch response on successful newFolder action', async () => {
    const store = mockStore();
    mockApiRequest(newFolderResponse);
    const newFolderName = 'New folder name';
    await store.dispatch(newFolder(newFolderName)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.CREATE,
        response: newFolderResponse,
      });
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'success',
          header: '',
          content: Constants.Alerts.Folder.CREATE_FOLDER_SUCCESS,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch error on newFolder action if name exists', async () => {
    const store = mockStore();

    mockFetch({ ...folderExistsResponse }, false);
    const newFolderName = 'New folder name';
    await store.dispatch(newFolder(newFolderName)).catch(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Folder.FOLDER_NAME_TAKEN,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch error on newFolder unsuccessful action', async () => {
    const store = mockStore();

    mockFetch({ ...errorResponse }, false);
    const newFolderName = 'New folder name';
    await store.dispatch(newFolder(newFolderName)).catch(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Folder.CREATE_FOLDER_ERROR,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch response on successful delFolder action', async () => {
    const store = mockStore();
    mockApiRequest({ method: 'DELETE', status: 204, ok: true });
    await store.dispatch(delFolder(1234)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Folder.DELETE,
      });
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'success',
          header: '',
          content: Constants.Alerts.Folder.DELETE_FOLDER_SUCCESS,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch error on delFolder ubsuccessful action', async () => {
    const store = mockStore();

    mockFetch({ ...errorResponse }, false);
    await store.dispatch(delFolder(1234)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Folder.DELETE_FOLDER_ERROR,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch response on successful renameFolder action', async () => {
    const store = mockStore();
    mockApiRequest(newFolderResponse);
    const newFolderName = 'New folder name';
    await store.dispatch(renameFolder(1234, newFolderName)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'success',
          header: '',
          content: Constants.Alerts.Folder.RENAME_FOLDER_SUCCESS,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch error on renameFolder action if name exists', async () => {
    const store = mockStore();

    mockFetch({ ...folderExistsResponse }, false);
    const newFolderName = 'New folder name';
    await store.dispatch(renameFolder(1234, newFolderName)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: 'error',
          header: '',
          content: Constants.Alerts.Folder.FOLDER_NAME_TAKEN,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });

  it('should dispatch error on renameFolder unsuccessful action', async () => {
    const store = mockStore();

    mockFetch({ ...errorResponse }, false);
    const newFolderName = 'New folder name';
    await store.dispatch(renameFolder(1234, newFolderName)).then(() => {
      expect(store.getActions()).to.deep.include({
        type: Actions.Alerts.ADD_ALERT,
        payload: {
          alertType: Constants.ALERT_TYPE_ERROR,
          header: '',
          content: Constants.Alerts.Folder.RENAME_FOLDER_ERROR,
          className: undefined,
          link: undefined,
          title: undefined,
          response: undefined,
        },
      });
    });
  });
});
