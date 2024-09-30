import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  deductionCodes,
  renderAdditionalInfo,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes/index.js';

describe('deduction-codes', () => {
  describe('deductionCodes', () => {
    it('should have the correct number of codes', () => {
      expect(Object.keys(deductionCodes).length).to.eq(7);
    });

    it('should have the correct descriptions for each code', () => {
      expect(deductionCodes['30']).to.eq(
        'Disability compensation and pension debt',
      );
      expect(deductionCodes['41']).to.eq('Chapter 34 education debt');
      expect(deductionCodes['75']).to.eq(
        'Post-9/11 GI Bill debt for tuition (school liable)',
      );
    });
  });

  describe('renderAdditionalInfo', () => {
    it('should render additional info for code 30', () => {
      const { getByText } = render(renderAdditionalInfo('30'));
      expect(
        getByText(/The compensation and pension offices sent you a letter/),
      ).to.exist;
    });

    it('should render additional info for education codes', () => {
      const { getByText } = render(renderAdditionalInfo('41'));
      expect(getByText(/The Education office sent you a letter/)).to.exist;
    });

    it('should render additional info for Post-9/11 GI Bill codes', () => {
      const { getByText } = render(renderAdditionalInfo('71'));
      expect(
        getByText(
          /For Post-9\/11 GI Bill debts, please make separate payments/,
        ),
      ).to.exist;
    });

    it('should return null for unknown codes', () => {
      expect(renderAdditionalInfo('99')).to.be.null;
    });
  });

  describe('renderWhyMightIHaveThisDebt', () => {
    it('should render reasons for code 30', () => {
      const { getByText } = render(renderWhyMightIHaveThisDebt('30'));
      expect(
        getByText(
          /Some reasons you have debt related to your compensation and pension benefits/,
        ),
      ).to.exist;
    });

    it('should render reasons for education codes', () => {
      const { getByText } = render(renderWhyMightIHaveThisDebt('41'));
      expect(
        getByText(
          /Some reasons you have debt related to your education benefits/,
        ),
      ).to.exist;
    });

    it('should return null for unknown codes', () => {
      expect(renderWhyMightIHaveThisDebt('99')).to.be.null;
    });
  });
});
