import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch } from 'platform/testing/unit/helpers';
import {
  VERIFY_VA_FILE_NUMBER_SUCCEEDED,
  VERIFY_VA_FILE_NUMBER_FAILED,
  verifyVaFileNumber,
} from '../../actions';

describe('Verify VA file number actions: verifyVaFileNumber', () => {
  beforeEach(() => mockFetch());

  it('should fetch a va file number', () => {
    const verified = {
      attributes: {
        code: 200,
        hasNumber: true,
      },
    };

    global.fetch.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(verified) }),
      }),
    });

    const thunk = verifyVaFileNumber();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          VERIFY_VA_FILE_NUMBER_SUCCEEDED,
        );
      }
    };
    thunk(dispatch);
  });
  it('should handle an error', () => {
    const response = {
      errors: [
        {
          code: 404,
          msg: 'error',
        },
      ],
    };
    global.fetch.returns({
      catch: () => ({
        then: fn => fn({ ok: true, json: () => Promise.resolve(response) }),
      }),
    });
    const thunk = verifyVaFileNumber();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          VERIFY_VA_FILE_NUMBER_FAILED,
        );
      }
    };
    thunk(dispatch);
  });
});
