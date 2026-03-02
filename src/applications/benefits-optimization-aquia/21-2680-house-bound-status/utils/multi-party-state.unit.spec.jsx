/**
 * @module tests/utils/multi-party-state.unit.spec
 * @description Unit tests for multi-party feature toggle state holder
 */

import { expect } from 'chai';
import { setMultiPartyEnabled, isMultiPartyEnabled } from './multi-party-state';

describe('Multi-Party State', () => {
  afterEach(() => {
    setMultiPartyEnabled(false);
  });

  describe('isMultiPartyEnabled', () => {
    it('should default to false', () => {
      expect(isMultiPartyEnabled()).to.be.false;
    });
  });

  describe('setMultiPartyEnabled', () => {
    it('should set state to true', () => {
      setMultiPartyEnabled(true);
      expect(isMultiPartyEnabled()).to.be.true;
    });

    it('should set state to false', () => {
      setMultiPartyEnabled(true);
      setMultiPartyEnabled(false);
      expect(isMultiPartyEnabled()).to.be.false;
    });

    it('should coerce truthy values to boolean', () => {
      setMultiPartyEnabled(1);
      expect(isMultiPartyEnabled()).to.be.true;
    });

    it('should coerce falsy values to boolean', () => {
      setMultiPartyEnabled(true);
      setMultiPartyEnabled(0);
      expect(isMultiPartyEnabled()).to.be.false;
    });

    it('should coerce undefined to false', () => {
      setMultiPartyEnabled(true);
      setMultiPartyEnabled(undefined);
      expect(isMultiPartyEnabled()).to.be.false;
    });

    it('should coerce null to false', () => {
      setMultiPartyEnabled(true);
      setMultiPartyEnabled(null);
      expect(isMultiPartyEnabled()).to.be.false;
    });
  });
});
