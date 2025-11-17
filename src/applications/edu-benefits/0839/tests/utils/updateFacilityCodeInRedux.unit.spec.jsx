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

  it('should not dispatch when index is null', () => {
    updateFacilityCodeInRedux(dispatchStub, {}, null, '12345678');

    expect(dispatchStub.called).to.be.false;
    expect(setDataStub.called).to.be.false;
  });

  it('should not dispatch when facility code is unchanged', () => {
    const formData = {
      additionalInstitutionDetails: [{ facilityCode: '12345678' }],
    };

    updateFacilityCodeInRedux(dispatchStub, formData, 0, '12345678');

    expect(dispatchStub.called).to.be.false;
    expect(setDataStub.called).to.be.false;
    expect(formData.additionalInstitutionDetails[0].facilityCode).to.equal(
      '12345678',
    );
  });

  it('should not dispatch when array is empty and value is empty', () => {
    const formData = {};

    updateFacilityCodeInRedux(dispatchStub, formData, 0, '');

    expect(dispatchStub.called).to.be.false;
    expect(setDataStub.called).to.be.false;
  });

  it('should dispatch setData when updating to a new facility code', () => {
    const formData = {
      additionalInstitutionDetails: [],
      otherField: 'untouched',
    };

    updateFacilityCodeInRedux(dispatchStub, formData, 0, '87654321');

    expect(setDataStub.calledOnce).to.be.true;

    const payload = setDataStub.firstCall.args[0];
    expect(payload).to.deep.equal({
      ...formData,
      additionalInstitutionDetails: [{ facilityCode: '87654321' }],
    });

    expect(dispatchStub.calledOnce).to.be.true;
    expect(dispatchStub.firstCall.args[0]).to.deep.equal({
      type: 'SET_DATA',
      payload,
    });
  });

  it('should normalize empty string to undefined and preserve other fields', () => {
    const formData = {
      additionalInstitutionDetails: [
        { facilityCode: '99999999', extraField: 'extra' },
      ],
    };

    updateFacilityCodeInRedux(dispatchStub, formData, 0, '');

    expect(setDataStub.calledOnce).to.be.true;

    const payload = setDataStub.firstCall.args[0];
    expect(payload.additionalInstitutionDetails[0]).to.deep.equal({
      facilityCode: undefined,
      extraField: 'extra',
    });

    expect(formData.additionalInstitutionDetails[0].facilityCode).to.equal(
      '99999999',
    );

    expect(dispatchStub.calledOnce).to.be.true;
    expect(dispatchStub.firstCall.args[0]).to.deep.equal({
      type: 'SET_DATA',
      payload,
    });
  });
});
