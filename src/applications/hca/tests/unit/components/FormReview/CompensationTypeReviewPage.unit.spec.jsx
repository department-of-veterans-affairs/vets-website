import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CompensationTypeReviewPage, {
  TEXT_LABELS,
} from '../../../../components/FormReview/CompensationTypeReviewPage';

describe('hca CompensationTypeReviewPage', () => {
  const subject = ({ type = 'none' } = {}) => {
    const props = { data: { vaCompensationType: type } };
    const { container } = render(<CompensationTypeReviewPage {...props} />);
    const selectors = () => ({
      dfn: container.querySelector('dd', '.review-row'),
    });
    return { selectors };
  };

  it('should render correct text label when user does not receive disability compensation', () => {
    const { selectors } = subject();
    expect(selectors().dfn).to.contain.text(TEXT_LABELS.default);
  });

  it('should render correct text label when user receives compensation for low disability rating', () => {
    const { selectors } = subject({ type: 'lowDisability' });
    expect(selectors().dfn).to.contain.text(TEXT_LABELS.lowDisability);
  });

  it('should render correct text label when user receives compensation for high disability rating', () => {
    const { selectors } = subject({ type: 'highDisability' });
    expect(selectors().dfn).to.contain.text(TEXT_LABELS.highDisability);
  });
});
