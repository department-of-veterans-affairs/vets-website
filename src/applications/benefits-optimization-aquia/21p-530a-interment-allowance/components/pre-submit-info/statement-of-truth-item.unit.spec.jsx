/**
 * @module tests/components/statement-of-truth-item.unit.spec
 * @description Unit tests for StatementOfTruthItem component
 */

import { expect } from 'chai';
import { StatementOfTruthItem } from './statement-of-truth-item';

describe('StatementOfTruthItem', () => {
  describe('Component Export', () => {
    it('should export StatementOfTruthItem component', () => {
      expect(StatementOfTruthItem).to.exist;
      expect(StatementOfTruthItem).to.be.a('function');
    });

    it('should be a valid React component', () => {
      expect(StatementOfTruthItem.name).to.equal('StatementOfTruthItem');
    });
  });
});
