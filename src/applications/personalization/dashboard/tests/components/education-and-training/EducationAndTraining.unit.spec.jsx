import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import EducationAndTraining from '../../../components/education-and-training/EducationAndTraining';

describe('<EducationAndTraining />', () => {
  it('should render', () => {
    const tree = render(<EducationAndTraining />);

    expect(tree.getByTestId('dashboard-section-education-and-training')).to
      .exist;
    expect(tree.getByTestId('apply-education-benefits-from-cta')).to.exist;
    expect(tree.getByTestId('compare-gi-benefits-from-cta')).to.exist;
    expect(tree.getByTestId('check-gi-bill-benefits-from-cta')).to.exist;
  });

  it('renders expected LOA1 content', () => {
    const tree = render(<EducationAndTraining isLOA1 />);
    expect(tree.queryByTestId('compare-gi-benefits-from-cta')).to.not.exist;
    expect(tree.queryByTestId('check-gi-bill-benefits-from-cta')).to.not.exist;
  });

  it('fires monitoring events on CTA clicks', async () => {
    const events = [];
    const EXPECTED = Array(3)
      .fill('nav-linkslist')
      .toString();
    const recordEvent = e => events.push(e.event);
    const tree = render(<EducationAndTraining rE={recordEvent} />);
    await userEvent.click(
      tree.getByTestId('apply-education-benefits-from-cta'),
    );
    await userEvent.click(tree.getByTestId('compare-gi-benefits-from-cta'));
    await userEvent.click(tree.getByTestId('check-gi-bill-benefits-from-cta'));
    expect(events.toString()).to.equal(EXPECTED);
  });
});
