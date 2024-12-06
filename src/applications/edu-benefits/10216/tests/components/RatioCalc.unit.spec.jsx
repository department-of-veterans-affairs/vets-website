import { expect } from 'chai';
import sinon from 'sinon';
import { gaRatioCalculationText } from '../../components/RatioCalc';

describe('gaRatioCalculationText', () => {
  let pushSpy;

  beforeEach(() => {
    pushSpy = sinon.spy();
    window.dataLayer = {
      push: pushSpy,
    };
  });

  it('should push the correct event to dataLayer', () => {
    gaRatioCalculationText();
    expect(pushSpy.calledOnce).to.be.true;
    expect(
      pushSpy.calledWith({
        event: 'edu-0994--form-help-text-clicked',
        'help-text-label': 'How is this calculated?',
      }),
    ).to.be.true;
  });
});
