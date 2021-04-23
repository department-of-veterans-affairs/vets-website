import { DW_UPDATE_FIELD } from '../../constants';
import { updateField } from '../../actions';

describe('Discharge Wizard Redux Actions', () => {
  describe('updateField', () => {
    it('should return an action in the shape we expect', () => {
      const action = updateField({
        type: DW_UPDATE_FIELD,
        key: '1_branchOfService',
        value: 'Army',
      });

      expect(action).to.be.deep.equal({
        type: DW_UPDATE_FIELD,
        key: '1_branchOfService',
        value: 'Army',
      });
    });
  });
});
