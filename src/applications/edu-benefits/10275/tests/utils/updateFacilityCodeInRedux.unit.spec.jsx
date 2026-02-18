import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from 'platform/forms-system/src/js/actions';
import { updateFacilityCodeInRedux } from '../../utils/updateFacilityCodeInRedux';

describe('updateFacilityCodeInRedux', () => {
  let dispatchStub;
  let setDataStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    setDataStub = sinon.stub(actions, 'setData');
    setDataStub.callsFake(data => ({ type: 'SET_DATA', payload: data }));
  });

  afterEach(() => {
    setDataStub.restore();
  });

  it('should bail when index is null', () => {
    updateFacilityCodeInRedux(dispatchStub, {}, null, '12345678');

    expect(dispatchStub.called).to.be.false;
    expect(setDataStub.called).to.be.false;
  });

  it('should bail when facility code is unchanged', () => {
    const formData = {
      additionalLocations: [{ facilityCode: '12345678' }],
    };

    updateFacilityCodeInRedux(dispatchStub, formData, 0, '12345678');

    expect(dispatchStub.called).to.be.false;
    expect(setDataStub.called).to.be.false;
  });

  it('should bail when array is empty and value is empty', () => {
    updateFacilityCodeInRedux(dispatchStub, {}, 0, '');

    expect(dispatchStub.called).to.be.false;
    expect(setDataStub.called).to.be.false;
  });

  it('should dispatch setData when updating to a new facility code', () => {
    const formData = {
      additionalLocations: [{ facilityCode: '99999999', extra: 'value' }],
      untouchedField: 'stay',
    };

    updateFacilityCodeInRedux(dispatchStub, formData, 0, '87654321');

    expect(setDataStub.calledOnce).to.be.true;
    const payload = setDataStub.firstCall.args[0];
    expect(payload).to.deep.equal({
      ...formData,
      additionalLocations: [{ facilityCode: '87654321', extra: 'value' }],
    });

    expect(dispatchStub.calledOnce).to.be.true;
    expect(dispatchStub.firstCall.args[0]).to.deep.equal({
      type: 'SET_DATA',
      payload,
    });
    expect(formData.additionalLocations[0].facilityCode).to.equal('99999999');
  });
});
