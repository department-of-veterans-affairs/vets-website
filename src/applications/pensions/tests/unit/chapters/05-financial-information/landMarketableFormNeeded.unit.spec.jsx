import { expect } from 'chai';
import sinon from 'sinon';

import pageConfig from '../../../../config/chapters/05-financial-information/landMarketableFormNeeded'; // update path
import * as helpers from '../../../../helpers';

describe('LandMarketableFormNeeded page depends', () => {
  let isHomeAcreageMoreThanTwoStub;

  beforeEach(() => {
    isHomeAcreageMoreThanTwoStub = sinon.stub(
      helpers,
      'isHomeAcreageMoreThanTwo',
    );
  });

  afterEach(() => {
    isHomeAcreageMoreThanTwoStub.restore();
  });

  it('returns true when acreage is over two AND landMarketable is true', () => {
    isHomeAcreageMoreThanTwoStub.returns(true);

    const formData = { landMarketable: true };

    const result = pageConfig.depends(formData);

    expect(result).to.be.true;
    expect(isHomeAcreageMoreThanTwoStub.calledOnce).to.be.true;
    expect(isHomeAcreageMoreThanTwoStub.firstCall.args[0]).to.equal(formData);
  });

  it('returns false when acreage is over two but landMarketable is false', () => {
    isHomeAcreageMoreThanTwoStub.returns(true);

    const formData = { landMarketable: false };

    const result = pageConfig.depends(formData);

    expect(result).to.be.false;
    expect(isHomeAcreageMoreThanTwoStub.calledOnce).to.be.true;
  });

  it('returns false when acreage is NOT over two (short-circuits before checking landMarketable)', () => {
    isHomeAcreageMoreThanTwoStub.returns(false);

    const formData = { landMarketable: true };

    const result = pageConfig.depends(formData);

    expect(result).to.be.false;
    expect(isHomeAcreageMoreThanTwoStub.calledOnce).to.be.true;
  });

  it('returns false when both acreage check is false and landMarketable is false', () => {
    isHomeAcreageMoreThanTwoStub.returns(false);

    const formData = { landMarketable: false };

    const result = pageConfig.depends(formData);

    expect(result).to.be.false;
    expect(isHomeAcreageMoreThanTwoStub.calledOnce).to.be.true;
  });
});
