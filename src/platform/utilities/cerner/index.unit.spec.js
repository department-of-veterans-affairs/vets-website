// Node modules.
import { expect } from 'chai';
// Relative imports.
import { CERNER_FACILITY_IDS } from '.';
import featureFlagNames from '../feature-toggles/featureFlagNames';

describe('CERNER_FACILITY_IDS', () => {
  it('includes a corresponding feature toggle', () => {
    CERNER_FACILITY_IDS.forEach(CERNER_FACILITY_ID => {
      expect(featureFlagNames[`cernerOverride${CERNER_FACILITY_ID}`]).to.eq(
        `cerner_override_${CERNER_FACILITY_ID}`,
      );
    });
  });
});
