import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useDispatch, useSelector, Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { apiRequest } from 'platform/utilities/api';
import { expect } from 'chai';
import sinon from 'sinon';
import { useVaFacilityCode } from '../../hooks/useVaFacilityCode';

describe('useVaFacilityCode', () => {
  let useSelectorStub;
  let useDispatchStub;

  let dispatchSpy;
  let apiRequestStub;

  const baseFormData = {
    institutionDetails: {
      facilityCode: '12345678',
      institutionName: '',
      address: {},
      loader: false,
    },
  };

  const mockStore = configureStore([]);
  let store;

  beforeEach(() => {
    dispatchSpy = sinon.spy();
    useDispatchStub = sinon.stub(useDispatch, 'default').returns(dispatchSpy);
    useSelectorStub = sinon.stub(useSelector, 'default');
    apiRequestStub = sinon.stub(apiRequest, 'default');
    store = mockStore({});
  });

  // afterEach(() => {
  //   sinon.restore();
  // });

  it('should not call api or dispatch if facilityCode is not 8 chars', () => {
    useSelectorStub.returns({
      institutionDetails: {
        facilityCode: '1234',
      },
    });
    renderHook(() => useVaFacilityCode(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(apiRequestStub.called).to.be.false;
    expect(dispatchSpy.called).to.be.false;
  });

  it('should dispatch loader true and fetch institution data when facilityCode is 8 chars', async () => {
    useSelectorStub.returns(baseFormData);
    const response = {
      data: {
        attributes: {
          name: 'Test Institute',
          address1: '123 Main St',
          address2: 'Suite 1',
          address3: '',
          city: 'Testville',
          country: 'USA',
        },
      },
    };
    apiRequestStub.resolves(response);

    const { result } = renderHook(() => useVaFacilityCode(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    console.log('resulttttttt', result);
    expect(result.current.address1).to.be.undefined;
  

    // Wait for the dispatch to be called after the effect runs
    await waitFor(() => {
      expect(dispatchSpy.called).to.be.true;
    });

    // Loader true dispatched
    expect(dispatchSpy.called).to.be.true;
    expect(dispatchSpy.firstCall.args[0]).to.deep.include({
      institutionDetails: sinon.match.has('loader', true),
    });

    // Loader false and data dispatched
    expect(dispatchSpy.lastCall.args[0].institutionDetails).to.include({
      institutionName: 'Test Institute',
      loader: false,
    });
    expect(
      dispatchSpy.lastCall.args[0].institutionDetails.address,
    ).to.deep.equal({
      address1: '123 Main St',
      address2: 'Suite 1',
      address3: '',
      city: 'Testville',
      country: 'USA',
    });
    expect(apiRequestStub.calledOnce).to.be.true;
  });

  it('should dispatch not found and empty address on api error', async () => {
    useSelectorStub.returns(baseFormData);
    apiRequestStub.rejects(new Error('Not found'));
    renderHook(() => useVaFacilityCode());
    await renderHook(() => useVaFacilityCode());

    // Loader true dispatched
    expect(dispatchSpy.firstCall.args[0]).to.deep.include({
      institutionDetails: sinon.match.has('loader', true),
    });

    // Loader false and not found dispatched
    expect(dispatchSpy.lastCall.args[0].institutionDetails).to.include({
      institutionName: 'not found',
      loader: false,
    });
    expect(
      dispatchSpy.lastCall.args[0].institutionDetails.address,
    ).to.deep.equal({
      address1: '',
      address2: '',
      address3: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    });
    expect(apiRequestStub.calledOnce).to.be.true;
  });
});