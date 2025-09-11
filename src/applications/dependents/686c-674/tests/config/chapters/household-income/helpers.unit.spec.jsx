import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  whatAreAssets,
  netWorthTitle,
} from '../../../../config/chapters/household-income/helpers';
import { NETWORTH_VALUE } from '../../../../config/constants';

describe('household income helpers', () => {
  describe('whatAreAssets', () => {
    it('should render the assets accordion with correct structure', () => {
      const { container } = render(whatAreAssets);

      const accordion = container.querySelector('va-accordion');
      expect(accordion).to.not.be.null;
      expect(accordion.getAttribute('open-single')).to.equal('true');
    });

    it('should render the accordion item with correct attributes', () => {
      const { container } = render(whatAreAssets);

      const accordionItem = container.querySelector('va-accordion-item');
      expect(accordionItem).to.not.be.null;
      expect(accordionItem.getAttribute('id')).to.equal(
        'what-we-count-as-assets',
      );
      expect(accordionItem.getAttribute('header')).to.equal(
        'What we count as assets',
      );
      expect(accordionItem.getAttribute('bordered')).to.equal('true');
      expect(accordionItem.getAttribute('level')).to.equal('4');
    });

    it('should contain the correct content about assets', () => {
      const { container } = render(whatAreAssets);

      const content = container.textContent;
      expect(content).to.include('Assets include the fair market value');
      expect(content).to.include('Investments (like stocks and bonds)');
      expect(content).to.include('Furniture');
      expect(content).to.include('Boats');
    });

    it('should contain the correct content about excluded items', () => {
      const { container } = render(whatAreAssets);

      const content = container.textContent;
      expect(content).to.include('include the value of these items:');
      expect(content).to.include('Your primary residence');
      expect(content).to.include('Your car');
      expect(content).to.include('Basic home items like appliances');
    });

    it('should have two unordered lists', () => {
      const { container } = render(whatAreAssets);

      const lists = container.querySelectorAll('ul');
      expect(lists).to.have.lengthOf(2);
    });

    it('should have the correct number of list items', () => {
      const { container } = render(whatAreAssets);

      const listItems = container.querySelectorAll('li');
      expect(listItems).to.have.lengthOf(6); // 3 in first list + 3 in second list
    });
  });

  describe('netWorthTitle', () => {
    it('should return default title when feature flag is false', () => {
      const result = netWorthTitle({ featureFlag: false });

      expect(result).to.equal(
        `Did the household have a net worth greater than $${NETWORTH_VALUE} in the last tax year?`,
      );
    });

    it('should return default title when feature flag is undefined', () => {
      const result = netWorthTitle({});

      expect(result).to.equal(
        `Did the household have a net worth greater than $${NETWORTH_VALUE} in the last tax year?`,
      );
    });

    it('should return formatted title when feature flag is true and netWorthLimit is provided', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '200000',
      });

      expect(result).to.equal(
        'Did the household have a net worth greater than $200,000 in the last tax year?',
      );
    });

    it('should handle netWorthLimit with commas', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '1,500,000',
      });

      expect(result).to.equal(
        'Did the household have a net worth greater than $1,500,000 in the last tax year?',
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
        `Did the household have a net worth greater than $${expectedValue} in the last tax year?`,
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
        `Did the household have a net worth greater than $${expectedValue} in the last tax year?`,
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
        `Did the household have a net worth greater than $${expectedValue} in the last tax year?`,
      );
    });

    it('should format large numbers correctly', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '12345678',
      });

      expect(result).to.equal(
        'Did the household have a net worth greater than $12,345,678 in the last tax year?',
      );
    });

    it('should handle small numbers correctly', () => {
      const result = netWorthTitle({
        featureFlag: true,
        netWorthLimit: '100',
      });

      expect(result).to.equal(
        'Did the household have a net worth greater than $100 in the last tax year?',
      );
    });
  });
});
