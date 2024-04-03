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
    expect(tree.getByTestId('compare-gi-benefits-from-cta')).to.not.exist;
    expect(tree.getByTestId('check-gi-bill-benefits-from-cta')).to.not.exist;
  });

  it('fires monitoring events on CTA clicks', async () => {
    const user = userEvent.setup();
    const events = [];
    const recordEvent = e => events.push(e.event);
    const tree = render(<EducationAndTraining rE={recordEvent} />);
    await user.click(tree.getByTestId('apply-education-benefits-from-cta'));
    await user.click(tree.getByTestId('compare-gi-benefits-from-cta'));
    await user.click(tree.getByTestId('check-gi-bill-benefits-from-cta'));
    expect(events.toString()).to.equal(Array(3).fill('nav-linkslist'));
  });
});
