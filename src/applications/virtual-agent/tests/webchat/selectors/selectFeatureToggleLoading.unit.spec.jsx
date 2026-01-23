import { expect } from 'chai';
import selectLoadingFeatureToggle from '../../../webchat/selectors/selectFeatureTogglesLoading';

describe('selectLoadingFeatureToggle', () => {
  it('should return true when loading feature toggle is true', () => {
    const state = {
      featureToggles: {
        loading: true,
      },
    };
    expect(selectLoadingFeatureToggle(state)).to.be.true;
  });
  it('should return false when loading feature toggle is false', () => {
    const state = {
      featureToggles: {
        loading: false,
      },
    };
    expect(selectLoadingFeatureToggle(state)).to.be.false;
  });
});
