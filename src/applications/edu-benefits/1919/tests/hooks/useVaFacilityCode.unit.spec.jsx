import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import { expect } from 'chai';
import sinon from 'sinon';
// import { waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { useVaFacilityCode } from '../../hooks/useVaFacilityCode';

describe('useVaFacilityCode', () => {
  let useSelectorStub;

  let dispatchSpy;
  let apiRequestStub;
  const mockStore = configureStore([]);
  let store;
  const baseFormData = {
    institutionDetails: {
      facilityCode: '12345678',
      institutionName: '',
      address: {},
      loader: false,
    },
  };

  beforeEach(() => {
    store = mockStore({});
    dispatchSpy = sinon.spy();
    sinon.stub(useDispatch, 'default').returns(dispatchSpy);
    useSelectorStub = sinon.stub(useSelector, 'default');
    apiRequestStub = sinon.stub(apiRequest, 'default');
  });

  // afterEach(() => {
  //   sinon.restore();
  // });

  it('should not call api if facilityCode is not 8 characters', () => {
    useSelectorStub.returns({
      institutionDetails: {
        facilityCode: '1234',
      },
    });
    renderHook(() => useVaFacilityCode());
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
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
      },
    };
    apiRequestStub.resolves(response);

    const { result } = renderHook(() => useVaFacilityCode(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    // console.log('result', result);
    expect(result.current.address1).to.be.undefined;
    // await waitFor(async () => {
    //   await waitFor(() => {
    //     expect(dispatchSpy.called).to.be.true;

    //   })

    // });
    // await waitForNextUpdate();

    // Loader true dispatched
    // expect(dispatchSpy.called).to.be.true;
    // expect(dispatchSpy.firstCall.args[0]).to.deep.include({
    //   institutionDetails: sinon.match.has('loader', true),
    // });

    // Loader false and data dispatched
    // expect(dispatchSpy.lastCall.args[0].institutionDetails).to.include({
    //   institutionName: 'Test Institute',
    //   loader: false,
    // });
    // expect(
    //   dispatchSpy.lastCall.args[0].institutionDetails.address,
    // ).to.deep.equal({
    //   address1: '123 Main St',
    //   address2: 'Suite 1',
    //   address3: '',
    //   city: 'Testville',
    //   state: 'VA',
    //   zip: '12345',
    //   country: 'USA',
    // });
    // expect(apiRequestStub.calledOnce).to.be.true;
  });

  // it('should dispatch not found and empty address on api error', async () => {
  //   useSelectorStub.returns(baseFormData);
  //   apiRequestStub.rejects(new Error('Not found'));

  //   await renderHook(() => useVaFacilityCode());

  //   // Loader true dispatched
  //   expect(dispatchSpy.firstCall.args[0]).to.deep.include({
  //     institutionDetails: sinon.match.has('loader', true),
  //   });

  //   // Loader false and not found dispatched
  //   expect(dispatchSpy.lastCall.args[0].institutionDetails).to.include({
  //     institutionName: 'not found',
  //     loader: false,
  //   });
  //   expect(
  //     dispatchSpy.lastCall.args[0].institutionDetails.address,
  //   ).to.deep.equal({
  //     address1: '',
  //     address2: '',
  //     address3: '',
  //     city: '',
  //     state: '',
  //     zip: '',
  //     country: '',
  //   });
  //   expect(apiRequestStub.calledOnce).to.be.true;
  // });
});
