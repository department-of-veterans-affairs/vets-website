import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import * as apiModule from 'platform/utilities/api';
import * as actions from 'platform/forms-system/src/js/actions';
import * as redux from 'react-redux';
import sinon from 'sinon';
import { expect } from 'chai';
import { useValidateFacilityCode } from '../../hooks/useValidateFacilityCode';
import apiSuccessResponse from '../fixtures/mocks/institution-facility-code-success1.json';

const buildFormData = (details = { facilityCode: '' }) => ({
  primaryInstitutionDetails: {
    ...details,
  },
});

describe('useFetchedData', () => {
  let apiRequestStub;
  let setDataStub;
  let useDispatchStub;
  let dispatchStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    dispatchStub = sinon.spy();
    useDispatchStub = sinon.stub(redux, 'useDispatch').returns(dispatchStub);
    setDataStub = sinon.stub(actions, 'setData');
    setDataStub.returns({ type: 'SET_DATA' });
  });

  afterEach(() => {
    apiRequestStub.restore();
    dispatchStub.reset();
    useDispatchStub.restore();
    setDataStub.restore();
  });

  it('returns the right data on initialization', async () => {
    const { result } = renderHook(() =>
      useValidateFacilityCode(buildFormData(), 'primaryInstitutionDetails'),
    );

    const { loading, hasError } = result.current;

    expect(loading).to.eq(false);
    expect(hasError).to.eq(false);
    expect(dispatchStub.callCount).to.eq(1);
    expect(setDataStub.callCount).to.eq(1);
    expect(apiRequestStub.callCount).to.eq(0);
    expect(setDataStub.firstCall.args[0]).to.deep.equal({
      primaryInstitutionDetails: {
        facilityCode: '',
        name: '',
        failedToLoad: false,
      },
    });
  });

  it('dispatches when data is fetched successfully', async () => {
    apiRequestStub.resolves(apiSuccessResponse);

    const { result } = renderHook(() =>
      useValidateFacilityCode(
        buildFormData({ facilityCode: '12345678' }),
        'primaryInstitutionDetails',
      ),
    );

    let { loading, hasError } = result.current;
    expect(loading).to.eq(true);
    expect(hasError).to.eq(false);

    await waitFor(() => result.current.loading === false);

    ({ loading, hasError } = result.current);
    expect(loading).to.eq(false);
    expect(hasError).to.eq(false);
    expect(dispatchStub.callCount).to.eq(1);
    expect(setDataStub.callCount).to.eq(1);
    expect(apiRequestStub.callCount).to.eq(1);

    const {
      name,
      type,
      mailingAddress,
      failedToLoad,
    } = setDataStub.firstCall.args[0].primaryInstitutionDetails;
    expect(name).to.eq('ARIZONA WESTERN COLLEGE 1');
    expect(type).to.eq('PUBLIC');
    expect(mailingAddress.street).to.eq('PO BOX 929');
    expect(failedToLoad).to.eq(false);
  });

  it('dispatches when data is not fetched successfully', async () => {
    apiRequestStub.throws(new Error('Failed'));

    const { result } = renderHook(() =>
      useValidateFacilityCode(
        buildFormData({ facilityCode: '12345678' }),
        'primaryInstitutionDetails',
      ),
    );

    const { hasError } = result.current;
    expect(hasError).to.eq(true);
    expect(dispatchStub.callCount).to.eq(1);
    expect(setDataStub.callCount).to.eq(1);
    expect(apiRequestStub.callCount).to.eq(1);

    expect(setDataStub.firstCall.args[0]).to.deep.equal({
      primaryInstitutionDetails: {
        facilityCode: '12345678',
        name: '',
        failedToLoad: true,
      },
    });
  });
});
