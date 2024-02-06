import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import { getData, GET_DATA, GET_DATA_SUCCESS } from '../../actions';

const mockData = { user: 'user' };
describe('getData, creator', () => {
  let mockDispatch;
  let clock;

  before(() => {
    mockDispatch = sinon.spy();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });
  it('should dispatch  GET_DATA, GET_DATA_SUCCESS', async () => {
    const firstAction = { type: GET_DATA };
    const seconfAction = { type: GET_DATA_SUCCESS, response: mockData };

    getData()(mockDispatch);
    expect(mockDispatch.calledWith(firstAction)).to.be.true;
    clock.tick(1000);
    await waitFor(() => {
      expect(mockDispatch.calledWith(seconfAction)).to.be.false;
    });
  });
});
