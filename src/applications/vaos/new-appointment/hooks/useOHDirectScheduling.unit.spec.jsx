import { expect } from 'chai';
import sinon from 'sinon';
import * as redux from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { useOHDirectScheduling } from './useOHDirectScheduling';
import * as selectors from '../redux/selectors';

describe('VAOS Hook: useOHDirectScheduling', () => {
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
    useSelectorStub.onCall(0).returns(false); // featureOHDirectSchedule
    useSelectorStub.onCall(1).returns({}); // data
    getTypeOfCareStub.returns({ idV2: 'foodAndNutrition' });

    const { result } = renderHook(() => useOHDirectScheduling());

    expect(result.current).to.be.false;
  });
});
