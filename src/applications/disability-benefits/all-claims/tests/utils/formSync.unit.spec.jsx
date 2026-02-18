import { expect } from 'chai';
import sinon from 'sinon';

import {
  shouldSkipSync,
  computeSynchronizedFormData,
} from '../../utils/formSync';

describe('formSync utils', () => {
  describe('shouldSkipSync', () => {
    let isIntroOrStart;

    beforeEach(() => {
      isIntroOrStart = sinon.stub().returns(false);
    });

    it('returns true when not logged in', () => {
      const result = shouldSkipSync({
        loggedIn: false,
        togglesLoading: false,
        formData: { a: 1 },
        flagValue: true,
        pathname: '/somewhere',
        didInit: false,
        isIntroOrStart,
      });

      expect(result).to.equal(true);
    });

    it('returns true when toggles are loading', () => {
      const result = shouldSkipSync({
        loggedIn: true,
        togglesLoading: true,
        formData: { a: 1 },
        flagValue: true,
        pathname: '/somewhere',
        didInit: false,
        isIntroOrStart,
      });

      expect(result).to.equal(true);
    });

    it('returns true when formData is missing', () => {
      const result = shouldSkipSync({
        loggedIn: true,
        togglesLoading: false,
        formData: null,
        flagValue: true,
        pathname: '/somewhere',
        didInit: false,
        isIntroOrStart,
      });

      expect(result).to.equal(true);
    });

    it('returns true when flagValue is not boolean', () => {
      const result = shouldSkipSync({
        loggedIn: true,
        togglesLoading: false,
        formData: { a: 1 },
        flagValue: 'not-a-boolean',
        pathname: '/somewhere',
        didInit: false,
        isIntroOrStart,
      });

      expect(result).to.equal(true);
    });

    it('returns true when didInit is already true', () => {
      const result = shouldSkipSync({
        loggedIn: true,
        togglesLoading: false,
        formData: { a: 1 },
        flagValue: true,
        pathname: '/somewhere',
        didInit: true,
        isIntroOrStart,
      });

      expect(result).to.equal(true);
    });

    it('returns true on intro/start routes', () => {
      isIntroOrStart.returns(true);

      const result = shouldSkipSync({
        loggedIn: true,
        togglesLoading: false,
        formData: { a: 1 },
        flagValue: true,
        pathname: '/start',
        didInit: false,
        isIntroOrStart,
      });

      expect(isIntroOrStart.calledWith('/start')).to.equal(true);
      expect(result).to.equal(true);
    });

    it('returns false when all conditions are met', () => {
      const result = shouldSkipSync({
        loggedIn: true,
        togglesLoading: false,
        formData: { a: 1 },
        flagValue: false,
        pathname: '/form/123',
        didInit: false,
        isIntroOrStart,
      });

      expect(result).to.equal(false);
    });

    it('passes empty string when pathname is falsy', () => {
      // optional: only if you coded pathname normalization inside shouldSkipSync
      shouldSkipSync({
        loggedIn: true,
        togglesLoading: false,
        formData: { a: 1 },
        flagValue: true,
        pathname: undefined,
        didInit: false,
        isIntroOrStart,
      });

      expect(isIntroOrStart.calledWith('')).to.equal(true);
    });
  });

  describe('computeSynchronizedFormData', () => {
    let syncRatedDisabilitiesToNewConditions;
    let syncNewConditionsToRatedDisabilities;
    let normalizeNewDisabilities;

    beforeEach(() => {
      syncRatedDisabilitiesToNewConditions = sinon.stub();
      syncNewConditionsToRatedDisabilities = sinon.stub();
      normalizeNewDisabilities = sinon.stub();
    });

    it('uses rated new when flag enabled and returns updated data', () => {
      const formData = { old: true };
      const migrated = { migrated: 'rated->new' };

      syncRatedDisabilitiesToNewConditions.returns(migrated);
      normalizeNewDisabilities.callsFake(d => d);

      const result = computeSynchronizedFormData({
        formData,
        newConditionsFlowEnabled: true,
        syncRatedDisabilitiesToNewConditions,
        syncNewConditionsToRatedDisabilities,
        normalizeNewDisabilities,
      });

      expect(syncRatedDisabilitiesToNewConditions.calledOnce).to.equal(true);
      expect(
        syncRatedDisabilitiesToNewConditions.calledWith(formData),
      ).to.equal(true);
      expect(normalizeNewDisabilities.calledOnce).to.equal(true);
      expect(result).to.deep.equal(migrated);
    });

    it('uses new rated when flag disabled and returns updated data', () => {
      const formData = { newer: true };
      const migrated = { migrated: 'new->rated' };

      syncNewConditionsToRatedDisabilities.returns(migrated);
      normalizeNewDisabilities.callsFake(d => d);

      const result = computeSynchronizedFormData({
        formData,
        newConditionsFlowEnabled: false,
        syncRatedDisabilitiesToNewConditions,
        syncNewConditionsToRatedDisabilities,
        normalizeNewDisabilities,
      });

      expect(syncNewConditionsToRatedDisabilities.calledOnce).to.equal(true);
      expect(
        syncNewConditionsToRatedDisabilities.calledWith(formData),
      ).to.equal(true);
      expect(result).to.deep.equal(migrated);
    });

    it('returns null when no update is needed (same reference)', () => {
      const formData = { same: true };

      // key: return same object reference
      syncRatedDisabilitiesToNewConditions.returns(formData);
      normalizeNewDisabilities.returns(formData);

      const result = computeSynchronizedFormData({
        formData,
        newConditionsFlowEnabled: true,
        syncRatedDisabilitiesToNewConditions,
        syncNewConditionsToRatedDisabilities,
        normalizeNewDisabilities,
      });

      expect(result).to.equal(null);
    });

    it('returns updated data when normalization changes the reference', () => {
      const formData = { base: true };
      const migrated = { migrated: true };
      const normalized = { normalized: true };

      syncRatedDisabilitiesToNewConditions.returns(migrated);
      normalizeNewDisabilities.returns(normalized);

      const result = computeSynchronizedFormData({
        formData,
        newConditionsFlowEnabled: true,
        syncRatedDisabilitiesToNewConditions,
        syncNewConditionsToRatedDisabilities,
        normalizeNewDisabilities,
      });

      expect(result).to.deep.equal(normalized);
    });
  });
});
