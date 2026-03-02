import { render } from '@testing-library/react';
import { expect } from 'chai';
import MedicareSummaryCard from '../../../../components/FormDescriptions/MedicareSummaryCard';

const subject = item => {
  const result = MedicareSummaryCard(item);
  if (!result) return { listItems: [], textContent: '' };

  const { container } = render(result);
  return {
    listItems: container.querySelectorAll('li'),
    textContent: container.textContent,
  };
};

describe('10-10d <MedicareSummaryCard>', () => {
  it('should render Medicare Part A and B', () => {
    const { textContent } = subject({ medicarePlanType: 'ab' });
    expect(textContent).to.include('Original Medicare Parts A and B');
  });

  it('should render Medicare Part C', () => {
    const { textContent } = subject({ medicarePlanType: 'c' });
    expect(textContent).to.include('Medicare Part C');
  });

  it('should render Medicare Part A only', () => {
    const { textContent } = subject({ medicarePlanType: 'a' });
    expect(textContent).to.include('Medicare Part A only');
  });

  it('should render Medicare Part B only', () => {
    const { textContent } = subject({ medicarePlanType: 'b' });
    expect(textContent).to.include('Medicare Part B only');
  });

  it('should include Part D when hasMedicarePartD is true', () => {
    const { textContent } = subject({
      medicarePlanType: 'ab',
      hasMedicarePartD: true,
    });
    expect(textContent).to.include('Original Medicare Parts A and B');
    expect(textContent).to.include('Medicare Part D');
  });

  it('should not include Part D when hasMedicarePartD is false', () => {
    const { textContent } = subject({
      medicarePlanType: 'ab',
      hasMedicarePartD: false,
    });
    expect(textContent).to.include('Original Medicare Parts A and B');
    expect(textContent).to.not.include('Medicare Part D');
  });

  it('should handle missing item', () => {
    const { textContent } = subject(undefined);
    expect(textContent).to.include('Type:');
  });

  it('should handle unknown plan type', () => {
    const { textContent } = subject({ medicarePlanType: 'unknown' });
    expect(textContent).to.include('Type:');
  });

  it('should render one list item', () => {
    const { listItems } = subject({ medicarePlanType: 'ab' });
    expect(listItems).to.have.lengthOf(1);
  });
});
