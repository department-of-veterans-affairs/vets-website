import { expect } from 'chai';

import uploads from '../../reducers/uploads';
import {
  RESET_UPLOADS,
  SET_UPLOADING,
  SET_UPLOADER,
  SET_PROGRESS,
  DONE_UPLOADING,
  SET_UPLOAD_ERROR,
  CANCEL_UPLOAD,
} from '../../actions/types';

describe('Uploads reducer', () => {
  it('should reset uploads state', () => {
    const state = uploads(
      {
        uploading: true,
        progress: 0.5,
        uploadComplete: true,
        uploadError: true,
        uploader: { id: 'test' },
      },
      {
        type: RESET_UPLOADS,
      },
    );

    expect(state.uploading).to.be.false;
    expect(state.progress).to.equal(0);
    expect(state.uploadComplete).to.be.false;
    expect(state.uploadError).to.be.false;
    expect(state.uploader).to.be.null;
  });

  it('set state as uploading', () => {
    const uploader = {};
    const state = uploads(
      {},
      {
        type: SET_UPLOADING,
        uploading: true,
        uploader,
      },
    );

    expect(state.uploading).to.be.true;
    expect(state.uploadError).to.be.false;
    expect(state.uploadComplete).to.be.false;
    expect(state.uploader).to.eql(uploader);
  });

  it('set uploader in state', () => {
    const uploader = {};
    const state = uploads(
      {},
      {
        type: SET_UPLOADER,
        uploader,
      },
    );

    expect(state.uploader).to.eql(uploader);
  });

  it('set upload progress', () => {
    const state = uploads(
      {},
      {
        type: SET_PROGRESS,
        progress: 0.5,
      },
    );

    expect(state.progress).to.equal(0.5);
  });

  it('set upload error', () => {
    const state = uploads(
      {},
      {
        type: SET_UPLOAD_ERROR,
      },
    );

    expect(state.uploading).to.be.false;
    expect(state.uploadError).to.be.true;
    expect(state.uploader).to.be.null;
  });

  it('set upload done', () => {
    const state = uploads(
      {},
      {
        type: DONE_UPLOADING,
      },
    );

    expect(state.uploading).to.be.false;
    expect(state.uploadComplete).to.be.true;
    expect(state.uploader).to.be.null;
  });

  it('cancel upload', () => {
    const state = uploads(
      {},
      {
        type: CANCEL_UPLOAD,
      },
    );

    expect(state.uploading).to.be.false;
    expect(state.uploader).to.be.null;
  });

  it('should return unchanged state for unknown action', () => {
    const initialState = { progress: 0.25, uploading: true };
    const state = uploads(initialState, { type: 'UNKNOWN_ACTION' });

    expect(state).to.equal(initialState);
  });
});
