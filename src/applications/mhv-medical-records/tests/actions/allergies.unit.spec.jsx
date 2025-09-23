import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';
import * as cernerSelectors from '~/platform/user/cerner-dsot/selectors';
import {
  clearAllergyDetails,
  getAllergiesList,
  getAllergyDetails,
} from '../../actions/allergies';
import { Actions } from '../../util/actionTypes';
import allergies from '../fixtures/allergies.json';
import allergy from '../fixtures/allergy.json';

describe('Get allergies action with decoupled logic', () => {
  let selectIsCernerPatientStub;

  beforeEach(() => {
    selectIsCernerPatientStub = sinon.stub(
      cernerSelectors,
      'selectIsCernerPatient',
    );
  });

  afterEach(() => {
    selectIsCernerPatientStub.restore();
  });

  it('should use v2 endpoint when isAccelerating is true', () => {
    selectIsCernerPatientStub.returns(false);
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergiesList(false, true)(dispatch, getState).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Allergies.GET_UNIFIED_LIST,
      );
    });
  });

  it('should use OH data path when isCerner is true but not accelerating', () => {
    selectIsCernerPatientStub.returns(true);
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergiesList(false, false)(dispatch, getState).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
  });

  it('should use regular v1 when neither accelerating nor Cerner', () => {
    selectIsCernerPatientStub.returns(false);
    const mockData = allergies;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergiesList(false, false)(dispatch, getState).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.UPDATE_LIST_STATE,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        Actions.Refresh.CLEAR_INITIAL_FHIR_LOAD,
      );
      expect(dispatch.thirdCall.args[0].type).to.equal(
        Actions.Allergies.GET_LIST,
      );
    });
  });

  it('should dispatch an add alert action on error', () => {
    selectIsCernerPatientStub.returns(false);
    const mockData = allergies;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergiesList()(dispatch, getState)
      .then(() => {
        throw new Error('Expected getAllergiesList() to throw an error.');
      })
      .catch(() => {
        expect(typeof dispatch.secondCall.args[0]).to.equal('function');
      });
  });
});

describe('Get allergy details action with decoupled logic', () => {
  let selectIsCernerPatientStub;

  beforeEach(() => {
    selectIsCernerPatientStub = sinon.stub(
      cernerSelectors,
      'selectIsCernerPatient',
    );
  });

  afterEach(() => {
    selectIsCernerPatientStub.restore();
  });

  it('should use v2 endpoint when isAccelerating is true', () => {
    selectIsCernerPatientStub.returns(false);
    const mockData = allergy;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergyDetails('3106', undefined, true)(dispatch, getState).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          Actions.Allergies.GET_UNIFIED_ITEM,
        );
      },
    );
  });

  it('should use regular v1 when isCerner is true but not accelerating', () => {
    selectIsCernerPatientStub.returns(true);
    const mockData = allergy;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergyDetails('3106', undefined, false)(dispatch, getState).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(Actions.Allergies.GET);
      },
    );
  });

  it('should use regular v1 when neither accelerating nor Cerner', () => {
    selectIsCernerPatientStub.returns(false);
    const mockData = allergy;
    mockApiRequest(mockData);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergyDetails('3106', undefined, false)(dispatch, getState).then(
      () => {
        expect(dispatch.firstCall.args[0].type).to.equal(Actions.Allergies.GET);
      },
    );
  });

  it('should dispatch a get details action and pull from the list argument', () => {
    selectIsCernerPatientStub.returns(false);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergyDetails('1', [{ id: '1' }], false)(
      dispatch,
      getState,
    ).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.GET_FROM_LIST,
      );
    });
  });

  it('should dispatch an add alert action on error', () => {
    selectIsCernerPatientStub.returns(false);
    const mockData = allergy;
    mockApiRequest(mockData, false);
    const dispatch = sinon.spy();
    const getState = sinon.stub().returns({});

    return getAllergyDetails('3106', undefined, false)(dispatch, getState)
      .then(() => {
        throw new Error('Expected getAllergyDetails() to throw an error.');
      })
      .catch(() => {
        expect(typeof dispatch.firstCall.args[0]).to.equal('function');
      });
  });
});

describe('Clear allergy details action', () => {
  it('should dispatch a clear details action', () => {
    const dispatch = sinon.spy();
    return clearAllergyDetails()(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Allergies.CLEAR_DETAIL,
      );
    });
  });
});
