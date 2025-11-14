import { expect } from 'chai';
import {
  updateMyVaLayoutVersion,
  SET_MY_VA_LAYOUT_PREFERENCE,
} from '../../actions/preferences';

describe('preferences actions', () => {
  describe('updateMyVaLayoutVersion', () => {
    it('should return action with type SET_MY_VA_LAYOUT_PREFERENCE', () => {
      const action = updateMyVaLayoutVersion('v1');
      expect(action.type).to.equal(SET_MY_VA_LAYOUT_PREFERENCE);
    });

    it('should return action with layout.version matching input for string version', () => {
      const version = 'v1';
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
    });

    it('should return action with layout.version matching input for numeric version', () => {
      const version = 1;
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
    });

    it('should return action with layout.version matching input for version string "v2"', () => {
      const version = 'v2';
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
      expect(action.type).to.equal(SET_MY_VA_LAYOUT_PREFERENCE);
    });

    it('should return action with layout.version matching input for version string "v3"', () => {
      const version = 'v3';
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
      expect(action.type).to.equal(SET_MY_VA_LAYOUT_PREFERENCE);
    });

    it('should return action with layout.version matching input for empty string', () => {
      const version = '';
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
      expect(action.type).to.equal(SET_MY_VA_LAYOUT_PREFERENCE);
    });

    it('should return action with layout.version matching input for null', () => {
      const version = null;
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
      expect(action.type).to.equal(SET_MY_VA_LAYOUT_PREFERENCE);
    });

    it('should return action with layout.version matching input for undefined', () => {
      const version = undefined;
      const action = updateMyVaLayoutVersion(version);
      expect(action.layout.version).to.equal(version);
      expect(action.type).to.equal(SET_MY_VA_LAYOUT_PREFERENCE);
    });

    it('should return complete action object with correct structure', () => {
      const version = 'v2';
      const action = updateMyVaLayoutVersion(version);
      expect(action).to.deep.equal({
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version,
        },
      });
    });
  });
});
