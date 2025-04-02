import sinon from 'sinon';
import { expect } from 'chai';
import { activityMiddleware } from '../../middleware/activityMiddleware';

describe('activityMiddleware', () => {
  it('should call recordEvent and next when card is a decision letter', () => {
    const next = sinon.stub();
    const card = { activity: { type: 'trace' } };
    const result = activityMiddleware()(next)(card);
    expect(result).to.be.false;
    expect(next.called).to.be.false;
  });
  it('should call next with card if card activity type is not trace', () => {
    const next = sinon.stub();
    const card = { activity: { type: 'not_trace' } };
    activityMiddleware()(next)(card);
    expect(next.calledWith(card)).to.be.true;
  });
});
