import { expect } from 'chai';
import sinon from 'sinon';

import pageConfig from '../../../../config/chapters/05-financial-information/netWorthEstimationFormNeeded';
import * as helpers from '../../../../helpers';

describe('NetWorthEstimationFormNeeded page depends', () => {
  let netWorthEstimateIsOverThresholdStub;

  beforeEach(() => {
    netWorthEstimateIsOverThresholdStub = sinon.stub(
      helpers,
      'netWorthEstimateIsOverThreshold',
    );
  });

  afterEach(() => {
    netWorthEstimateIsOverThresholdStub.restore();
  });

  it('returns true when totalNetWorth is true (short-circuits helper)', () => {
    netWorthEstimateIsOverThresholdStub.returns(false);

    const formData = { totalNetWorth: true };

    const result = pageConfig.depends(formData);

    expect(result).to.be.true;
    expect(netWorthEstimateIsOverThresholdStub.called).to.be.false;
  });

  it('returns false when totalNetWorth is false and netWorthEstimateIsOverThreshold returns false', () => {
    netWorthEstimateIsOverThresholdStub.returns(false);

    const formData = { totalNetWorth: false };

    const result = pageConfig.depends(formData);

    expect(result).to.be.false;
    expect(netWorthEstimateIsOverThresholdStub.calledOnce).to.be.true;
    expect(netWorthEstimateIsOverThresholdStub.firstCall.args[0]).to.equal(
      formData,
    );
  });

  it('returns true when totalNetWorth is false and netWorthEstimateIsOverThreshold returns true', () => {
    netWorthEstimateIsOverThresholdStub.returns(true);

    const formData = { totalNetWorth: false };

    const result = pageConfig.depends(formData);

    expect(result).to.be.true;
    expect(netWorthEstimateIsOverThresholdStub.calledOnce).to.be.true;
    expect(netWorthEstimateIsOverThresholdStub.firstCall.args[0]).to.equal(
      formData,
    );
  });

  it('treats missing totalNetWorth as falsy and evaluates helper', () => {
    netWorthEstimateIsOverThresholdStub.returns(true);

    const formData = {};

    const result = pageConfig.depends(formData);

    expect(result).to.be.true;
    expect(netWorthEstimateIsOverThresholdStub.calledOnce).to.be.true;
  });
});
