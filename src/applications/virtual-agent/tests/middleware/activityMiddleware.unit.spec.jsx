import sinon from 'sinon';
import { expect } from 'chai';
import { activityMiddleware } from '../../middleware/activityMiddleware';
import DisclaimerActivity from '../../components/activities/DisclaimerActivity';

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

  it('intercepts AI disclaimer activity and returns a renderer for DisclaimerActivity', () => {
    const next = sinon.stub();
    const card = {
      activity: {
        type: 'message',
        id: 'act-123',
        text: 'Use AI responsibly.',
        channelData: { isDisclaimer: true, category: 'ai-disclaimer' },
      },
    };

    const mw = activityMiddleware();
    const renderer = mw(next)(card);

    // Should NOT call next for intercepted disclaimer
    expect(next.called).to.be.false;
    expect(renderer).to.be.a('function');
    // Invoke renderer (no args) to get the React element without DOM rendering
    const element = renderer();
    expect(element).to.exist;
    expect(element.type).to.equal(DisclaimerActivity);
    expect(element.props.text).to.equal('Use AI responsibly.');
    expect(element.props.className).to.equal('va-webchat-ai-disclaimer');
  });

  it('does not intercept if only isDisclaimer flag set but category differs', () => {
    const sentinel = () => 'original';
    const next = sinon.stub().returns(sentinel);
    const card = {
      activity: {
        type: 'message',
        text: 'Almost',
        channelData: { isDisclaimer: true, category: 'other' },
      },
    };
    const result = activityMiddleware()(next)(card);
    expect(next.calledOnce).to.be.true;
    expect(next.calledWithExactly(card)).to.be.true;
    expect(result).to.equal(sentinel);
  });

  it('does not intercept if category matches but isDisclaimer flag missing', () => {
    const sentinel = () => 'original';
    const next = sinon.stub().returns(sentinel);
    const card = {
      activity: {
        type: 'message',
        text: 'Category only',
        channelData: { category: 'ai-disclaimer' },
      },
    };
    const result = activityMiddleware()(next)(card);
    expect(next.calledWithExactly(card)).to.be.true;
    expect(result).to.equal(sentinel);
  });
});
