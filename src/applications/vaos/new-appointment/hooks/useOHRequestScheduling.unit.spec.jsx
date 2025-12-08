import { expect } from 'chai';
import sinon from 'sinon';
import * as redux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { useOHRequestScheduling } from './useOHRequestScheduling';
import * as selectors from '../redux/selectors';

describe('VAOS Hook: useOHRequestScheduling', () => {
  let sandbox;
  let useSelectorStub;
  let getTypeOfCareStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    useSelectorStub = sandbox.stub(redux, 'useSelector');
    getTypeOfCareStub = sandbox.stub(selectors, 'getTypeOfCare');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return false when feature flag is disabled', () => {
    useSelectorStub.onCall(0).returns(false); // featureOHRequest
    useSelectorStub.onCall(1).returns({}); // data
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHRequestScheduling());

    expect(result.current).to.be.false;
  });

  it('should return false when typeOfCare is not in OH_ENABLED_TYPES_OF_CARE', () => {
    useSelectorStub.onCall(0).returns(true); // featureOHRequest
    useSelectorStub.onCall(1).returns({}); // data
    getTypeOfCareStub.returns({ idV2: 'primaryCare' });

    const { result } = renderHook(() => useOHRequestScheduling());

    expect(result.current).to.be.false;
  });

  it('should return true when feature flag is enabled and typeOfCare is foodAndNutrition', () => {
    useSelectorStub.onCall(0).returns(true); // featureOHRequest
    useSelectorStub.onCall(1).returns({}); // data
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHRequestScheduling());

    expect(result.current).to.be.true;
  });

  it('should return false when typeOfCare is undefined', () => {
    useSelectorStub.onCall(0).returns(true); // featureOHRequest
    useSelectorStub.onCall(1).returns({}); // data
    getTypeOfCareStub.returns(undefined);

    const { result } = renderHook(() => useOHRequestScheduling());

    expect(result.current).to.be.false;
  });

  it('should return false when typeOfCare.idV2 is undefined', () => {
    useSelectorStub.onCall(0).returns(true); // featureOHRequest
    useSelectorStub.onCall(1).returns({}); // data
    getTypeOfCareStub.returns({ idV2: undefined });

    const { result } = renderHook(() => useOHRequestScheduling());

    expect(result.current).to.be.false;
  });

  it('should call getTypeOfCare with the form data', () => {
    const mockData = { typeOfCareId: '123' };
    useSelectorStub.onCall(0).returns(true); // featureOHRequest
    useSelectorStub.onCall(1).returns(mockData); // data
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    renderHook(() => useOHRequestScheduling());

    expect(getTypeOfCareStub.calledWith(mockData)).to.be.true;
  });
});
