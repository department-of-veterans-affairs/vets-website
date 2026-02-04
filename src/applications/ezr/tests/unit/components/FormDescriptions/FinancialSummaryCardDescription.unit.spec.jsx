import { expect } from 'chai';
import { render } from '@testing-library/react';
import FinancialSummaryCardDescription from '../../../../components/FormDescriptions/FinancialSummaryCardDescription';

const DEFAULT_PATH = '/household-information/financial-information';
const REVIEW_PATH = '/review-and-submit';

const SPOUSE_TITLE_FRAGMENT = 'Spouse’s annual income';
const EXPENSE_TITLE_FRAGMENT = 'Deductible expenses';

const MOCK_FINANCIAL_DATA = {
  'view:veteranGrossIncome': { veteranGrossIncome: 50000 },
  'view:veteranNetIncome': { veteranNetIncome: 40000 },
  'view:veteranOtherIncome': { veteranOtherIncome: 5000 },
  'view:spouseGrossIncome': { spouseGrossIncome: 30000 },
  'view:spouseNetIncome': { spouseNetIncome: 25000 },
  'view:spouseOtherIncome': { spouseOtherIncome: 2000 },
  'view:deductibleMedicalExpenses': { deductibleMedicalExpenses: 10000 },
  'view:deductibleEducationExpenses': { deductibleEducationExpenses: 5000 },
  'view:deductibleFuneralExpenses': { deductibleFuneralExpenses: 3000 },
};

describe('ezr <FinancialSummaryCardDescription>', () => {
  const subject = ({ hasSpouse = true } = {}) => {
    const formData = {
      'view:householdEnabled': true,
      'view:maritalStatus': {
        maritalStatus: hasSpouse ? 'Married' : 'Single',
      },
    };
    const { container } = render(
      FinancialSummaryCardDescription(MOCK_FINANCIAL_DATA, 0, formData),
    );
    const selectors = () => ({
      h4: container.querySelectorAll('h4'),
      h5: container.querySelectorAll('h5'),
      ul: container.querySelectorAll('ul'),
    });
    return { selectors, textContent: container.textContent };
  };

  it('should not render when item is undefined', () => {
    const result = FinancialSummaryCardDescription(undefined);
    expect(result).to.be.null;
  });

  context('when on the review and submit page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: REVIEW_PATH },
        configurable: true,
      });
    });

    it('should render the correct heading levels', () => {
      const { selectors } = subject();
      expect(selectors().h5).to.have.lengthOf(2);
    });
  });

  context('when on the summary page', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: DEFAULT_PATH },
        configurable: true,
      });
    });

    it('should render the correct heading levels', () => {
      const { selectors } = subject();
      expect(selectors().h4).to.have.lengthOf(2);
    });
  });

  context('when spousal income data is provided', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: DEFAULT_PATH },
        configurable: true,
      });
    });

    it('should render correct number of income lists', () => {
      const { selectors, textContent } = subject();
      expect(selectors().ul).to.have.lengthOf(3);
      expect(textContent).to.include(SPOUSE_TITLE_FRAGMENT);
      expect(textContent).to.include(EXPENSE_TITLE_FRAGMENT);
    });

    it('should display correctly formatted currency values', () => {
      const { textContent } = subject();
      expect(textContent).to.include('$50,000');
      expect(textContent).to.include('$40,000');
    });
  });

  context('when spousal income data is omitted', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { pathname: DEFAULT_PATH },
        configurable: true,
      });
    });

    it('should not render spouse income section when no spouse', () => {
      const { selectors, textContent } = subject({ hasSpouse: false });
      expect(selectors().ul).to.have.lengthOf(2);
      expect(textContent).to.not.include(SPOUSE_TITLE_FRAGMENT);
    });
  });
});
