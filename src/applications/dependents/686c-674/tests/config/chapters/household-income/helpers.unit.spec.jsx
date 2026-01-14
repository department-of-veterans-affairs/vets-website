import { expect } from 'chai';
import {
  netWorthTitle,
  netWorthDescription,
} from '../../../../config/chapters/household-income/helpers';
import { NETWORTH_VALUE } from '../../../../config/constants';

describe('household income helpers', () => {
  describe('netWorthDescription', () => {
    it('should return new pension flow description when feature flag is true', () => {
      const result = netWorthDescription(true);

      expect(result).to.equal(
        'Because you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets, your annual income, and the assets and income of your dependents (including your spouse if you are married).',
      );
    });

    it('should return current production description when feature flag is false', () => {
      const result = netWorthDescription(false);

      expect(result).to.equal(
        "If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you're married, include the value of your spouse's assets and annual income too.",
      );
    });

    it('should return current production description when feature flag is undefined', () => {
      const result = netWorthDescription();

      expect(result).to.equal(
        "If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you're married, include the value of your spouse's assets and annual income too.",
      );
    });

    it('should handle null feature flag value', () => {
      const result = netWorthDescription(null);

      expect(result).to.equal(
        "If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you're married, include the value of your spouse's assets and annual income too.",
      );
    });

    it('should handle 0 feature flag value as falsy', () => {
      const result = netWorthDescription(0);

      expect(result).to.equal(
        "If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you're married, include the value of your spouse's assets and annual income too.",
      );
    });

    it('should handle empty string feature flag value as falsy', () => {
      const result = netWorthDescription('');

      expect(result).to.equal(
        "If you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets and your annual income. If you're married, include the value of your spouse's assets and annual income too.",
      );
    });

    it('should handle truthy non-boolean values', () => {
      const result = netWorthDescription('true');

      expect(result).to.equal(
        'Because you currently receive VA pension benefits, we need to know your net worth. Your net worth includes your assets, your annual income, and the assets and income of your dependents (including your spouse if you are married).',
      );
    });
  });

  describe('netWorthTitle', () => {
    it('should return default title when feature flag is false', () => {
      const result = netWorthTitle({ featureFlag: false });

      expect(result).to.equal(
        `Did your household have a net worth greater than $${NETWORTH_VALUE} in the last tax year?`,
      );
    });

    it('should return default title when feature flag is undefined', () => {
      const result = netWorthTitle({});

      expect(result).to.equal(
        `Did your household have a net worth greater than $${NETWORTH_VALUE} in the last tax year?`,
      );
    });

    it('should return formatted title when feature flag is true and netWorthLimit is provided', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '200000',
      });

      expect(result).to.equal(
        'Did your household have a net worth less than $200,000 in the last tax year?',
      );
    });

    it('should handle netWorthLimit with commas', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '1,500,000',
      });

      expect(result).to.equal(
        'Did your household have a net worth less than $1,500,000 in the last tax year?',
      );
    });

    it('should use default NETWORTH_VALUE when netWorthLimit is not provided and feature flag is true', () => {
      const result = netWorthTitle({
        featureFlag: true,
      });

      // When netWorthLimit is undefined, it falls back to NETWORTH_VALUE
      const expectedValue = parseInt(
        NETWORTH_VALUE.replace(/,/g, ''),
        10,
      ).toLocaleString('en-US');
      expect(result).to.equal(
        `Did your household have a net worth less than $${expectedValue} in the last tax year?`,
      );
    });

    it('should handle empty string netWorthLimit', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '',
      });

      // Empty string falls back to NETWORTH_VALUE
      const expectedValue = parseInt(
        NETWORTH_VALUE.replace(/,/g, ''),
        10,
      ).toLocaleString('en-US');
      expect(result).to.equal(
        `Did your household have a net worth less than $${expectedValue} in the last tax year?`,
      );
    });

    it('should handle null netWorthLimit', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: null,
      });

      // When netWorthLimit is null, it falls back to NETWORTH_VALUE
      const expectedValue = parseInt(
        NETWORTH_VALUE.replace(/,/g, ''),
        10,
      ).toLocaleString('en-US');
      expect(result).to.equal(
        `Did your household have a net worth less than $${expectedValue} in the last tax year?`,
      );
    });

    it('should format large numbers correctly', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '12345678',
      });

      expect(result).to.equal(
        'Did your household have a net worth less than $12,345,678 in the last tax year?',
      );
    });

    it('should handle small numbers correctly', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '100',
      });

      expect(result).to.equal(
        'Did your household have a net worth less than $100 in the last tax year?',
      );
    });
  });
});
