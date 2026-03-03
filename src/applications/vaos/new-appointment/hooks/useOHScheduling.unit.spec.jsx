import { expect } from 'chai';
import sinon from 'sinon';
import * as redux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { useOHScheduling } from './useOHScheduling';
import * as selectors from '../redux/selectors';

describe('VAOS Hook: useOHScheduling', () => {
  let sandbox;
  let useSelectorStub;
  let getTypeOfCareStub;
  let originalNodeEnv;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    useSelectorStub = sandbox.stub(redux, 'useSelector');
    getTypeOfCareStub = sandbox.stub(selectors, 'getTypeOfCare');
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    sandbox.restore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should return false when feature flag is disabled', () => {
    process.env.NODE_ENV = 'production';
    useSelectorStub.onCall(0).returns(false); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should return true in staging environment regardless of typeOfCare', () => {
    process.env.NODE_ENV = 'staging';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'primaryCare' }); // Not in OH_ENABLED_TYPES_OF_CARE

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });

  it('should return false when typeOfCare is not in OH_ENABLED_TYPES_OF_CARE in production', () => {
    process.env.NODE_ENV = 'production';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'primaryCare' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should return true when feature flag is enabled and typeOfCare is foodAndNutrition in production', () => {
    process.env.NODE_ENV = 'production';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });

  it('should return true when feature flag is enabled and typeOfCare is clinicalPharmacyPrimaryCare in production', () => {
    process.env.NODE_ENV = 'production';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'clinicalPharmacyPrimaryCare' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });

  it('should return false when typeOfCare is undefined in production', () => {
    process.env.NODE_ENV = 'production';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns(undefined);

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should return false when typeOfCare.idV2 is undefined in production', () => {
    process.env.NODE_ENV = 'production';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: undefined });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should call getTypeOfCare with the form data in production', () => {
    process.env.NODE_ENV = 'production';
    const mockData = { typeOfCareId: '123' };
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns(mockData); // getFormData
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    renderHook(() => useOHScheduling());

    expect(getTypeOfCareStub.calledWith(mockData)).to.be.true;
  });

  it('should return true in staging even when typeOfCare is undefined', () => {
    process.env.NODE_ENV = 'staging';
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns(undefined);

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });
});
