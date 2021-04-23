// Dependencies.
import { expect } from 'chai';
// relative imports
import { DW_UPDATE_FIELD } from '../../constants';
import { updateField } from '../../actions';

describe('Discharge Wizard Redux Actions', () => {
  describe('updateField', () => {
    it('should return an action in the shape we expect', () => {
      const key = '1_branchOfService';
      const value = 'Army';
      const action = updateField(key, value);

      expect(action).to.be.deep.equal({
        type: DW_UPDATE_FIELD,
        key: '1_branchOfService',
        value: 'Army',
      });
    });
  });
});
