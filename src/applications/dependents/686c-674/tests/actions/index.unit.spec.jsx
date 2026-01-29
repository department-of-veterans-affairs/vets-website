import { expect } from 'chai';
import sinon from 'sinon';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import {
  VERIFY_VA_FILE_NUMBER_SUCCEEDED,
  VERIFY_VA_FILE_NUMBER_FAILED,
  verifyVaFileNumber,
} from '../../actions';

describe('Verify VA file number actions: verifyVaFileNumber', () => {
  it('should fetch a va file number', () => {
    const verified = {
      attributes: {
        validVAFileNumber: true,
      },
    };

    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/profile/valid_va_file_number`,
        () => {
          return jsonResponse(verified, { status: 200 });
        },
      ),
    );

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
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/profile/valid_va_file_number`,
        () => {
          return jsonResponse(response, { status: 401 });
        },
      ),
    );
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
