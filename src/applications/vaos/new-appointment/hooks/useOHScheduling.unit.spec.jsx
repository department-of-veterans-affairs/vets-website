import { expect } from 'chai';
import sinon from 'sinon';
import * as redux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import ENVIRONMENTS from 'site/constants/environments';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';
import { useOHScheduling } from './useOHScheduling';
import * as selectors from '../redux/selectors';

describe('VAOS Hook: useOHScheduling', () => {
  let sandbox;
  let useSelectorStub;
  let getTypeOfCareStub;
  let envConfig;
  let originalBuildtype;

  const setEnvironment = buildtype => {
    envConfig.BUILDTYPE = buildtype;
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    useSelectorStub = sandbox.stub(redux, 'useSelector');
    getTypeOfCareStub = sandbox.stub(selectors, 'getTypeOfCare');
    // The frozen environment export references a mutable config object via
    // closure. Mutating BUILDTYPE here controls environment.isStaging() and
    // environment.isProduction() without needing to stub the frozen export.
    envConfig = ENVIRONMENT_CONFIGURATIONS[global.__BUILDTYPE__];
    originalBuildtype = envConfig.BUILDTYPE;
  });

  afterEach(() => {
    sandbox.restore();
    envConfig.BUILDTYPE = originalBuildtype;
  });

  it('should return false when feature flag is disabled', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    useSelectorStub.onCall(0).returns(false); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should return true in staging environment regardless of typeOfCare', () => {
    setEnvironment(ENVIRONMENTS.VAGOVSTAGING);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'primaryCare' }); // Not in OH_ENABLED_TYPES_OF_CARE

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });

  it('should return false when typeOfCare is not in OH_ENABLED_TYPES_OF_CARE in production', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'primaryCare' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should return true when feature flag is enabled and typeOfCare is foodAndNutrition in production', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });

  it('should return true when feature flag is enabled and typeOfCare is clinicalPharmacyPrimaryCare in production', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: 'clinicalPharmacyPrimaryCare' });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });

  it('should return false when typeOfCare is undefined in production', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns(undefined);

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should return false when typeOfCare.idV2 is undefined in production', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns({ idV2: undefined });

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.false;
  });

  it('should call getTypeOfCare with the form data in production', () => {
    setEnvironment(ENVIRONMENTS.VAGOVPROD);
    const mockData = { typeOfCareId: '123' };
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns(mockData); // getFormData
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    renderHook(() => useOHScheduling());

    expect(getTypeOfCareStub.calledWith(mockData)).to.be.true;
  });

  it('should return true in staging even when typeOfCare is undefined', () => {
    setEnvironment(ENVIRONMENTS.VAGOVSTAGING);
    useSelectorStub.onCall(0).returns(true); // selectFeatureUseVpg
    useSelectorStub.onCall(1).returns({}); // getFormData
    getTypeOfCareStub.returns(undefined);

    const { result } = renderHook(() => useOHScheduling());

    expect(result.current).to.be.true;
  });
});
