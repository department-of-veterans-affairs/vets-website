import { expect } from 'chai';
import sinon from 'sinon';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
  VERIFY_VA_FILE_NUMBER_SUCCEEDED,
  VERIFY_VA_FILE_NUMBER_FAILED,
  verifyVaFileNumber,
} from '../../actions';

describe('Verify VA file number actions: verifyVaFileNumber', () => {
  const server = setupServer();

  before(() => {
    server.listen();
  });

  after(() => {
    server.close();
  });

  it('should fetch a va file number', () => {
    const verified = {
      attributes: {
        validVAFileNumber: true,
      },
    };

    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/profile/valid_va_file_number`,
        (_, res, ctx) => {
          return res(ctx.status(200), ctx.json(verified));
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
      rest.get(
        `https://dev-api.va.gov/v0/profile/valid_va_file_number`,
        (_, res, ctx) => {
          return res(ctx.status(401), ctx.json(response));
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
