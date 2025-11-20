import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes/index';

describe('deduction-codes', () => {
  describe('deductionCodes', () => {
    it('should have the correct number of codes', () => {
      expect(Object.keys(deductionCodes).length).to.eq(28);
    });

    it('should have the correct descriptions for each code', () => {
      expect(deductionCodes['30']).to.eq(
        'Disability compensation and pension overpayment',
      );
      expect(deductionCodes['41']).to.eq('Chapter 34 education overpayment');
      expect(deductionCodes['75']).to.eq(
        'Post-9/11 GI Bill overpayment for tuition (school liable)',
      );
    });
  });

  describe('renderWhyMightIHaveThisDebt', () => {
    it('should render reasons for code 30', () => {
      const { getByText } = render(renderWhyMightIHaveThisDebt('30'));
      expect(
        getByText(
          'Here are some common reasons for debt from disability and pension overpayments:',
        ),
      ).to.exist;
    });

    it('should render reasons for education codes', () => {
      const { getByText } = render(renderWhyMightIHaveThisDebt('41'));
      expect(
        getByText(
          'Here are some common reasons for debt from education benefit overpayments:',
        ),
      ).to.exist;
    });

    it('should return null for unknown codes', () => {
      expect(renderWhyMightIHaveThisDebt('99')).to.be.null;
    });
  });
});
